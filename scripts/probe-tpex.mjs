// 探測 v4：找出證交所哪一支端點會回傳「上市收盤價的交易日」。
// 目前 meta.listedPriceDate 是 null，代表先前猜的兩支端點沒給日期，
// 所以上市 ETF 的收盤價下方標不出日期（上櫃有，因為櫃買每列都帶 Date）。
//
// 這支腳本很輕：總共只發 7 個 GET，逐一送出、每個間隔 1.5 秒，不會造成負擔。
// 結果寫到 probe/tpex-probe.md。跑完就可以連同工作流程一起刪掉。

import { mkdir, writeFile } from 'node:fs/promises';

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';
const lines = [];
const say = (s = '') => { lines.push(s); console.log(s); };
const pause = (ms) => new Promise((done) => setTimeout(done, ms));

const get = async (url) => {
  try {
    const response = await fetch(url, {
      headers: {
        'user-agent': UA,
        accept: 'application/json, text/html, */*',
        'accept-language': 'zh-TW,zh;q=0.9',
        referer: 'https://www.twse.com.tw/zh/',
      },
      redirect: 'follow',
      signal: AbortSignal.timeout(60000),
    });
    const text = await response.text();
    let json = null;
    try { json = JSON.parse(text); } catch { /* 不是 JSON */ }
    return { ok: response.ok, status: response.status, text, json };
  } catch (error) {
    const cause = error?.cause?.message;
    return { ok: false, status: 0, text: '', json: null, error: cause ? `${error.message}：${cause}` : error.message };
  }
};

// 從任意文字裡找出日期：西元 YYYYMMDD、YYYY/MM/DD、YYYY.MM.DD，或民國 115年09月08日
const findDates = (text) => {
  const hits = new Set();
  for (const m of text.matchAll(/\b(20\d{2})(\d{2})(\d{2})\b/g)) hits.add(`${m[1]}.${m[2]}.${m[3]}`);
  for (const m of text.matchAll(/\b(20\d{2})[./-](\d{1,2})[./-](\d{1,2})\b/g)) hits.add(`${m[1]}.${String(m[2]).padStart(2, '0')}.${String(m[3]).padStart(2, '0')}`);
  for (const m of text.matchAll(/(\d{3})\s*年\s*(\d{1,2})\s*月\s*(\d{1,2})\s*日/g)) hits.add(`${Number(m[1]) + 1911}.${String(m[2]).padStart(2, '0')}.${String(m[3]).padStart(2, '0')}`);
  return [...hits].slice(0, 6);
};

const CANDIDATES = [
  ['A', 'https://www.twse.com.tw/rwd/zh/afterTrading/STOCK_DAY_ALL?response=json'],
  ['B', 'https://www.twse.com.tw/exchangeReport/STOCK_DAY_ALL?response=json'],
  ['C', 'https://www.twse.com.tw/rwd/zh/afterTrading/BWIBBU_ALL?response=json'],
  ['D', 'https://www.twse.com.tw/rwd/zh/afterTrading/MI_INDEX?type=ALL&response=json'],
  ['E', 'https://www.twse.com.tw/rwd/zh/afterTrading/STOCK_DAY_AVG_ALL?response=json'],
  ['F', 'https://openapi.twse.com.tw/v1/exchangeReport/BWIBBU_ALL'],
];

say('# 證交所「上市收盤價交易日」端點探測 v4');
say('');
say(`探測時間：${new Date().toISOString()}`);
say('');
say('目標：找出哪一支端點能提供上市收盤價的實際交易日。');
say('');

for (const [tag, url] of CANDIDATES) {
  const r = await get(url);
  say(`## ${tag}. \`${url}\``);
  say('');
  if (!r.ok) {
    say(`❌ 失敗：${r.error ?? `HTTP ${r.status}`}`);
    say('');
    await pause(1500);
    continue;
  }
  say(`HTTP ${r.status}，長度 ${r.text.length}，${r.json ? 'JSON' : '非 JSON'}`);
  if (r.json && !Array.isArray(r.json)) {
    say(`頂層欄位：\`${Object.keys(r.json).join('`, `')}\``);
    if (r.json.date !== undefined) say(`**date 欄位：\`${r.json.date}\`** ← 這就是要的`);
    if (r.json.title !== undefined) say(`title：\`${String(r.json.title).slice(0, 80)}\``);
    if (r.json.stat !== undefined) say(`stat：\`${r.json.stat}\``);
    const arr = Array.isArray(r.json.data) ? r.json.data : null;
    if (arr) say(`data 筆數：${arr.length}`);
  } else if (Array.isArray(r.json)) {
    say(`陣列，${r.json.length} 筆`);
    if (r.json.length) say(`第一筆欄位：\`${Object.keys(r.json[0]).join('`, `')}\``);
  }
  const dates = findDates(r.text.slice(0, 4000));
  say(`文字中找到的日期：${dates.length ? dates.join('、') : '（無）'}`);
  say('');
  await pause(1500);
}

// 順便確認 e添富 首頁那行「資料更新時間」到底寫什麼、旁邊有沒有別的日期
say('## G. e添富 首頁的日期標示');
say('');
const home = await get('https://www.twse.com.tw/rwd/zh/ETFortune/index');
if (!home.ok) say(`❌ 失敗：${home.error ?? `HTTP ${home.status}`}`);
else {
  const idx = home.text.indexOf('資料更新時間');
  say(`HTTP ${home.status}，長度 ${home.text.length}`);
  if (idx >= 0) {
    const snippet = home.text.slice(Math.max(0, idx - 150), idx + 200).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    say('「資料更新時間」附近的文字：');
    say('');
    say('```');
    say(snippet);
    say('```');
  } else {
    say('頁面中找不到「資料更新時間」字樣。');
  }
  say('');
  say(`整頁找到的日期：${findDates(home.text).join('、') || '（無）'}`);
}

say('');
say('---');
say('');
say('探測結束，未修改 `data/etfs.json`。');

await mkdir('probe', { recursive: true });
await writeFile('probe/tpex-probe.md', `${lines.join('\n')}\n`, 'utf8');
console.log('\n報告已寫入 probe/tpex-probe.md');
