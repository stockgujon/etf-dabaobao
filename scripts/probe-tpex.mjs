// 櫃買中心（TPEx）資料端點探測 v3
// 已確認：/tpex_mainboard_daily_close_quotes 可取得上櫃 ETF 的代號、名稱、收盤價、
// 成交股數與已發行單位數（Capitals），共 119 檔疑似 ETF。
// 這一版要補完最後兩個缺口：
//   Q4 有沒有「上櫃基金／受益憑證基本資料」端點（上市日期、發行人、標的指數、基金類型）？
//   Q5 有沒有任何地方拿得到「受益人數」？
//   Q6 119 檔上櫃 ETF 依代號末碼的組成分佈為何？（決定分類怎麼做）
// 只讀取，不寫入 data/etfs.json。結果寫到 probe/tpex-probe.md。

import { mkdir, writeFile } from 'node:fs/promises';

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';
const SWAGGER = 'https://www.tpex.org.tw/openapi/swagger.json';
const BASE = 'https://www.tpex.org.tw/openapi/v1';

const lines = [];
const say = (s = '') => { lines.push(s); console.log(s); };
const isEtfCode = (s) => /^00\d{3,4}[A-Z]?$/.test(String(s ?? '').trim());

const fetchJson = async (url, tries = 2) => {
  for (let i = 1; i <= tries; i += 1) {
    try {
      const res = await fetch(url, {
        headers: { 'user-agent': UA, accept: 'application/json,*/*', referer: 'https://www.tpex.org.tw/' },
        redirect: 'follow',
        signal: AbortSignal.timeout(60000),
      });
      const text = await res.text();
      if (!res.ok) { if (i === tries) return { ok: false, note: `HTTP ${res.status}` }; continue; }
      try { return { ok: true, json: JSON.parse(text) }; }
      catch { return { ok: false, note: '回傳不是 JSON' }; }
    } catch (error) {
      if (i === tries) return { ok: false, note: `連線失敗：${error.message}` };
      await new Promise((r) => setTimeout(r, 2000));
    }
  }
  return { ok: false, note: '未知錯誤' };
};
const rowsOf = (j) => (Array.isArray(j) ? j : Array.isArray(j?.data) ? j.data : null);

say('# 櫃買中心探測報告 v3｜補完基本資料與受益人數');
say('');
say(`探測時間：${new Date().toISOString()}`);
say('');

/* ========== Q6. 119 檔上櫃 ETF 的組成分佈 ========== */
say('## Q6. 上櫃 ETF 組成分佈');
say('');
let etfRows = [];
const quotes = await fetchJson(`${BASE}/tpex_mainboard_daily_close_quotes`, 3);
if (!quotes.ok) say(`❌ 無法取得行情：${quotes.note}`);
else {
  const rows = rowsOf(quotes.json) ?? [];
  etfRows = rows.filter((r) => isEtfCode(r.SecuritiesCompanyCode));
  say(`上櫃 ETF 共 **${etfRows.length}** 檔（資料日 ${etfRows[0]?.Date ?? '—'}）`);
  say('');
  const bucket = {};
  etfRows.forEach((r) => {
    const code = r.SecuritiesCompanyCode.trim();
    const last = /[A-Z]$/.test(code) ? code.slice(-1) : '（無英文尾碼）';
    bucket[last] = (bucket[last] ?? 0) + 1;
  });
  const meaning = { B: '債券（台幣計價）', C: '債券（外幣計價）', A: '主動式股票', D: '主動式債券', L: '槓桿', R: '反向', T: '多資產', U: '期貨信託', '（無英文尾碼）': '一般股票型' };
  say('| 代號末碼 | 櫃買定義 | 檔數 |');
  say('| --- | --- | --- |');
  Object.entries(bucket).sort((a, b) => b[1] - a[1]).forEach(([k, v]) => say(`| ${k} | ${meaning[k] ?? '未知'} | ${v} |`));
  say('');
  const noSuffix = etfRows.filter((r) => !/[A-Z]$/.test(r.SecuritiesCompanyCode.trim()));
  say(`無英文尾碼的（可能是股票型）：${noSuffix.map((r) => `${r.SecuritiesCompanyCode} ${r.CompanyName}`).join('、') || '無'}`);
  say('');
  // 規模推估合理性抽查
  say('規模推估抽查（Capitals × Close ÷ 1e8 = 億元）：');
  say('');
  ['00679B', '00687B', '00937B', '006201'].forEach((c) => {
    const r = etfRows.find((x) => x.SecuritiesCompanyCode.trim() === c);
    if (!r) { say(`- ${c}：不在清單`); return; }
    const cap = Number(String(r.Capitals).replace(/,/g, ''));
    const close = Number(String(r.Close).replace(/,/g, ''));
    say(`- ${c} ${r.CompanyName}：${(cap * close / 1e8).toFixed(0)} 億（單位數 ${cap.toLocaleString()}，收盤 ${close}）`);
  });
  say('');
}

/* ========== Q4/Q5. 找基本資料與受益人數 ========== */
const spec = await fetchJson(SWAGGER, 2);
say('## Q4. 基本資料類端點（上市日期／發行人／標的指數）');
say('');
const guesses = ['/mopsfin_t187ap47_O', '/mopsfin_t187ap47_R', '/tpex_mainboard_basic', '/tpex_company_basic_info', '/tpex_securities_basic'];
let candidates = [...guesses];

if (!spec.ok) say(`（swagger 讀取失敗：${spec.note}，只測猜測端點）`);
else {
  const paths = Object.entries(spec.json.paths ?? {});
  const summaryOf = (def) => { const op = def?.get ?? Object.values(def ?? {})[0] ?? {}; return String(op.summary || op.description || '').replace(/\s+/g, ' ').trim(); };
  const hit = paths.filter(([p, def]) => /t187ap4|基本資料|基本資訊|概況|受益人|持股分散|發行單位|成立日|掛牌/.test(`${p} ${summaryOf(def)}`));
  if (!hit.length) say('swagger 裡沒有任何端點提到基本資料／受益人／掛牌日。');
  else hit.forEach(([p, def]) => { say(`- \`${p}\` — ${summaryOf(def)}`); candidates.push(p); });
  say('');
  const holder = paths.filter(([p, def]) => /受益人|股東人數|集保|分散表/.test(`${p} ${summaryOf(def)}`));
  say('## Q5. 受益人數相關端點');
  say('');
  if (!holder.length) say('**swagger 裡沒有任何端點提供受益人數。**');
  else holder.forEach(([p, def]) => { say(`- \`${p}\` — ${summaryOf(def)}`); candidates.push(p); });
  say('');
}

say('## 實測基本資料端點');
say('');
for (const p of [...new Set(candidates)].slice(0, 12)) {
  const url = p.startsWith('http') ? p : `${BASE}${p}`;
  const r = await fetchJson(url, 1);
  if (!r.ok) { say(`- ❌ \`${p}\` — ${r.note}`); continue; }
  const rows = rowsOf(r.json);
  if (!rows?.length) { say(`- ⚠️ \`${p}\` — 空資料`); continue; }
  const flat = JSON.stringify(rows);
  const hits = ['00679B', '00687B', '006201'].filter((c) => flat.includes(c));
  say(`- ✅ \`${p}\` — ${rows.length} 筆，命中 ETF 代號：${hits.length ? hits.join('、') : '無'}`);
  say(`  欄位：\`${Object.keys(rows[0]).join('`, `')}\``);
  if (hits.length) {
    const sample = rows.find((row) => JSON.stringify(row).includes(hits[0]));
    say('');
    say('```json');
    say(JSON.stringify(sample, null, 1).slice(0, 800));
    say('```');
    say('');
  }
}
say('');

/* ========== 外部備援：集保受益人數 ========== */
say('## 外部備援：集保結算所');
say('');
for (const url of [
  'https://openapi.tdcc.com.tw/v1/swagger.json',
  'https://openapi.tdcc.com.tw/swagger/v1/swagger.json',
  'https://www.tdcc.com.tw/portal/zh/openAPI',
]) {
  const r = await fetchJson(url, 1);
  say(`- ${r.ok ? '✅' : '❌'} \`${url}\`${r.ok ? '' : ` — ${r.note}`}`);
}

say('');
say('---');
say('');
say('探測結束，未修改 `data/etfs.json`。');

await mkdir('probe', { recursive: true });
await writeFile('probe/tpex-probe.md', `${lines.join('\n')}\n`, 'utf8');
console.log('\n報告已寫入 probe/tpex-probe.md');
