// 一次性探測腳本：確認櫃買中心（TPEx）有哪些公開資料端點、欄位長什麼樣。
// 只讀取、不寫入任何正式資料；結果寫到 probe/tpex-probe.md。
// 確認完就可以把 scripts/probe-tpex.mjs、.github/workflows/probe-tpex.yml、probe/ 一起刪掉。

import { mkdir, writeFile } from 'node:fs/promises';

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';
const lines = [];
const say = (s = '') => { lines.push(s); console.log(s); };

const get = async (url, asJson = true) => {
  try {
    const res = await fetch(url, {
      headers: { 'user-agent': UA, accept: asJson ? 'application/json,*/*' : 'text/html,*/*', referer: 'https://www.tpex.org.tw/' },
      redirect: 'follow',
    });
    const text = await res.text();
    let json = null;
    if (asJson) { try { json = JSON.parse(text); } catch { /* 不是 JSON */ } }
    return { ok: res.ok, status: res.status, type: res.headers.get('content-type') || '', text, json };
  } catch (error) {
    return { ok: false, status: 0, type: '', text: String(error.message), json: null };
  }
};

const preview = (value, max = 260) => JSON.stringify(value).slice(0, max);

/* ---------- 1. 找 OpenAPI 規格 ---------- */
say('# 櫃買中心（TPEx）資料端點探測報告');
say('');
say(`探測時間：${new Date().toISOString()}`);
say('');
say('## 1. 尋找 OpenAPI 規格');
say('');

const specCandidates = [
  'https://www.tpex.org.tw/openapi/swagger.json',
  'https://www.tpex.org.tw/openapi/v1/swagger.json',
  'https://www.tpex.org.tw/openapi/v3/api-docs',
  'https://www.tpex.org.tw/openapi/doc.json',
  'https://www.tpex.org.tw/openapi/v1/',
  'https://www.tpex.org.tw/openapi/',
];

let spec = null;
for (const url of specCandidates) {
  const r = await get(url);
  say(`- \`${url}\` → HTTP ${r.status}，${r.type.split(';')[0] || '無 content-type'}，長度 ${r.text.length}`);
  if (!spec && r.json && (r.json.paths || Array.isArray(r.json))) spec = { url, json: r.json };
}
say('');

/* ---------- 2. 列出所有端點，挑出 ETF / 債券相關 ---------- */
say('## 2. 端點清單');
say('');

let etfPaths = [];
if (spec?.json?.paths) {
  const entries = Object.entries(spec.json.paths);
  say(`從 \`${spec.url}\` 取得 **${entries.length}** 個端點。`);
  say('');
  const interesting = entries.filter(([path, def]) => {
    const blob = `${path} ${JSON.stringify(def).slice(0, 800)}`;
    return /etf|bond|債券|基金|受益|規模|净值|淨值/i.test(blob);
  });
  say(`其中與 ETF／債券／基金相關的有 **${interesting.length}** 個：`);
  say('');
  interesting.forEach(([path, def]) => {
    const summary = def?.get?.summary || def?.get?.description || Object.values(def)[0]?.summary || '';
    say(`- \`${path}\` — ${String(summary).slice(0, 120)}`);
    etfPaths.push(path);
  });
  say('');
  say('<details><summary>全部端點路徑</summary>');
  say('');
  entries.forEach(([path, def]) => {
    const summary = def?.get?.summary || Object.values(def)[0]?.summary || '';
    say(`- \`${path}\` — ${String(summary).slice(0, 90)}`);
  });
  say('');
  say('</details>');
} else {
  say('沒有取得可解析的 OpenAPI 規格，改用猜測的端點清單。');
}
say('');

/* ---------- 3. 實際打端點，看欄位 ---------- */
say('## 3. 實際回傳的欄位');
say('');

const base = 'https://www.tpex.org.tw/openapi/v1';
const guesses = [
  '/tpex_mainboard_daily_close_quotes',
  '/tpex_bond_etf_close_quotes',
  '/tpex_etf_close_quotes',
  '/tpex_etf_nav',
  '/tpex_esb_latest_statistics',
];
const targets = [...new Set([...etfPaths.map((p) => (p.startsWith('http') ? p : `${base}${p}`)), ...guesses.map((g) => `${base}${g}`)])].slice(0, 25);

for (const url of targets) {
  const r = await get(url);
  if (!r.ok) { say(`### ❌ \`${url}\``); say(`HTTP ${r.status}`); say(''); continue; }
  const rows = Array.isArray(r.json) ? r.json : Array.isArray(r.json?.data) ? r.json.data : null;
  say(`### ✅ \`${url}\``);
  if (!rows) {
    say(`回傳不是陣列。前 260 字：\`${r.text.slice(0, 260).replace(/\s+/g, ' ')}\``);
    say('');
    continue;
  }
  say(`筆數：**${rows.length}**`);
  if (rows.length) {
    say('');
    say(`欄位：\`${Object.keys(rows[0]).join('`, `')}\``);
    say('');
    say('前 2 筆：');
    say('');
    say('```json');
    say(preview(rows.slice(0, 2), 900));
    say('```');
    // 這批資料裡有沒有我們關心的代號？
    const flat = JSON.stringify(rows);
    const hits = ['00679B', '00687B', '00937B', '006201', '00772B'].filter((c) => flat.includes(c));
    say('');
    say(`包含的指標代號：${hits.length ? hits.join('、') : '（都沒有）'}`);
    const bondish = rows.filter((row) => /^00\d{3,4}[A-Z]?$/.test(String(Object.values(row)[0] ?? '').trim()));
    say(`看起來像 ETF 代號的筆數（第一欄符合 00xxx 格式）：${bondish.length}`);
  }
  say('');
}

/* ---------- 4. 舊式網站 JSON（備援） ---------- */
say('## 4. 網站用的舊式 JSON（備援路徑）');
say('');
const legacy = [
  'https://www.tpex.org.tw/www/zh-tw/bond/bondEtf',
  'https://www.tpex.org.tw/web/etf/etf_specification_bond.php?l=zh-tw',
  'https://www.tpex.org.tw/zh-tw/etf/bond.html',
];
for (const url of legacy) {
  const r = await get(url, false);
  say(`- \`${url}\` → HTTP ${r.status}，長度 ${r.text.length}${r.text.includes('00679B') ? '，**內容含 00679B**' : ''}`);
}
say('');
say('---');
say('');
say('探測結束。這支腳本不會修改 `data/etfs.json`。');

await mkdir('probe', { recursive: true });
await writeFile('probe/tpex-probe.md', `${lines.join('\n')}\n`, 'utf8');
console.log('\n報告已寫入 probe/tpex-probe.md');
