// ETF 四層分類規則：由 reference-source/app/lib/etf-classification.ts 原樣移植。
// 四層彼此為 AND 條件：管理方式、產品結構、資產類別、策略／主題。

export const MANAGEMENT_OPTIONS = ['全部方式', '被動式', '主動式'];
export const STRUCTURE_OPTIONS = ['全部結構', '原型', '槓桿', '反向'];
export const ASSET_CLASS_OPTIONS = ['全部資產', '台灣股票', '海外股票', '債券', '商品', '多資產', 'REITs', '外匯'];
export const THEME_OPTIONS = ['全部策略', '市值', '高股息', '產業', 'ESG', '因子'];

const includesAny = (value, words) => words.some((word) => value.includes(word));

export const classifyEtf = (source = {}) => {
  const categories = source.categories ?? [];
  const text = `${source.fundType ?? ''} ${source.indexName ?? ''} ${source.investmentTarget ?? ''} ${source.name ?? ''}`;

  const managementStyle = categories.includes('主動型') || includesAny(text, ['主動式', '主動選股'])
    ? '主動式'
    : '被動式';

  const productStructure = categories.includes('槓桿型')
    ? '槓桿'
    : categories.includes('反向型')
      ? '反向'
      : '原型';

  let assetClass = '台灣股票';
  if (categories.includes('債券型') || includesAny(text, ['債券', '公債', '公司債', '金融債', '高收益債', '投資級債', '非投資級債'])) assetClass = '債券';
  else if (categories.includes('商品型') || includesAny(text, ['期貨信託', '原物料', '黃金', '原油', '石油', '白銀', '銅'])) assetClass = '商品';
  else if (categories.includes('多資產') || includesAny(text, ['多資產', '平衡型'])) assetClass = '多資產';
  else if (categories.includes('REITs') || includesAny(text, ['REIT', '不動產'])) assetClass = 'REITs';
  else if (categories.includes('外匯型') || includesAny(text, ['外匯', '美元正', '美元反', '日圓正', '日圓反', '人民幣正', '人民幣反'])) assetClass = '外匯';
  else if (
    includesAny(source.fundType ?? '', ['國外', '境外'])
    || includesAny(source.investmentTarget ?? '', ['國外股票', '全球股票', '美國股票', '日本股票', '中國股票', '印度股票', '越南股票', '歐洲股票', '亞洲股票'])
  ) assetClass = '海外股票';

  const isLeveragedOrInverse = categories.includes('槓桿型') || categories.includes('反向型');
  const themes = [];
  // 「市值」限定為被動、原型的官方市值型 ETF；主動式一律不得標記為市值。
  if (categories.includes('市值型') && managementStyle === '被動式' && !isLeveragedOrInverse) themes.push('市值');
  if (categories.includes('高股息')) themes.push('高股息');
  if (categories.includes('產業型')) themes.push('產業');
  if (categories.includes('ESG型')) themes.push('ESG');
  if (categories.includes('因子型')) themes.push('因子');

  return { managementStyle, productStructure, assetClass, themes };
};
