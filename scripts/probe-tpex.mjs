// 櫃買中心（TPEx）資料端點探測 v2
// 第一版已確認 https://www.tpex.org.tw/openapi/swagger.json 可讀、共 225 個端點。
// 這一版專門回答三個問題，並且由腳本自己下結論、只輸出精簡結果：
//   Q1 上櫃 ETF 的「代號 / 名稱 / 收盤價 / 成交量」拿不拿得到？
//   Q2 上櫃 ETF 的「資產規模 / 受益人數」拿不拿得到？
//   Q3 上櫃 ETF 到底有幾檔？
// 只讀取，不寫入 data/etfs.json。結果寫到 probe/tpex-probe.md。

import { mkdir, writeFile } from 'node:fs/promises';

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';
const SWAGGER = 'https://www.tpex.org.tw/openapi/swagger.json';
const BASE = 'https://www.tpex.org.tw/openapi/v1';

const lines = [];
const say = (s = '') => { lines.push(s); console.log(s); };

// 目標代號：三檔知名上櫃債券 ETF + 唯一的上櫃股票型 ETF
const TARGETS = ['00679B', '00687B', '00937B', '00772B', '00773B', '006201'];
const isEtfCode = (s) => /^00\d{3,4}[A-Z]?$/.test(String(s ?? '').trim());

const fetchJson = async (url, tries = 3) => {
  for (let i = 1; i <= tries; i += 1) {
    try {
      const res = await fetch(url, {
        headers: { 'user-agent': UA, accept: 'application/json,*/*', referer: 'https://www.tpex.org.tw/' },
        redirect: 'follow',
        signal: AbortSignal.timeout(60000),
      });
      const text = await res.text();
      if (!res.ok) { if (i === tries) return { ok: false, status: res.status, note: `HTTP ${res.status}` }; continue; }
      try { return { ok: true, status: res.status, json: JSON.parse(text), size: text.length }; }
      catch { return { ok: false, status: res.status, note: `回傳不是 JSON（前 120 字：${text.slice(0, 120).replace(/\s+/g, ' ')}）` }; }
    } catch (error) {
      if (i === tries) return { ok: false, status: 0, note: `連線失敗：${error.message}` };
      await new Promise((r) => setTimeout(r, 3000));
    }
  }
  return { ok: false, status: 0, note: '未知錯誤' };
};

const rowsOf = (json) => (Array.isArray(json) ? json : Array.isArray(json?.data) ? json.data : null);

const describe = (rows) => {
  const keys = Object.keys(rows[0] ?? {});
  const flat = JSON.stringify(rows);
  const hits = TARGETS.filter((c) => flat.includes(c));
  const etfLike = rows.filter((row) => Object.values(row).slice(0, 3).some(isEtfCode));
  return { keys, hits, etfLike };
};

say('# 櫃買中心（TPEx）資料端點探測報告 v2');
say('');
say(`探測時間：${new Date().toISOString()}`);
say('');

/* ================= 0. 取得 swagger ================= */
const spec = await fetchJson(SWAGGER);
if (!spec.ok) {
  say(`## ❌ 無法取得 swagger.json（${spec.note}）`);
} else {
  const paths = Object.entries(spec.json.paths ?? {});
  say(`swagger.json 讀取成功，共 **${paths.length}** 個端點。`);
  say('');

  const summaryOf = (def) => {
    const op = def?.get ?? Object.values(def ?? {})[0] ?? {};
    return String(op.summary || op.description || '').replace(/\s+/g, ' ').trim();
  };

  /* ---------- A. 哪些端點的說明裡有「ETF」 ---------- */
  say('## A. 說明含「ETF」的端點');
  say('');
  const etfPaths = paths.filter(([p, def]) => /ETF/i.test(`${p} ${summaryOf(def)}`));
  if (!etfPaths.length) say('**沒有任何端點的名稱或說明包含 ETF。**');
  else etfPaths.forEach(([p, def]) => say(`- \`${p}\` — ${summaryOf(def)}`));
  say('');

  /* ---------- B. 哪些端點的說明裡有規模 / 受益人數 / 淨值 ---------- */
  say('## B. 說明含「受益人數／規模／淨值／資產」的端點');
  say('');
  const sizePaths = paths.filter(([p, def]) => /受益|規模|淨值|資產|發行額/.test(`${p} ${summaryOf(def)}`));
  if (!sizePaths.length) say('**沒有任何端點提到受益人數、規模、淨值或資產。**');
  else sizePaths.forEach(([p, def]) => say(`- \`${p}\` — ${summaryOf(def)}`));
  say('');

  /* ---------- C. 每日行情類端點 ---------- */
  say('## C. 每日行情／收盤類端點');
  say('');
  const quotePaths = paths.filter(([p, def]) => /行情|收盤|成交|quote|close/i.test(`${p} ${summaryOf(def)}`));
  quotePaths.slice(0, 30).forEach(([p, def]) => say(`- \`${p}\` — ${summaryOf(def)}`));
  say('');

  /* ---------- D. 實際打行情端點，找 ETF ---------- */
  say('## D. 實測：行情端點裡找得到上櫃 ETF 嗎');
  say('');

  const candidates = [...new Set([
    ...quotePaths.map(([p]) => p),
    '/tpex_mainboard_daily_close_quotes',
  ])].slice(0, 12);

  let best = null;
  for (const p of candidates) {
    const url = p.startsWith('http') ? p : `${BASE}${p}`;
    const r = await fetchJson(url, 2);
    if (!r.ok) { say(`- ❌ \`${p}\` — ${r.note}`); continue; }
    const rows = rowsOf(r.json);
    if (!rows || !rows.length) { say(`- ⚠️ \`${p}\` — 回傳空資料`); continue; }
    const { keys, hits, etfLike } = describe(rows);
    say(`- ✅ \`${p}\` — ${rows.length} 筆，疑似 ETF 代號 ${etfLike.length} 筆，命中目標代號：${hits.length ? hits.join('、') : '無'}`);
    if (hits.length && (!best || hits.length > best.hits.length)) best = { path: p, url, rows, keys, hits, etfLike };
  }
  say('');

  if (best) {
    say('### 🎯 找到了');
    say('');
    say(`端點：\`${best.url}\``);
    say(`總筆數：**${best.rows.length}**，其中代號長得像 ETF 的有 **${best.etfLike.length}** 筆`);
    say('');
    say(`欄位：\`${best.keys.join('`, `')}\``);
    say('');
    say('目標代號的完整資料：');
    say('');
    say('```json');
    const samples = best.rows.filter((row) => TARGETS.some((c) => JSON.stringify(row).includes(c)));
    say(JSON.stringify(samples.slice(0, 4), null, 1));
    say('```');
    say('');
    say('前 8 筆疑似 ETF：');
    say('');
    say('```json');
    say(JSON.stringify(best.etfLike.slice(0, 8), null, 1));
    say('```');
  } else {
    say('### ❌ 所有行情端點都找不到目標 ETF 代號');
  }
  say('');
}

/* ================= E. 備援來源 ================= */
say('## E. 備援來源測試');
say('');

const fallbacks = [
  ['證交所 上市基金基本資料', 'https://openapi.twse.com.tw/v1/opendata/t187ap47_L'],
  ['證交所 上市每日行情', 'https://openapi.twse.com.tw/v1/exchangeReport/STOCK_DAY_ALL'],
  ['集保 OpenAPI 規格', 'https://openapi-t.tdcc.com.tw/v3/api-docs'],
];

for (const [label, url] of fallbacks) {
  const r = await fetchJson(url, 1);
  if (!r.ok) { say(`- ❌ ${label} \`${url}\` — ${r.note}`); continue; }
  const rows = rowsOf(r.json);
  if (!rows) { say(`- ✅ ${label} — 可讀，非陣列格式（${r.size} bytes）`); continue; }
  const flat = JSON.stringify(rows);
  const hits = TARGETS.filter((c) => flat.includes(c));
  say(`- ✅ ${label} — ${rows.length} 筆，命中目標代號：${hits.length ? hits.join('、') : '無'}`);
  if (hits.length) {
    const sample = rows.find((row) => JSON.stringify(row).includes(hits[0]));
    say('');
    say('```json');
    say(JSON.stringify(sample, null, 1).slice(0, 900));
    say('```');
    say('');
  }
}

say('');
say('---');
say('');
say('探測結束，未修改 `data/etfs.json`。');

await mkdir('probe', { recursive: true });
await writeFile('probe/tpex-probe.md', `${lines.join('\n')}\n`, 'utf8');
console.log('\n報告已寫入 probe/tpex-probe.md');
