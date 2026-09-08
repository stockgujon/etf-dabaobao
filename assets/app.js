// 國內ETF大秘寶｜GitHub Pages 版前端
// 全站只讀取本 repository 的 ./data/etfs.json；不從瀏覽器呼叫證交所、GitHub API
// 或任何後台排程介面。搜尋、篩選、排序、比較與試算全部在瀏覽器本機完成。

import {
  ASSET_CLASS_OPTIONS,
  MANAGEMENT_OPTIONS,
  STRUCTURE_OPTIONS,
  THEME_OPTIONS,
  classifyEtf,
} from './etf-classification.js';

const MARKET_OPTIONS = ['全部市場', '上市', '上櫃'];
const DATA_URL = './data/etfs.json';
const SOURCE_URL = 'https://www.twse.com.tw/zh/ETFortune/products';
const TPEX_URL = 'https://www.tpex.org.tw/zh-tw/index.html';
const etfInfoUrl = (code) => `https://www.twse.com.tw/zh/ETFortune/etfInfo/${encodeURIComponent(code)}`;
// 上市有證交所單一商品頁；櫃買中心沒有對應的單一商品頁網址，退回官網首頁。
const officialUrlOf = (etf) => (marketOf(etf) === '上櫃' ? TPEX_URL : etfInfoUrl(etf.code));
const officialLabelOf = (etf) => (marketOf(etf) === '上櫃' ? '櫃買中心官網 ↗' : '證交所商品頁 ↗');
// 上櫃缺欄位時，說明「櫃買未公開」比一個破折號有用。
const orMissing = (value, etf) => value || (marketOf(etf) === '上櫃' ? '櫃買中心未公開' : '—');

/* ---------------- 格式化 ---------------- */
const intFormatter = new Intl.NumberFormat('zh-TW', { maximumFractionDigits: 0 });
const formatInteger = (value) => (value === null || value === undefined || Number.isNaN(value) ? '—' : intFormatter.format(value));
const formatDecimal = (value, digits = 2) => (value === null || value === undefined || Number.isNaN(value)
  ? '—'
  : new Intl.NumberFormat('zh-TW', { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(value));
// 日成交量單位為「張」（1,000 股 = 1 張），畫面一律取整數顯示。
const formatLots = (value) => (value === null || value === undefined || Number.isNaN(value) ? '—' : intFormatter.format(Math.trunc(value)));
// 規模不足 1 億時，直接寫「不足 1 億」，避免顯示成 0 億被誤認為沒資料。
const formatSize = (value) => (value === null || value === undefined || Number.isNaN(value)
  ? '—'
  : value === 0 ? '不足 1 億' : `${formatInteger(value)} 億`);
const formatAssetScale = (value) => (value >= 10000 ? `${(value / 10000).toFixed(2)} 兆` : `${formatInteger(value)} 億`);
const formatTime = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toLocaleString('zh-TW');
};

/* ---------------- 狀態 ---------------- */
const state = {
  dataset: null,
  syncState: 'loading', // loading | ready | syncing | error
  syncMessage: '正在載入已查證的證交所資料快照',
  query: '',
  market: '全部市場',
  managementStyle: '全部方式',
  productStructure: '全部結構',
  assetClass: '全部資產',
  strategyTheme: '全部策略',
  minSize: 0,
  minPrice: 0,
  maxPrice: 9999,
  sort: 'size-desc',
  selected: [],
  detail: null,
  sim: { code: '0050', initial: 100000, monthly: 10000, years: 10, annualReturn: 6 },
};

const $ = (id) => document.getElementById(id);
const el = {
  pill: $('update-pill'),
  pillText: $('update-pill-text'),
  reloadButton: $('reload-button'),
  reloadLabel: $('reload-label'),
  banner: $('sync-banner'),
  bannerMessage: $('sync-message'),
  bannerSource: $('banner-source'),
  statFiltered: $('stat-filtered'),
  statTotal: $('stat-total'),
  statScale: $('stat-scale'),
  statDate: $('stat-date'),
  search: $('search-input'),
  selects: {
    掛牌市場: $('select-market'),
    管理方式: $('select-management'),
    產品結構: $('select-structure'),
    資產類別: $('select-asset'),
    策略主題: $('select-theme'),
  },
  minSize: $('min-size'),
  minSizeLabel: $('min-size-label'),
  minSizeMax: $('min-size-max'),
  minPrice: $('min-price'),
  maxPrice: $('max-price'),
  jumpCount: $('jump-count'),
  jumpResults: $('jump-results'),
  resetButton: $('reset-button'),
  emptyReset: $('empty-reset'),
  sort: $('sort-select'),
  rows: $('etf-rows'),
  emptyState: $('empty-state'),
  resultsSummary: $('results-summary'),
  selectHint: $('select-hint'),
  selectCount: $('select-count'),
  gotoCompare: $('goto-compare'),
  compareEmpty: $('compare-empty'),
  compareEmptyTitle: $('compare-empty-title'),
  compareGrid: $('compare-grid'),
  note: {
    source: $('note-source'),
    official: $('note-official'),
    success: $('note-success'),
    attempt: $('note-attempt'),
    schedule: $('note-schedule'),
    category: $('note-category'),
    warning: $('note-warning'),
    sync: $('note-sync'),
    link: $('note-link'),
  },
  sim: {
    code: $('sim-code'),
    initial: $('sim-initial'),
    monthly: $('sim-monthly'),
    years: $('sim-years'),
    yearsLabel: $('sim-years-label'),
    ret: $('sim-return'),
    retLabel: $('sim-return-label'),
    target: $('sim-target'),
    yearsText: $('sim-years-text'),
    projected: $('sim-projected'),
    bar: $('sim-bar'),
    invested: $('sim-invested'),
    gain: $('sim-gain'),
  },
  modalBackdrop: $('modal-backdrop'),
  modal: $('detail-modal'),
};

/* ---------------- 分類 ---------------- */
const getClassification = (etf) => {
  const inferred = classifyEtf(etf);
  return {
    managementStyle: etf.managementStyle ?? inferred.managementStyle,
    productStructure: etf.productStructure ?? inferred.productStructure,
    assetClass: etf.assetClass ?? inferred.assetClass,
    themes: etf.themes ?? inferred.themes,
  };
};

const etfs = () => state.dataset?.etfs ?? [];
const marketOf = (etf) => etf.market || '上市';
const isEstimated = (etf) => etf.sizeIsEstimated === true;

const getFiltered = () => {
  const normalized = state.query.trim().toLowerCase();
  const list = etfs().filter((etf) => {
    const c = getClassification(etf);
    const themeAliases = c.themes.flatMap((theme) => [theme, `${theme}型`]);
    const searchable = [etf.code, etf.name, etf.indexName, etf.investmentTarget, marketOf(etf), c.managementStyle, c.productStructure, c.assetClass, ...themeAliases].join(' ').toLowerCase();
    const price = etf.price ?? -1;
    return (!normalized || searchable.includes(normalized))
      && (state.market === '全部市場' || marketOf(etf) === state.market)
      && (state.managementStyle === '全部方式' || c.managementStyle === state.managementStyle)
      && (state.productStructure === '全部結構' || c.productStructure === state.productStructure)
      && (state.assetClass === '全部資產' || c.assetClass === state.assetClass)
      && (state.strategyTheme === '全部策略' || c.themes.some((theme) => theme === state.strategyTheme))
      && (etf.size ?? 0) >= state.minSize
      && price >= state.minPrice
      && price <= state.maxPrice;
  });

  return list.sort((a, b) => {
    if (state.sort === 'price-desc') return (b.price ?? -1) - (a.price ?? -1);
    if (state.sort === 'volume-desc') return (b.dailyTradingVolume ?? -1) - (a.dailyTradingVolume ?? -1);
    if (state.sort === 'holders-desc') return (b.holders ?? -1) - (a.holders ?? -1);
    if (state.sort === 'listing-desc') return (b.listingDate || '').localeCompare(a.listingDate || '');
    if (state.sort === 'code-asc') return a.code.localeCompare(b.code);
    return (b.size ?? -1) - (a.size ?? -1);
  });
};

/* ---------------- 資料載入 ---------------- */
// 「重新載入最新資料」只做一件事：重新抓取本站 ./data/etfs.json（附時間戳避免快取）。
// 它不會、也不能觸發 GitHub Actions、證交所 API 或任何後台排程；
// 後台每日 18:00 / 18:15 / 18:45（台灣時間）的抓取時間與頻率完全不受此按鈕影響。
const fetchDataset = async () => {
  const response = await fetch(`${DATA_URL}?ts=${Date.now()}`, { cache: 'no-store' });
  if (!response.ok) throw new Error(`資料檔載入失敗（HTTP ${response.status}）`);
  const data = await response.json();
  if (!data || !Array.isArray(data.etfs)) throw new Error('資料檔格式異常');
  return data;
};

const applyDataset = (data, prefix) => {
  state.dataset = data;
  state.syncState = data.meta?.syncStatus === 'success' ? 'ready' : 'error';
  state.syncMessage = data.meta?.syncWarning
    || `${prefix}：${data.etfs.length} 檔，官方資料日 ${data.meta?.officialDate ?? '未提供'}`;
};

const loadInitial = async () => {
  try {
    const data = await fetchDataset();
    applyDataset(data, '已載入最後一次成功保存的資料');
    initSimDefaults();
  } catch (error) {
    state.syncState = 'error';
    state.syncMessage = error instanceof Error ? error.message : '資料載入失敗';
  }
  render();
};

const reloadLatest = async () => {
  if (state.syncState === 'syncing') return;
  state.syncState = 'syncing';
  state.syncMessage = '正在重新讀取本站保存的最新 ETF 資料';
  render();
  try {
    const data = await fetchDataset();
    if (data.etfs.length < 100) throw new Error('保存資料筆數異常，保留目前畫面資料');
    applyDataset(data, '已重新載入');
    if (!etfs().some((etf) => etf.code === state.sim.code)) initSimDefaults();
  } catch (error) {
    // 讀取失敗時保留目前畫面已有資料，只顯示錯誤提示。
    state.syncState = 'error';
    state.syncMessage = error instanceof Error ? `${error.message}（已保留目前畫面資料）` : '重新載入失敗，保留目前資料';
  }
  render();
};

/* ---------------- 渲染 ---------------- */
const fillSelect = (select, options, value) => {
  select.innerHTML = '';
  options.forEach((option) => {
    const node = document.createElement('option');
    node.value = option;
    node.textContent = option;
    select.append(node);
  });
  select.value = value;
};

const renderStatus = (filtered) => {
  const meta = state.dataset?.meta ?? {};
  el.pill.className = `update-pill ${state.syncState}`;
  el.pillText.textContent = state.syncState === 'syncing'
    ? '讀取中'
    : state.dataset ? `${etfs().length} 檔・官方資料` : '載入中';
  el.reloadButton.disabled = state.syncState === 'syncing';
  el.reloadLabel.textContent = state.syncState === 'syncing' ? '載入中' : '重新載入最新資料';

  el.banner.className = `sync-banner ${state.syncState}`;
  el.bannerMessage.textContent = state.syncMessage;
  el.bannerSource.href = meta.sourceUrl || SOURCE_URL;

  el.statFiltered.textContent = filtered.length;
  el.statTotal.textContent = `共 ${etfs().length} 檔上市 ETF`;
  el.statScale.textContent = formatAssetScale(filtered.reduce((sum, etf) => sum + (etf.size ?? 0), 0));
  el.statDate.textContent = meta.officialDate ? String(meta.officialDate).replaceAll('.', '/') : '—';

  el.note.source.textContent = meta.source || '臺灣證券交易所 ETF e添富';
  el.note.official.textContent = `官方資料日：${meta.officialDate ?? '—'}`;
  el.note.success.textContent = `最後成功更新：${formatTime(meta.lastSuccessfulSyncAt) ?? '—'}`;
  el.note.attempt.textContent = `最近嘗試：${formatTime(meta.lastAttemptAt) ?? '尚未執行'}`;
  el.note.schedule.textContent = `排程：${meta.schedule ?? '每個交易日 18:00 更新；失敗時於 18:15、18:45 自動重試'}`;
  el.note.category.textContent = `分類：${meta.categorySource ?? '依證交所官方條件交叉比對'}`;
  el.note.warning.hidden = !meta.syncWarning;
  el.note.warning.textContent = meta.syncWarning ? `提醒：${meta.syncWarning}` : '';
  el.note.sync.hidden = !meta.syncNote;
  el.note.sync.textContent = meta.syncNote ? `同步：${meta.syncNote}` : '';
  el.note.link.href = meta.sourceUrl || SOURCE_URL;
};

const renderRows = (filtered) => {
  el.rows.innerHTML = '';
  const fragment = document.createDocumentFragment();
  filtered.forEach((fund) => {
    const isSelected = state.selected.includes(fund.code);
    const c = getClassification(fund);
    const tr = document.createElement('tr');
    if (isSelected) tr.className = 'selected-row';

    const checkTd = document.createElement('td');
    const check = document.createElement('button');
    check.type = 'button';
    check.className = `check ${isSelected ? 'checked' : ''}`.trim();
    check.textContent = isSelected ? '✓' : '';
    check.disabled = !isSelected && state.selected.length >= 3;
    check.setAttribute('aria-label', `${isSelected ? '取消' : '加入'}比較 ${fund.name}`);
    check.addEventListener('click', () => toggleCompare(fund.code));
    checkTd.append(check);

    const fundTd = document.createElement('td');
    const wrap = document.createElement('div');
    wrap.className = 'fund';
    const badge = document.createElement('span');
    badge.textContent = fund.code.slice(-2);
    const info = document.createElement('div');
    const code = document.createElement('b');
    code.textContent = fund.code;
    const name = document.createElement('small');
    name.textContent = fund.name;
    const tags = document.createElement('em');
    tags.textContent = [marketOf(fund), c.managementStyle, c.assetClass, ...c.themes].slice(0, 3).join('・');
    info.append(code, name, tags);
    wrap.append(badge, info);
    fundTd.append(wrap);

    const priceTd = document.createElement('td');
    priceTd.textContent = fund.price === null || fund.price === undefined ? '—' : `$${formatDecimal(fund.price)}`;

    const sizeTd = document.createElement('td');
    const sizeStrong = document.createElement('strong');
    sizeStrong.className = 'verified-number';
    sizeStrong.textContent = formatSize(fund.size);
    sizeTd.append(sizeStrong);
    if (isEstimated(fund)) {
      const badge = document.createElement('i');
      badge.className = 'est-badge';
      badge.textContent = '推估';
      badge.title = '櫃買中心未公開基金規模，此為已發行單位數 × 收盤價之推估市值';
      sizeTd.append(badge);
    }

    const volumeTd = document.createElement('td');
    volumeTd.textContent = `${formatLots(fund.dailyTradingVolume)} 張`;

    const holdersTd = document.createElement('td');
    holdersTd.textContent = `${formatInteger(fund.holders)} 人`;

    const targetTd = document.createElement('td');
    const target = document.createElement('span');
    target.className = 'target-cell';
    target.textContent = fund.investmentTarget || '其他';
    targetTd.append(target);

    const actionTd = document.createElement('td');
    const action = document.createElement('button');
    action.type = 'button';
    action.className = 'row-action';
    action.textContent = '→';
    action.setAttribute('aria-label', `查看 ${fund.name} 查證詳情`);
    action.addEventListener('click', () => openDetail(fund));
    actionTd.append(action);

    tr.append(checkTd, fundTd, priceTd, sizeTd, volumeTd, holdersTd, targetTd, actionTd);
    fragment.append(tr);
  });
  el.rows.append(fragment);
  el.emptyState.hidden = filtered.length > 0;
};

const renderCompare = () => {
  const comparison = state.selected
    .map((code) => etfs().find((etf) => etf.code === code))
    .filter(Boolean);

  el.selectCount.textContent = state.selected.length;
  el.selectHint.textContent = state.selected.length
    ? `已選 ${state.selected.length} 檔；${state.selected.length < 2 ? '再選 1 檔即可比較' : '可以開始比較'}`
    : '勾選 2–3 檔，即可比較官方欄位';
  el.gotoCompare.className = state.selected.length < 2 ? 'disabled' : '';

  if (comparison.length < 2) {
    el.compareEmpty.hidden = false;
    el.compareGrid.hidden = true;
    el.compareGrid.innerHTML = '';
    el.compareEmptyTitle.textContent = `還差 ${2 - comparison.length} 檔`;
    return;
  }

  el.compareEmpty.hidden = true;
  el.compareGrid.hidden = false;
  el.compareGrid.innerHTML = '';

  comparison.forEach((fund) => {
    const c = getClassification(fund);
    const article = document.createElement('article');

    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'remove';
    remove.textContent = '×';
    remove.setAttribute('aria-label', `移除 ${fund.name}`);
    remove.addEventListener('click', () => toggleCompare(fund.code));

    const codeLine = document.createElement('p');
    codeLine.className = 'compare-code';
    codeLine.textContent = `${fund.code}・${[c.managementStyle, c.assetClass, ...c.themes].join(' / ')}`;

    const title = document.createElement('h3');
    title.textContent = fund.name;

    const yieldValue = document.createElement('strong');
    yieldValue.className = 'compare-yield';
    yieldValue.textContent = formatInteger(fund.size);
    const sup = document.createElement('sup');
    sup.textContent = '億';
    yieldValue.append(sup);

    const caption = document.createElement('small');
    caption.textContent = isEstimated(fund) ? '最近營業日推估市值（櫃買未公開規模）' : '最近營業日資產規模';

    const dl = document.createElement('dl');
    [
      ['收盤價', fund.price === null || fund.price === undefined ? '—' : `${formatDecimal(fund.price)} 元`],
      ['日成交量', `${formatLots(fund.dailyTradingVolume)} 張`],
      ['受益人數', `${formatInteger(fund.holders)} 人`],
      ['掛牌日期', orMissing(fund.listingDate, fund)],
    ].forEach(([label, value]) => {
      const row = document.createElement('div');
      const dt = document.createElement('dt');
      dt.textContent = label;
      const dd = document.createElement('dd');
      dd.textContent = value;
      row.append(dt, dd);
      dl.append(row);
    });

    const official = document.createElement('div');
    official.className = 'official-detail';
    const marketLabel = document.createElement('span');
    marketLabel.textContent = '掛牌市場';
    const marketValue = document.createElement('b');
    marketValue.textContent = marketOf(fund);
    const targetLabel = document.createElement('span');
    targetLabel.textContent = '投資標的';
    const targetValue = document.createElement('b');
    targetValue.textContent = fund.investmentTarget || '—';
    const issuerLabel = document.createElement('span');
    issuerLabel.textContent = '發行人';
    const issuerValue = document.createElement('b');
    issuerValue.textContent = orMissing(fund.issuer, fund);
    const link = document.createElement('a');
    link.href = officialUrlOf(fund);
    link.target = '_blank';
    link.rel = 'noreferrer';
    link.textContent = officialLabelOf(fund);
    official.append(marketLabel, marketValue, targetLabel, targetValue, issuerLabel, issuerValue, link);

    article.append(remove, codeLine, title, yieldValue, caption, dl, official);
    el.compareGrid.append(article);
  });
};

/* ---------------- 投入模擬 ---------------- */
const initSimDefaults = () => {
  const list = etfs();
  if (!list.length) return;
  if (!list.some((etf) => etf.code === state.sim.code)) state.sim.code = list[0].code;
};

const renderSimulator = () => {
  const list = etfs();
  if (el.sim.code.dataset.count !== String(list.length)) {
    el.sim.code.innerHTML = '';
    list.forEach((etf) => {
      const option = document.createElement('option');
      option.value = etf.code;
      option.textContent = `${etf.code}・${etf.name}`;
      el.sim.code.append(option);
    });
    el.sim.code.dataset.count = String(list.length);
  }
  el.sim.code.value = state.sim.code;

  const { initial, monthly, years, annualReturn } = state.sim;
  const months = years * 12;
  const monthlyRate = Math.pow(1 + annualReturn / 100, 1 / 12) - 1;
  const projected = monthlyRate === 0
    ? initial + monthly * months
    : initial * Math.pow(1 + monthlyRate, months) + monthly * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
  const invested = initial + monthly * months;
  const simETF = list.find((etf) => etf.code === state.sim.code);

  el.sim.yearsLabel.textContent = `${years} 年`;
  el.sim.retLabel.textContent = `${annualReturn.toFixed(1)}%`;
  el.sim.yearsText.textContent = `${years} 年後試算資產`;
  el.sim.target.textContent = simETF
    ? `${simETF.code}・${simETF.name}・官方收盤價 ${simETF.price === null || simETF.price === undefined ? '—' : `${formatDecimal(simETF.price)} 元`}`
    : '尚無可模擬的 ETF';
  el.sim.projected.textContent = `NT$ ${formatInteger(Math.round(projected))}`;
  el.sim.invested.textContent = `NT$ ${formatInteger(invested)}`;
  el.sim.gain.textContent = `+ NT$ ${formatInteger(Math.round(Math.max(0, projected - invested)))}`;
  el.sim.bar.style.width = `${projected > 0 ? Math.max(5, Math.min(100, (invested / projected) * 100)) : 100}%`;
};

/* ---------------- 詳情視窗 ---------------- */
const detailRow = (label, value, isLink = false) => {
  const row = document.createElement('div');
  const dt = document.createElement('dt');
  dt.textContent = label;
  const dd = document.createElement('dd');
  if (isLink) {
    const a = document.createElement('a');
    a.href = value.href;
    a.target = '_blank';
    a.rel = 'noreferrer';
    a.textContent = value.text;
    dd.append(a);
  } else {
    dd.textContent = value;
  }
  row.append(dt, dd);
  return row;
};

const detailSection = (heading, rows, note, extraClass = '') => {
  const article = document.createElement('article');
  article.className = `detail-section ${extraClass}`.trim();
  const h3 = document.createElement('h3');
  h3.textContent = heading;
  const dl = document.createElement('dl');
  dl.className = 'detail-list';
  rows.forEach((row) => dl.append(row));
  article.append(h3, dl);
  if (note) {
    const p = document.createElement('p');
    p.className = 'detail-note';
    p.textContent = note;
    article.append(p);
  }
  return article;
};

const renderDetail = () => {
  const fund = state.detail;
  el.modalBackdrop.hidden = !fund;
  el.modal.innerHTML = '';
  if (!fund) {
    document.body.style.overflow = '';
    return;
  }
  document.body.style.overflow = 'hidden';
  const c = getClassification(fund);
  const infoUrl = officialUrlOf(fund);

  const close = document.createElement('button');
  close.type = 'button';
  close.className = 'modal-close';
  close.textContent = '×';
  close.setAttribute('aria-label', '關閉');
  close.addEventListener('click', () => closeDetail());

  const eyebrow = document.createElement('p');
  eyebrow.textContent = `${fund.code}・官方查證欄位`;
  const title = document.createElement('h2');
  title.id = 'detail-title';
  title.textContent = fund.name;
  const target = document.createElement('strong');
  target.className = 'detail-target';
  target.textContent = fund.investmentTarget || '—';

  const metrics = document.createElement('div');
  metrics.className = 'detail-metrics';
  [
    ['收盤價', fund.price === null || fund.price === undefined ? '—' : `${formatDecimal(fund.price)} 元`],
    ['資產規模', `${formatSize(fund.size)}${isEstimated(fund) ? '（推估）' : ''}`],
    ['日成交量', `${formatLots(fund.dailyTradingVolume)} 張`],
    ['受益人數', `${formatInteger(fund.holders)} 人`],
  ].forEach(([label, value]) => {
    const article = document.createElement('article');
    const span = document.createElement('span');
    span.textContent = label;
    const b = document.createElement('b');
    b.textContent = value;
    article.append(span, b);
    metrics.append(article);
  });

  const sections = document.createElement('div');
  sections.className = 'detail-sections';

  sections.append(detailSection('01・商品身分', [
    detailRow('掛牌市場', marketOf(fund)),
    detailRow('管理方式', c.managementStyle),
    detailRow('產品結構', c.productStructure),
    detailRow('資產類別', c.assetClass),
    detailRow('官方基金類型', orMissing(fund.fundType, fund)),
    detailRow('掛牌日期', orMissing(fund.listingDate, fund)),
    detailRow('發行人', orMissing(fund.issuer, fund)),
    detailRow('基金經理人', orMissing(fund.manager, fund)),
    detailRow('保管機構', orMissing(fund.custodian, fund)),
  ], marketOf(fund) === '上櫃'
    ? '櫃買中心未公開上櫃 ETF 的基金基本資料與受益人數；分類依櫃買代號末碼規則（B/C 債券、D 主動債券、A 主動股票、L 槓桿、R 反向、T 多資產、U 期貨信託）推導。'
    : ''));

  const investRows = [
    detailRow('投資標的', fund.investmentTarget || '—'),
    detailRow('策略／主題', c.themes.join('、') || '未歸入指定主題'),
    detailRow('完整標的指數', fund.indexName || (marketOf(fund) === '上櫃' ? '櫃買中心未公開' : '主動式 ETF 不適用')),
  ];
  if (fund.benchmarkName) investRows.push(detailRow('績效指標', fund.benchmarkName));
  investRows.push(detailRow('前十大持股', '各基金公司每日公告，本版整合中'));
  sections.append(detailSection('02・投資內容', investRows));

  sections.append(detailSection('03・費用成本', [
    detailRow('經理費', '以最新公開說明書為準'),
    detailRow('保管費', '以最新公開說明書為準'),
    detailRow('總費用率', '以最新財務報告為準'),
  ], '費用資料來源與期間口徑不同，本版不填入未統一查證的數字。'));

  sections.append(detailSection('04・配息資料', [
    detailRow('配息頻率', '依公開說明書約定'),
    detailRow('歷史配息', { href: infoUrl, text: officialLabelOf(fund) }, true),
  ], '有配息紀錄不代表未來固定配息或保證收益。'));

  sections.append(detailSection('05・市場資訊', [
    detailRow('淨值與折溢價', { href: infoUrl, text: officialLabelOf(fund) }, true),
    detailRow('一／三／五年績效', { href: infoUrl, text: officialLabelOf(fund) }, true),
  ], '績效與折溢價會隨日期變動，點開官方頁面可查看最新數值。'));

  const risk = document.createElement('article');
  risk.className = 'detail-section risk-section';
  const riskTitle = document.createElement('h3');
  riskTitle.textContent = '06・風險提醒';
  const ul = document.createElement('ul');
  (fund.riskNotes?.length ? fund.riskNotes : ['ETF 仍有市場波動、追蹤差距與折溢價風險。']).forEach((note) => {
    const li = document.createElement('li');
    li.textContent = note;
    ul.append(li);
  });
  const riskNote = document.createElement('p');
  riskNote.className = 'detail-note';
  riskNote.textContent = '請再閱讀該基金公開說明書的完整風險揭露。';
  risk.append(riskTitle, ul, riskNote);
  sections.append(risk);

  const link = document.createElement('a');
  link.className = 'primary-button link-button';
  link.href = infoUrl;
  link.target = '_blank';
  link.rel = 'noreferrer';
  link.textContent = marketOf(fund) === '上櫃' ? '前往櫃買中心官網 ' : '前往證交所商品頁 ';
  const arrow = document.createElement('span');
  arrow.textContent = '↗';
  link.append(arrow);

  el.modal.append(close, eyebrow, title, target, metrics, sections, link);
  close.focus();
};

const openDetail = (fund) => { state.detail = fund; renderDetail(); };
const closeDetail = () => { state.detail = null; renderDetail(); };

/* ---------------- 互動 ---------------- */
const toggleCompare = (code) => {
  state.selected = state.selected.includes(code)
    ? state.selected.filter((item) => item !== code)
    : state.selected.length < 3 ? [...state.selected, code] : state.selected;
  render();
};

const resetFilters = () => {
  state.query = '';
  state.market = '全部市場';
  state.managementStyle = '全部方式';
  state.productStructure = '全部結構';
  state.assetClass = '全部資產';
  state.strategyTheme = '全部策略';
  state.minSize = 0;
  state.minPrice = 0;
  state.maxPrice = 9999;
  state.sort = 'size-desc';
  el.search.value = '';
  el.selects.掛牌市場.value = state.market;
  el.selects.管理方式.value = state.managementStyle;
  el.selects.產品結構.value = state.productStructure;
  el.selects.資產類別.value = state.assetClass;
  el.selects.策略主題.value = state.strategyTheme;
  el.minSize.value = '0';
  el.minPrice.value = '0';
  el.maxPrice.value = '9999';
  el.sort.value = state.sort;
  render();
};

const render = () => {
  const maxSize = Math.max(1000, ...etfs().map((etf) => etf.size ?? 0));
  const sliderMax = Math.ceil(maxSize / 500) * 500;
  el.minSize.max = String(sliderMax);
  el.minSizeMax.textContent = `${formatInteger(sliderMax)} 億`;
  el.minSizeLabel.textContent = `${formatInteger(state.minSize)} 億`;

  const filtered = getFiltered();
  renderStatus(filtered);
  renderRows(filtered);
  renderCompare();
  renderSimulator();

  el.jumpCount.textContent = filtered.length;
  el.resultsSummary.textContent = `已載入 ${etfs().length} 檔・目前顯示 ${filtered.length} 檔・最多比較 3 檔`;
};

const bindEvents = () => {
  fillSelect(el.selects.掛牌市場, MARKET_OPTIONS, state.market);
  fillSelect(el.selects.管理方式, MANAGEMENT_OPTIONS, state.managementStyle);
  fillSelect(el.selects.產品結構, STRUCTURE_OPTIONS, state.productStructure);
  fillSelect(el.selects.資產類別, ASSET_CLASS_OPTIONS, state.assetClass);
  fillSelect(el.selects.策略主題, THEME_OPTIONS, state.strategyTheme);

  el.search.addEventListener('input', (event) => { state.query = event.target.value; render(); });
  el.selects.掛牌市場.addEventListener('change', (event) => { state.market = event.target.value; render(); });
  el.selects.管理方式.addEventListener('change', (event) => { state.managementStyle = event.target.value; render(); });
  el.selects.產品結構.addEventListener('change', (event) => { state.productStructure = event.target.value; render(); });
  el.selects.資產類別.addEventListener('change', (event) => { state.assetClass = event.target.value; render(); });
  el.selects.策略主題.addEventListener('change', (event) => { state.strategyTheme = event.target.value; render(); });
  el.minSize.addEventListener('input', (event) => { state.minSize = Number(event.target.value); render(); });
  el.minPrice.addEventListener('input', (event) => { state.minPrice = Math.max(0, Number(event.target.value) || 0); render(); });
  el.maxPrice.addEventListener('input', (event) => { state.maxPrice = Math.max(0, Number(event.target.value) || 0); render(); });
  el.sort.addEventListener('change', (event) => { state.sort = event.target.value; render(); });
  el.resetButton.addEventListener('click', resetFilters);
  el.emptyReset.addEventListener('click', resetFilters);
  el.jumpResults.addEventListener('click', () => document.querySelector('.results-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  el.reloadButton.addEventListener('click', reloadLatest);

  el.sim.code.addEventListener('change', (event) => { state.sim.code = event.target.value; renderSimulator(); });
  el.sim.initial.addEventListener('input', (event) => { state.sim.initial = Math.max(0, Number(event.target.value) || 0); renderSimulator(); });
  el.sim.monthly.addEventListener('input', (event) => { state.sim.monthly = Math.max(0, Number(event.target.value) || 0); renderSimulator(); });
  el.sim.years.addEventListener('input', (event) => { state.sim.years = Number(event.target.value); renderSimulator(); });
  el.sim.ret.addEventListener('input', (event) => { state.sim.annualReturn = Number(event.target.value); renderSimulator(); });

  el.modalBackdrop.addEventListener('click', () => closeDetail());
  el.modal.addEventListener('click', (event) => event.stopPropagation());

  document.querySelectorAll('nav a').forEach((link) => link.addEventListener('click', () => {
    document.querySelectorAll('nav a').forEach((item) => item.classList.remove('active'));
    link.classList.add('active');
  }));

  window.addEventListener('keydown', (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      el.search.focus();
    }
    if (event.key === 'Escape') closeDetail();
  });
};

bindEvents();
render();
void loadInitial();
