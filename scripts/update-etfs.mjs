// data/etfs.json 每日同步腳本（只在 GitHub Actions 執行，不由訪客瀏覽器執行）
// 由 reference-source/scripts/sync-etf-snapshot.mjs 改寫：沿用相同的證交所端點、
// ETF e添富篩選代碼、單位換算、投資標的、分類與風險邏輯。
//
// 規則：
//   1. 資料已是台灣當天日期且上次同步成功 → 直接跳過，不動資料檔。
//   2. 完成全部驗證才原子替換整個 ETF 陣列。
//   3. 失敗或當日尚無完整官方資料 → 保留既有 etfs 與 officialDate，
//      只更新 meta.lastAttemptAt / meta.syncStatus / meta.syncWarning。

import { readFile, writeFile, rename } from 'node:fs/promises';
import { resolve } from 'node:path';

const DATA_PATH = resolve('data', 'etfs.json');
const TMP_PATH = resolve('data', 'etfs.json.tmp');

const sourceUrl = 'https://www.twse.com.tw/zh/ETFortune/products';
const productsEndpoint = 'https://www.twse.com.tw/rwd/zh/ETFortune/ajaxProductsResult';
const userAgent = 'ETF-Lens/1.0 (github pages snapshot build)';

// 上櫃（櫃買中心）——證交所 ETF e添富 只涵蓋上市，上櫃 ETF 需另外從櫃買中心取得。
// 已實測：/tpex_mainboard_daily_close_quotes 是唯一同時提供代號、名稱、收盤價、
// 成交股數與已發行受益權單位數（Capitals）的端點；櫃買未公開受益人數與基金基本資料。
const tpexSourceUrl = 'https://www.tpex.org.tw/zh-tw/index.html';
const tpexEndpoint = 'https://www.tpex.org.tw/openapi/v1/tpex_mainboard_daily_close_quotes';
const isEtfCode = (value) => /^00\d{3,4}[A-Z]?$/.test(String(value ?? '').trim());

const FILTER_GROUPS = [
  { name: '市值型', filters: [['hashtag', 'ff808081899b8efc0189aa066a5a0020'], ['hashtag', 'ff808081899b8efc0189aa06d5ce0021'], ['hashtag', 'ff808081899b8efc0189aa070e910022']] },
  { name: '產業型', filters: [['hashtag', 'ff808081899b8efc0189aa074b8d0023'], ['hashtag', 'ff808081899b8efc0189aa0786cb0024'], ['hashtag', 'ff808081899b8efc0189aa07ec700025'], ['hashtag', 'ff808081899b8efc0189aa082e6d0026']] },
  { name: '高股息', filters: [['hashtag', 'ff808081899b8efc0189aa050440001c'], ['hashtag', 'ff808081899b8efc0189aa05af5c001d']] },
  { name: '債券型', filters: [['assetType', 'Bond']] },
  { name: '槓桿型', filters: [['rewardType', 'L']] },
  { name: '反向型', filters: [['rewardType', 'I']] },
  { name: '商品型', filters: [['assetType', 'RawMaterial']] },
  { name: '主動型', filters: [['managerType', 'Active']] },
  { name: 'ESG型', filters: [['hashtag', 'ff808081899b8efc0189aa0864d40027']] },
  { name: '因子型', filters: [['hashtag', 'ff808081899b8efc0189aa05ed24001e'], ['hashtag', 'ff808081899b8efc0189aa06281f001f']] },
  { name: '多資產', filters: [['assetType', 'MultiAsset']] },
  { name: '外匯型', filters: [['assetType', 'FX']] },
  { name: 'REITs', filters: [['assetType', 'REITs']] },
];

const taiwanToday = () => new Intl.DateTimeFormat('zh-TW', {
  timeZone: 'Asia/Taipei', year: 'numeric', month: '2-digit', day: '2-digit',
}).format(new Date()).replaceAll('/', '.');

const createBody = (filters = []) => {
  const body = new URLSearchParams();
  [
    ['rangeTotalAv', '0'], ['rangeTotalAv', '999999'],
    ['rangeValueYTD', '0'], ['rangeValueYTD', '999999'],
    ['rangeClose1', '0'], ['rangeClose1', '999999'],
    ['stkNo', ''], ['sort', ''], ['orderBy', ''],
    ...filters,
  ].forEach(([key, value]) => body.append(key, value));
  return body;
};

const fetchRows = async (filters = []) => {
  const response = await fetch(productsEndpoint, {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
      referer: sourceUrl,
      'user-agent': userAgent,
    },
    body: createBody(filters),
    redirect: 'follow',
  });
  if (!response.ok) throw new Error(`TWSE response ${response.status}`);
  const payload = await response.json();
  if (payload.status !== 'success' || !Array.isArray(payload.data)) throw new Error('Unexpected TWSE payload');
  return payload.data;
};

const toNumber = (value) => {
  const parsed = Number(String(value ?? '').replaceAll(',', '').trim());
  return Number.isFinite(parsed) ? parsed : null;
};

// 日成交量：STOCK_DAY_ALL 的 TradeVolume 原始單位為股，1,000 股 = 1 張。
const sharesToLots = (value) => {
  const shares = toNumber(value);
  return shares === null ? null : shares / 1000;
};

const includesAny = (value, words) => words.some((word) => value.includes(word));

const buildInvestmentTarget = (fundType, indexName, name, categories) => {
  const text = `${fundType} ${indexName} ${name}`;
  let market = '台灣股票';
  if (includesAny(text, ['黃金'])) market = '黃金';
  else if (includesAny(text, ['原油', '石油'])) market = '原油';
  else if (includesAny(text, ['銅'])) market = '銅';
  else if (includesAny(text, ['白銀'])) market = '白銀';
  else if (categories.includes('商品型') || includesAny(text, ['原物料', '期貨信託'])) market = '原物料';
  else if (categories.includes('外匯型') || includesAny(text, ['美元', '日圓', '人民幣正', '外匯'])) market = '外匯';
  else if (categories.includes('REITs') || includesAny(text, ['REIT', '不動產'])) market = 'REITs';
  else if (categories.includes('多資產') || includesAny(text, ['平衡型', '多資產'])) market = '多資產';
  else if (categories.includes('債券型') || includesAny(text, ['債券', '公債', '公司債', '金融債', '高收益債'])) {
    if (includesAny(text, ['美國公債', '美債'])) market = '美國公債';
    else if (includesAny(text, ['非投資等級', '高收益'])) market = '非投資級債';
    else if (includesAny(text, ['投資等級'])) market = '投資級債';
    else if (includesAny(text, ['新興市場'])) market = '新興市場債';
    else if (includesAny(text, ['金融債'])) market = '金融債';
    else market = '債券';
  } else if (includesAny(text, ['台日韓', '亞洲'])) market = '亞洲股票';
  else if (includesAny(text, ['美國', '標普', 'S&P', 'NASDAQ', 'Nasdaq', 'NYSE', '費城', 'FANG'])) market = '美國股票';
  else if (includesAny(text, ['日本', 'Nikkei', 'TOPIX', '東證'])) market = '日本股票';
  else if (includesAny(text, ['中國', '中證', '沪深', '上證', '深證', '陸股'])) market = '中國股票';
  else if (includesAny(text, ['印度'])) market = '印度股票';
  else if (includesAny(text, ['越南'])) market = '越南股票';
  else if (includesAny(text, ['歐洲'])) market = '歐洲股票';
  else if (includesAny(text, ['全球', '全世界', 'ACWI', 'MSCI World'])) market = '全球股票';
  else if (includesAny(fundType, ['國外', '境外'])) market = '國外股票';

  let strategy = categories.includes('主動型') || fundType.includes('主動式') ? '主動選股' : '';
  if (!strategy && includesAny(text, ['高股息', '高息', '股利'])) strategy = '高股息';
  if (!strategy && includesAny(text, ['半導體'])) strategy = '半導體';
  if (!strategy && includesAny(text, ['人工智慧', 'AI', 'FANG', 'NASDAQ', 'Nasdaq', '科技'])) strategy = '科技';
  if (!strategy && includesAny(text, ['金融'])) strategy = '金融';
  if (!strategy && includesAny(text, ['生技', '醫療'])) strategy = '生技醫療';
  if (!strategy && includesAny(text, ['電動車', '車聯網'])) strategy = '電動車';
  if (!strategy && includesAny(text, ['PCB', '印刷電路板'])) strategy = 'PCB';
  if (!strategy && categories.includes('槓桿型')) strategy = '槓桿';
  if (!strategy && categories.includes('反向型')) strategy = '反向';
  if (!strategy && categories.includes('ESG型')) strategy = 'ESG';
  if (!strategy && categories.includes('因子型')) strategy = '因子';
  if (!strategy && categories.includes('產業型')) strategy = '產業主題';
  if (!strategy && categories.includes('市值型')) strategy = '市值型';
  if (!strategy && market === '美國公債' && includesAny(text, ['20年', '20+'])) strategy = '20年以上';
  if (!strategy && ['黃金', '原油', '銅', '白銀', '原物料'].includes(market)) strategy = '期貨';
  return strategy ? `${market}｜${strategy}` : market;
};

const classifyEtf = ({ fundType, indexName, investmentTarget, name, categories }) => {
  const text = `${fundType} ${indexName} ${investmentTarget} ${name}`;
  const managementStyle = categories.includes('主動型') || includesAny(text, ['主動式', '主動選股']) ? '主動式' : '被動式';
  const productStructure = categories.includes('槓桿型') ? '槓桿' : categories.includes('反向型') ? '反向' : '原型';

  let assetClass = '台灣股票';
  if (categories.includes('債券型') || includesAny(text, ['債券', '公債', '公司債', '金融債', '高收益債', '投資級債', '非投資級債'])) assetClass = '債券';
  else if (categories.includes('商品型') || includesAny(text, ['期貨信託', '原物料', '黃金', '原油', '石油', '白銀', '銅'])) assetClass = '商品';
  else if (categories.includes('多資產') || includesAny(text, ['多資產', '平衡型'])) assetClass = '多資產';
  else if (categories.includes('REITs') || includesAny(text, ['REIT', '不動產'])) assetClass = 'REITs';
  else if (categories.includes('外匯型') || includesAny(text, ['外匯', '美元正', '美元反', '日圓正', '日圓反', '人民幣正', '人民幣反'])) assetClass = '外匯';
  else if (includesAny(fundType, ['國外', '境外']) || includesAny(investmentTarget, ['國外股票', '全球股票', '美國股票', '日本股票', '中國股票', '印度股票', '越南股票', '歐洲股票', '亞洲股票'])) assetClass = '海外股票';

  const isLeveragedOrInverse = categories.includes('槓桿型') || categories.includes('反向型');
  const themes = [];
  if (categories.includes('市值型') && managementStyle === '被動式' && !isLeveragedOrInverse) themes.push('市值');
  if (categories.includes('高股息')) themes.push('高股息');
  if (categories.includes('產業型')) themes.push('產業');
  if (categories.includes('ESG型')) themes.push('ESG');
  if (categories.includes('因子型')) themes.push('因子');
  return { managementStyle, productStructure, assetClass, themes };
};

const buildRiskNotes = (fundType, categories, investmentTarget) => {
  const notes = [];
  if (categories.includes('槓桿型')) notes.push('槓桿型追求每日倍數報酬，長期累積結果可能偏離標的指數倍數。');
  if (categories.includes('反向型')) notes.push('反向型以每日反向報酬為目標，不等於長期反向績效。');
  if (categories.includes('商品型') || fundType.includes('期貨信託')) notes.push('期貨型商品可能受轉倉成本、期貨正逆價差與原物料波動影響。');
  if (investmentTarget.includes('債')) notes.push('債券價格會受利率、信用品質與存續期變化影響。');
  if (includesAny(investmentTarget, ['國外', '全球', '美國', '日本', '中國', '印度', '越南', '歐洲', '亞洲'])) notes.push('海外資產可能受匯率、時區與當地市場風險影響。');
  if (categories.includes('產業型')) notes.push('產業或主題型 ETF 集中度較高，波動可能大於廣泛市場型 ETF。');
  if (!notes.length) notes.push('ETF 仍有市場波動、追蹤差距與折溢價風險。');
  return notes;
};

/* ---------------- 上櫃 ETF ---------------- */
// 櫃買中心沒有證交所 ETF e添富 那種官方分類篩選器，但代號末碼本身就是櫃買的官方規則：
// B 台幣計價債券、C 外幣計價債券、D 主動式債券、A 主動式股票、
// L 槓桿、R 反向、T 多資產、U 期貨信託、無尾碼為一般股票型。
// 依此推導出 categories，再交給與上市共用的 classifyEtf／buildInvestmentTarget，
// 確保兩個市場的欄位語意一致。策略／主題（市值、高股息…）櫃買沒有官方來源，一律留空。
const tpexCategoriesFromCode = (code) => {
  const suffix = /[A-Z]$/.test(code) ? code.slice(-1) : '';
  const categories = [];
  if (suffix === 'B' || suffix === 'C') categories.push('債券型');
  if (suffix === 'D') categories.push('債券型', '主動型');
  if (suffix === 'A') categories.push('主動型');
  if (suffix === 'L') categories.push('槓桿型');
  if (suffix === 'R') categories.push('反向型');
  if (suffix === 'T') categories.push('多資產');
  if (suffix === 'U') categories.push('商品型');
  return categories.length ? categories : ['其他'];
};

const buildTpexEtfs = (rows) => rows
  .filter((row) => isEtfCode(row?.SecuritiesCompanyCode))
  .map((row) => {
    const code = String(row.SecuritiesCompanyCode).trim();
    const name = String(row.CompanyName ?? '').trim();
    const categories = tpexCategoriesFromCode(code);
    const price = toNumber(row.Close);
    const units = toNumber(row.Capitals); // 已發行受益權單位數
    // 櫃買未公開基金規模；以「已發行單位數 × 收盤價」推估市值（億元），並標記為推估值。
    const size = price !== null && units !== null ? Math.round((units * price) / 1e8) : null;
    const investmentTarget = buildInvestmentTarget('', '', name, categories);
    const classification = classifyEtf({ fundType: '', indexName: '', investmentTarget, name, categories });
    return {
      code,
      name,
      listingDate: '',
      indexName: '',
      benchmarkName: '',
      fundType: '',
      investmentTarget,
      size,
      price,
      holders: null, // 櫃買中心未公開受益人數
      dailyTradingVolume: sharesToLots(row.TradingShares),
      issuer: '',
      manager: '',
      custodian: '',
      categories,
      managementStyle: classification.managementStyle,
      productStructure: classification.productStructure,
      assetClass: classification.assetClass,
      themes: classification.themes,
      riskNotes: buildRiskNotes('', categories, investmentTarget),
      market: '上櫃',
      sizeIsEstimated: true,
    };
  })
  .filter((row) => row.code && row.name);

/* ---------------- 讀取現有資料 ---------------- */
const readExisting = async () => {
  try {
    const raw = await readFile(DATA_PATH, 'utf8');
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.etfs)) throw new Error('existing dataset malformed');
    return parsed;
  } catch (error) {
    console.error(`無法讀取現有 data/etfs.json：${error.message}`);
    return null;
  }
};

const writeAtomic = async (dataset) => {
  await writeFile(TMP_PATH, `${JSON.stringify(dataset, null, 2)}\n`, 'utf8');
  await rename(TMP_PATH, DATA_PATH);
};

// 同步未完成：完整保留 etfs 陣列與 officialDate，只更新狀態欄位。
const keepExisting = async (existing, status, warning) => {
  if (!existing) {
    console.error('沒有可保留的既有資料，且本次同步未成功；不寫入任何檔案。');
    return;
  }
  const dataset = {
    ...existing,
    meta: {
      ...existing.meta,
      lastAttemptAt: new Date().toISOString(),
      syncStatus: status,
      syncWarning: warning,
    },
    etfs: existing.etfs,
  };
  await writeAtomic(dataset);
};

/* ---------------- 主流程 ---------------- */
const existing = await readExisting();
const today = taiwanToday();

if (existing?.meta?.officialDate === today && existing?.meta?.syncStatus === 'success') {
  console.log(`data/etfs.json 已是台灣當天（${today}）的成功資料，跳過本次同步。`);
  process.exit(0);
}

let dataset;
try {
  const [allRows, homeResponse, dailyResponse, fundResponse, tpexResponse, ...groupRows] = await Promise.all([
    fetchRows(),
    fetch('https://www.twse.com.tw/rwd/zh/ETFortune/index', { headers: { 'user-agent': userAgent }, redirect: 'follow' }),
    fetch('https://openapi.twse.com.tw/v1/exchangeReport/STOCK_DAY_ALL', { headers: { 'user-agent': userAgent } }),
    fetch('https://openapi.twse.com.tw/v1/opendata/t187ap47_L', { headers: { 'user-agent': userAgent } }),
    fetch(tpexEndpoint, { headers: { 'user-agent': userAgent, accept: 'application/json' }, signal: AbortSignal.timeout(90000) }),
    ...FILTER_GROUPS.map((group) => fetchRows(group.filters)),
  ]);

  const categorySets = new Map(FILTER_GROUPS.map((group, index) => [
    group.name,
    new Set(groupRows[index].map((row) => String(row.stockNo ?? '').trim()).filter(Boolean)),
  ]));

  if (!dailyResponse.ok) throw new Error(`TWSE daily response ${dailyResponse.status}`);
  const dailyRows = await dailyResponse.json();
  if (!Array.isArray(dailyRows)) throw new Error('Unexpected TWSE daily payload');
  const dailyByCode = new Map(dailyRows.map((row) => [String(row.Code ?? '').trim(), row]));

  if (!fundResponse.ok) throw new Error(`TWSE fund response ${fundResponse.status}`);
  const fundRows = await fundResponse.json();
  if (!Array.isArray(fundRows)) throw new Error('Unexpected TWSE fund payload');
  const fundByCode = new Map(fundRows.map((row) => [String(row['基金代號'] ?? '').trim(), row]));

  const twseEtfs = allRows.map((row) => {
    const code = String(row.stockNo ?? '').trim();
    const categories = FILTER_GROUPS.filter((group) => categorySets.get(group.name)?.has(code)).map((group) => group.name);
    const safeCategories = categories.length ? categories : ['其他'];
    const fund = fundByCode.get(code);
    const fundType = String(fund?.['基金類型'] ?? '').trim();
    const indexName = String(row.indexName ?? fund?.['標的指數/追蹤指數名稱'] ?? '').trim();
    const name = String(row.stockName ?? fund?.['基金簡稱'] ?? '').trim();
    const investmentTarget = buildInvestmentTarget(fundType, indexName, name, safeCategories);
    const classification = classifyEtf({ fundType, indexName, investmentTarget, name, categories: safeCategories });
    return {
      code,
      name,
      listingDate: String(row.listingDate ?? '').trim(),
      indexName,
      benchmarkName: String(fund?.['績效指標中文名稱'] ?? '').replace('不適用', '').trim(),
      fundType,
      investmentTarget,
      size: toNumber(row.totalAv),
      price: toNumber(row.close1),
      holders: toNumber(row.holders),
      dailyTradingVolume: sharesToLots(dailyByCode.get(code)?.TradeVolume),
      issuer: String(row.issuer ?? '').trim(),
      manager: String(fund?.['基金經理人'] ?? '').trim(),
      custodian: String(fund?.['保管機構'] ?? '').trim(),
      categories: safeCategories,
      managementStyle: classification.managementStyle,
      productStructure: classification.productStructure,
      assetClass: classification.assetClass,
      themes: classification.themes,
      riskNotes: buildRiskNotes(fundType, safeCategories, investmentTarget),
      market: '上市',
      sizeIsEstimated: false,
    };
  }).filter((row) => row.code && row.name);

  /* ---------- 上櫃：櫃買中心 ---------- */
  if (!tpexResponse.ok) throw new Error(`TPEx response ${tpexResponse.status}`);
  const tpexRows = await tpexResponse.json();
  if (!Array.isArray(tpexRows)) throw new Error('Unexpected TPEx payload');
  const twseCodes = new Set(twseEtfs.map((row) => row.code));
  // 同一代號若兩邊都有，以證交所官方資料為準（正常情況不會發生）。
  const tpexEtfs = buildTpexEtfs(tpexRows).filter((row) => !twseCodes.has(row.code));

  const etfs = [...twseEtfs, ...tpexEtfs];

  /* ---------- 驗證（全部通過才允許替換資料） ---------- */
  if (twseEtfs.length < 100) throw new Error(`上市 ETF 筆數異常：${twseEtfs.length}`);
  if (tpexEtfs.length < 80) throw new Error(`上櫃 ETF 筆數異常：${tpexEtfs.length}`);
  if (etfs.length < 100) throw new Error(`ETF 筆數異常：${etfs.length}`);
  const codes = new Set();
  for (const etf of etfs) {
    if (!etf.code || !etf.name) throw new Error('ETF 代號或名稱為空');
    if (codes.has(etf.code)) throw new Error(`ETF 代號重複：${etf.code}`);
    codes.add(etf.code);
    if (!etf.managementStyle || !etf.productStructure || !etf.assetClass || !Array.isArray(etf.themes)) {
      throw new Error(`${etf.code} 缺少分類資料`);
    }
  }

  const etf00919 = etfs.find((row) => row.code === '00919');
  if (!etf00919 || typeof etf00919.size !== 'number' || etf00919.size < 1000) throw new Error('00919 資產規模驗證失敗');

  const etf00981A = etfs.find((row) => row.code === '00981A');
  if (!etf00981A || etf00981A.managementStyle !== '主動式' || etf00981A.themes.includes('市值')) throw new Error('00981A 分類驗證失敗');

  for (const code of ['009827', '009828']) {
    const etf = etfs.find((row) => row.code === code);
    if (etf && !etf.themes.includes('產業')) throw new Error(`${code} 產業分類驗證失敗`);
  }
  if (etfs.some((row) => row.managementStyle === '主動式' && row.themes.includes('市值'))) {
    throw new Error('主動式 ETF 不得進入市值主題');
  }
  if (etfs.some((row) => row.dailyTradingVolume !== null && row.dailyTradingVolume < 0)) {
    throw new Error('日成交量（張）出現負值');
  }

  // 上櫃守門員：00679B（元大美債20年）是規模最大的上櫃債券 ETF 之一，
  // 若不存在或推估規模過小，代表櫃買資料抓歪或單位換算錯誤。
  const etf00679B = tpexEtfs.find((row) => row.code === '00679B');
  if (!etf00679B) throw new Error('上櫃資料缺少 00679B');
  if (typeof etf00679B.size !== 'number' || etf00679B.size < 1000) throw new Error(`00679B 推估規模異常：${etf00679B.size}`);
  if (etf00679B.assetClass !== '債券') throw new Error('00679B 應分類為債券');
  if (!tpexEtfs.some((row) => row.code === '006201')) throw new Error('上櫃資料缺少 006201');
  if (tpexEtfs.some((row) => row.themes.length)) throw new Error('上櫃 ETF 不應帶有策略／主題標籤（櫃買無官方分類來源）');
  if (etfs.some((row) => row.market !== '上市' && row.market !== '上櫃')) throw new Error('有 ETF 缺少市場別');

  const homeHtml = homeResponse.ok ? await homeResponse.text() : '';
  const officialDate = homeHtml.match(/資料更新時間[：:]\s*(\d{4}\.\d{2}\.\d{2})/)?.[1] ?? null;
  if (!officialDate) throw new Error('無法取得官方資料日');

  const previousDate = existing?.meta?.officialDate ?? null;
  if (previousDate && officialDate < previousDate) throw new Error(`新資料日期 ${officialDate} 早於現有資料 ${previousDate}`);

  const previousCount = Array.isArray(existing?.etfs) ? existing.etfs.length : 0;
  if (previousCount && etfs.length < previousCount * 0.95) {
    throw new Error(`ETF 筆數異常減少：${previousCount} → ${etfs.length}`);
  }

  // 假日或當日資料尚未發布：視為本次同步未完成，保留上一交易日版本。
  if (officialDate !== today) {
    await keepExisting(existing, 'fallback', `證交所目前提供的官方資料日為 ${officialDate}，尚未提供 ${today} 的完整資料；已保留上一次成功保存的資料。`);
    console.warn(`::warning::官方資料日 ${officialDate} 非台灣當天 ${today}，保留既有資料。`);
    process.exit(0);
  }

  const nowIso = new Date().toISOString();
  dataset = {
    meta: {
      dataset: 'TWSE ETF e添富投資篩選器 + TPEx 上櫃行情',
      source: '臺灣證券交易所 ETF e添富、證券櫃檯買賣中心',
      sourceUrl,
      tpexSourceUrl,
      officialDate,
      syncedAt: nowIso,
      count: etfs.length,
      listedCount: twseEtfs.length,
      otcCount: tpexEtfs.length,
      categorySource: '上市依證交所官方欄位拆分為管理方式、產品結構、資產類別與策略／主題（市值限定被動原型 ETF）；上櫃依櫃買中心代號末碼規則推導，策略／主題無官方來源故留空',
      syncNote: '上市分類取自證交所 ETF e添富即時篩選結果；上櫃取自櫃買中心上櫃股票行情。日成交量兩市場皆以 1,000 股換算為 1 張。上櫃資產規模為「已發行受益權單位數 × 收盤價」之推估市值（櫃買未公開基金規模），受益人數與基本資料櫃買亦未公開',
      lastSuccessfulSyncAt: nowIso,
      lastAttemptAt: nowIso,
      syncStatus: 'success',
      syncWarning: '',
      schedule: '每個交易日 18:00 更新；失敗時於 18:15、18:45 自動重試（GitHub Actions，台灣時間）',
      units: { size: '億元', price: '元', dailyTradingVolume: '張', holders: '人' },
    },
    etfs,
  };

  if (dataset.meta.count !== dataset.etfs.length) throw new Error('meta.count 與 ETF 陣列長度不一致');
} catch (error) {
  await keepExisting(existing, 'error', `最近一次同步失敗（${error.message}）；畫面顯示的是最後一次成功保存的資料。`);
  console.error(`::error::ETF 同步失敗：${error.message}`);
  process.exit(1);
}

await writeAtomic(dataset);
console.log(JSON.stringify({ status: 'success', count: dataset.etfs.length, officialDate: dataset.meta.officialDate }));
