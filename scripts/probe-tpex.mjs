// 驗證 info.tpex.org.tw 的 ETF 專區 API 是否可用、能否取代目前的推估規模。
//
// 要回答的問題：
//   Q1 etfFilter 怎麼呼叫？不帶條件是否回傳全部上櫃 ETF？
//   Q2 totalAv（規模）、holders（受益人數）、listingDate、indexName、issuer 是否每檔都有值？
//   Q3 回傳裡有沒有收盤價欄位？（若有，或許能省掉每日行情那支數 MB 的大請求）
//   Q4 檔數與代號，跟我們現在的 119 檔是否一致？
//   Q5 官方分類篩選參數是否可用？結果跟我們的代號末碼推導是否吻合？
//   Q6 單一商品頁網址是否有效？
//
// 只發 6 個請求，全部打 info.tpex.org.tw（全新主機，不影響現有來源）。
// 與現有資料的比對直接讀本機 data/etfs.json，不額外發請求。
// 報告寫到 probe/etf-filter-probe.md。

import { mkdir, writeFile, readFile } from 'node:fs/promises';

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';
const FILTER_PAGE = 'https://info.tpex.org.tw/ETF/zh/filter.html';
const API = 'https://info.tpex.org.tw/api/etfFilter';
const lines = [];
const say = (s = '') => { lines.push(s); console.log(s); };
const pause = (ms) => new Promise((done) => setTimeout(done, ms));
const headers = {
  'user-agent': UA,
  accept: 'application/json, text/plain, */*',
  'accept-language': 'zh-TW,zh;q=0.9',
  referer: FILTER_PAGE,
  origin: 'https://info.tpex.org.tw',
};

// 不確定它吃哪一種呼叫方式，依序試：表單 POST → JSON POST → GET
const callApi = async (params = {}) => {
  const styles = [
    { name: 'POST 表單', init: { method: 'POST', headers: { ...headers, 'content-type': 'application/x-www-form-urlencoded;charset=UTF-8' }, body: new URLSearchParams(params) } },
    { name: 'POST JSON', init: { method: 'POST', headers: { ...headers, 'content-type': 'application/json' }, body: JSON.stringify(params) } },
    { name: 'GET', init: { method: 'GET', headers } },
  ];
  const tried = [];
  for (const style of styles) {
    const url = style.name === 'GET' && Object.keys(params).length
      ? `${API}?${new URLSearchParams(params)}`
      : API;
    try {
      const response = await fetch(url, { ...style.init, redirect: 'follow', signal: AbortSignal.timeout(60000) });
      const text = await response.text();
      if (!response.ok) { tried.push(`${style.name}→HTTP ${response.status}`); continue; }
      let json = null;
      try { json = JSON.parse(text); } catch { tried.push(`${style.name}→非 JSON`); continue; }
      return { ok: true, style: style.name, json, tried };
    } catch (error) {
      tried.push(`${style.name}→${error?.cause?.message ?? error.message}`);
    }
    await pause(1200);
  }
  return { ok: false, tried };
};

// 回傳可能是陣列，也可能包在 data / aaData / rows 之類的欄位裡
const rowsOf = (json) => {
  if (Array.isArray(json)) return json;
  for (const key of ['data', 'aaData', 'rows', 'result', 'list', 'items']) {
    if (Array.isArray(json?.[key])) return json[key];
  }
  for (const value of Object.values(json ?? {})) if (Array.isArray(value) && value.length && typeof value[0] === 'object') return value;
  return null;
};

const codeOf = (row) => String(row?.stockNo ?? row?.code ?? Object.values(row ?? {})[0] ?? '').trim();

say('# info.tpex.org.tw ETF 專區 API 驗證');
say('');
say(`探測時間：${new Date().toISOString()}`);
say('');

/* ---------- Q1 主端點 ---------- */
say('## Q1. etfFilter 全量清單');
say('');
const base = await callApi({});
if (!base.ok) {
  say(`❌ 三種呼叫方式都失敗：${base.tried.join('｜')}`);
  say('');
  say('（後續檢查略過）');
} else {
  say(`✅ 成功，可用的呼叫方式：**${base.style}**${base.tried.length ? `（先前嘗試：${base.tried.join('｜')}）` : ''}`);
  const top = Array.isArray(base.json) ? '（頂層就是陣列）' : `頂層欄位：\`${Object.keys(base.json).join('`, `')}\``;
  say(top);
  const rows = rowsOf(base.json);
  if (!rows) {
    say('⚠️ 找不到資料陣列，原始回應前 400 字：');
    say('```');
    say(JSON.stringify(base.json).slice(0, 400));
    say('```');
  } else {
    say(`資料筆數：**${rows.length}**`);
    say('');
    say(`第一筆的所有欄位：`);
    say('```');
    say(Object.keys(rows[0]).join(', '));
    say('```');
    say('');

    /* ---------- Q2 欄位完整度 ---------- */
    say('## Q2. 關鍵欄位完整度');
    say('');
    const FIELDS = ['stockNo', 'stockName', 'listingDate', 'indexName', 'totalAv', 'holders', 'issuer'];
    say('| 欄位 | 有值筆數 | 空值筆數 |');
    say('| --- | --- | --- |');
    for (const f of FIELDS) {
      const filled = rows.filter((r) => r[f] !== undefined && r[f] !== null && String(r[f]).trim() !== '' && String(r[f]).trim() !== '-').length;
      say(`| \`${f}\` | ${filled} | ${rows.length - filled} |`);
    }
    say('');
    say('指標樣本：');
    say('');
    say('```json');
    const samples = ['00679B', '006201', '00937B'].map((c) => rows.find((r) => codeOf(r) === c)).filter(Boolean);
    say(JSON.stringify(samples.length ? samples : rows.slice(0, 2), null, 1).slice(0, 1600));
    say('```');
    say('');

    /* ---------- Q3 有沒有收盤價 ---------- */
    say('## Q3. 是否也提供收盤價');
    say('');
    const priceKeys = Object.keys(rows[0]).filter((k) => /close|price|成交|收盤|volume|av$/i.test(k));
    say(priceKeys.length ? `可能的價格／量能欄位：\`${priceKeys.join('`, `')}\`` : '沒有看起來像收盤價的欄位。');
    say('');

    /* ---------- Q4 與現有資料比對 ---------- */
    say('## Q4. 與目前網站的 119 檔比對');
    say('');
    try {
      const current = JSON.parse(await readFile('data/etfs.json', 'utf8'));
      const ours = current.etfs.filter((e) => e.market === '上櫃');
      const ourCodes = new Set(ours.map((e) => e.code));
      const theirCodes = new Set(rows.map(codeOf).filter(Boolean));
      const onlyTheirs = [...theirCodes].filter((c) => !ourCodes.has(c));
      const onlyOurs = [...ourCodes].filter((c) => !theirCodes.has(c));
      say(`目前網站上櫃：**${ourCodes.size}** 檔　etfFilter：**${theirCodes.size}** 檔`);
      say(`只在 etfFilter 有的（${onlyTheirs.length} 檔）：${onlyTheirs.slice(0, 25).join('、') || '無'}`);
      say(`只在網站有的（${onlyOurs.length} 檔）：${onlyOurs.slice(0, 25).join('、') || '無'}`);
      say('');
      say('### 官方規模 vs 我們的推估規模');
      say('');
      say('| 代號 | 名稱 | 我們推估 | 官方 totalAv | 差異 |');
      say('| --- | --- | --- | --- | --- |');
      let compared = 0; let sumDiff = 0;
      for (const etf of ours) {
        const row = rows.find((r) => codeOf(r) === etf.code);
        const official = Number(String(row?.totalAv ?? '').replace(/,/g, ''));
        if (!row || !Number.isFinite(official) || !official || typeof etf.size !== 'number' || !etf.size) continue;
        compared += 1;
        const diff = Math.abs(etf.size - official) / official * 100;
        sumDiff += diff;
        if (compared <= 8) say(`| ${etf.code} | ${etf.name} | ${etf.size} 億 | ${official} 億 | ${diff.toFixed(1)}% |`);
      }
      say('');
      say(`可比對 ${compared} 檔，平均差異 **${compared ? (sumDiff / compared).toFixed(1) : '—'}%**`);
    } catch (error) {
      say(`⚠️ 讀取現有 data/etfs.json 失敗：${error.message}`);
    }
    say('');

    /* ---------- Q5 官方分類篩選 ---------- */
    say('## Q5. 官方分類篩選 vs 我們的代號末碼');
    say('');
    const suffixOf = (code) => (/[A-Z]$/.test(code) ? code.slice(-1) : '');
    const expectations = [
      { label: '債券', params: { assetType: 'bond' }, suffixes: ['B', 'C', 'D'] },
      { label: '主動式', params: { etfStrategy: 'active' }, suffixes: ['A', 'D'] },
      { label: '槓桿', params: { rewardType: 'L' }, suffixes: ['L'] },
    ];
    const allCodes = rows.map(codeOf).filter(Boolean);
    for (const item of expectations) {
      const res = await callApi(item.params);
      const got = res.ok ? rowsOf(res.json) : null;
      const expected = allCodes.filter((c) => item.suffixes.includes(suffixOf(c)));
      if (!got) {
        say(`- ❌ ${item.label}（\`${new URLSearchParams(item.params)}\`）：${res.tried.join('｜')}`);
      } else {
        const gotCodes = new Set(got.map(codeOf).filter(Boolean));
        const missing = expected.filter((c) => !gotCodes.has(c));
        const extra = [...gotCodes].filter((c) => !expected.includes(c));
        say(`- ✅ ${item.label}：官方 **${gotCodes.size}** 檔　我們代號末碼推得 **${expected.length}** 檔　官方多出 ${extra.length} 檔${extra.length ? `（${extra.slice(0, 10).join('、')}）` : ''}　官方少了 ${missing.length} 檔${missing.length ? `（${missing.slice(0, 10).join('、')}）` : ''}`);
      }
      await pause(1500);
    }
    say('');
  }
}

/* ---------- Q6 商品頁 ---------- */
say('## Q6. 單一商品頁網址');
say('');
const detailUrl = 'https://info.tpex.org.tw/ETF/zh/detail.html?query=00679B';
try {
  const r = await fetch(detailUrl, { headers, redirect: 'follow', signal: AbortSignal.timeout(45000) });
  const text = await r.text();
  say(`\`${detailUrl}\` → HTTP ${r.status}，長度 ${text.length}`);
  say(`內容含「00679B」：${text.includes('00679B') ? '是' : '否'}　含「元大」：${text.includes('元大') ? '是' : '否'}`);
  say('（若是前端渲染的頁面，內容可能不含代號，仍需人工開網址確認）');
} catch (error) {
  say(`❌ 失敗：${error?.cause?.message ?? error.message}`);
}

say('');
say('---');
say('');
say('探測結束，未修改 `data/etfs.json`。');

await mkdir('probe', { recursive: true });
await writeFile('probe/etf-filter-probe.md', `${lines.join('\n')}\n`, 'utf8');
console.log('\n報告已寫入 probe/etf-filter-probe.md');
