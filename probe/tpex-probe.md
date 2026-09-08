# 櫃買中心（TPEx）資料端點探測報告 v2

探測時間：2026-09-08T07:07:58.984Z

swagger.json 讀取成功，共 **225** 個端點。

## A. 說明含「ETF」的端點

**沒有任何端點的名稱或說明包含 ETF。**

## B. 說明含「受益人數／規模／淨值／資產」的端點

- `/tpex_mainboard_peratio_analysis` — 上櫃股票個股本益比、殖利率、股價淨值比
- `/tpex_dpsp_monthly_CBmcs007` — 可轉債資產交換ASO及ASW銀行承作餘額
- `/tpex_opfund_recommended_dealer` — 開放式基金受益憑證造市商與造市之基金
- `/mopsfin_t187ap07_O_basi` — 上櫃公司資產負債表(金融業)
- `/mopsfin_t187ap07_O_bd` — 上櫃公司資產負債表(證券期貨業)
- `/mopsfin_t187ap07_O_ci` — 上櫃公司資產負債表(一般業)
- `/mopsfin_t187ap07_O_fh` — 上櫃公司資產負債表(金控業)
- `/mopsfin_t187ap07_O_ins` — 上櫃公司資產負債表(保險業)
- `/mopsfin_t187ap07_O_mim` — 上櫃公司資產負債表(異業)
- `/mopsfin_t187ap07_U_bd` — 興櫃公司資產負債表-證券期貨業
- `/mopsfin_t187ap07_U_ci` — 興櫃公司資產負債表-一般業
- `/mopsfin_t187ap07_U_fh` — 興櫃公司資產負債表-金控業
- `/mopsfin_t187ap07_U_ins` — 興櫃公司資產負債表-保險業
- `/mopsfin_t187ap07_U_mim` — 興櫃公司資產負債表-異業
- `/mopsfin_t187ap07_U_basi` — 興櫃公司資產負債表-金融業

## C. 每日行情／收盤類端點

- `/tpex_mainboard_daily_close_quotes` — 上櫃股票行情
- `/tpex_mainboard_quotes` — 上櫃股票收盤行情
- `/tpex50_index` — 富櫃50指數歷史收盤指數
- `/tpex_off_market` — 上櫃股票盤後定價行情
- `/tpex_ceil_non_trading` — 上櫃漲跌停未成交資訊
- `/tpex_daily_trading_index` — 上櫃日成交量值指數
- `/tpex_short_sell` — 上櫃當日融券賣出與借券賣出成交量值
- `/tpex_active_dollar_volume` — 上櫃盤中個股成交金額排行
- `/tpex_trading_volume_ratio` — 上櫃歷史類股成交價量比重
- `/tpex_daily_qutoes_block` — 上櫃鉅額交易日成交資訊
- `/tpex_daily_trading_block` — 上櫃個股單一證券鉅額交易日成交資訊
- `/tpex_daily_trading_summary_odd` — 上櫃鉅額交易日成交量值統計
- `/tpex_monthly_trading_summary_block` — 上櫃鉅額交易月成交量值統計
- `/tpex_yearly_trading_summary_block` — 上櫃鉅額交易年成交量值統計
- `/tpex_volume_rank` — 上櫃歷史個股成交量排行
- `/tpex_amount_rank` — 上櫃歷史個股成交值排行
- `/tpex_prvol` — 上櫃股票等價系統成交分價表
- `/tpex_daily_trade_block_day` — 鉅額交易歷史成交資訊
- `/tpex_delayed_stock_close` — 上櫃每日暫緩收盤股票
- `/tpex200_change` — 櫃買「富櫃200指數」當日收盤指數
- `/tpcgi_reward_index` — 上櫃公司治理指數歷史收盤指數
- `/tpcgi_change` — 上櫃公司治理指數當日收盤指數
- `/tpex50_change` — 櫃買「富櫃50指數」當日收盤指數
- `/tphd_change` — 櫃買「高殖利率指數」當日收盤指數
- `/tpci_change` — 櫃買「薪酬指數」當日收盤指數
- `/tpci_reward_index` — 櫃買「薪酬指數」歷史收盤指數
- `/tpex_emp88_change` — 櫃買「勞工就業88指數」當日收盤指數
- `/tpex_emp88_reward_index` — 櫃買「勞工就業88指數」歷史收盤指數
- `/tpex_international_bond_quotes` — 國際債券當日盤中報價行情表(含寶島債)
- `/tpex_international_bond_trade` — 國際債券當日盤中成交行情表(含寶島債)

## D. 實測：行情端點裡找得到上櫃 ETF 嗎

- ✅ `/tpex_mainboard_daily_close_quotes` — 10984 筆，疑似 ETF 代號 119 筆，命中目標代號：00679B、00687B、00937B、00772B、00773B、006201
- ✅ `/tpex_mainboard_quotes` — 1013 筆，疑似 ETF 代號 119 筆，命中目標代號：00679B、00687B、00937B、00772B、00773B、006201
- ✅ `/tpex50_index` — 5 筆，疑似 ETF 代號 0 筆，命中目標代號：無
- ✅ `/tpex_off_market` — 10984 筆，疑似 ETF 代號 119 筆，命中目標代號：00679B、00687B、00937B、00772B、00773B、006201
- ✅ `/tpex_ceil_non_trading` — 21 筆，疑似 ETF 代號 0 筆，命中目標代號：無
- ✅ `/tpex_daily_trading_index` — 5 筆，疑似 ETF 代號 0 筆，命中目標代號：無
- ✅ `/tpex_short_sell` — 1006 筆，疑似 ETF 代號 119 筆，命中目標代號：00679B、00687B、00937B、00772B、00773B、006201
- ✅ `/tpex_active_dollar_volume` — 30 筆，疑似 ETF 代號 0 筆，命中目標代號：無
- ✅ `/tpex_trading_volume_ratio` — 28 筆，疑似 ETF 代號 0 筆，命中目標代號：無
- ✅ `/tpex_daily_qutoes_block` — 6 筆，疑似 ETF 代號 0 筆，命中目標代號：無
- ✅ `/tpex_daily_trading_block` — 770 筆，疑似 ETF 代號 0 筆，命中目標代號：無
- ✅ `/tpex_daily_trading_summary_odd` — 20 筆，疑似 ETF 代號 0 筆，命中目標代號：無

### 🎯 找到了

端點：`https://www.tpex.org.tw/openapi/v1/tpex_mainboard_daily_close_quotes`
總筆數：**10984**，其中代號長得像 ETF 的有 **119** 筆

欄位：`Date`, `SecuritiesCompanyCode`, `CompanyName`, `Close`, `Change`, `Open`, `High`, `Low`, `Average`, `TradingShares`, `TransactionAmount`, `TransactionNumber`, `LatestBidPrice`, `LatesAskPrice`, `Capitals`, `NextReferencePrice`, `NextLimitUp`, `NextLimitDown`

目標代號的完整資料：

```json
[
 {
  "Date": "1150907",
  "SecuritiesCompanyCode": "006201",
  "CompanyName": "元大富櫃50",
  "Close": "45.41",
  "Change": "+1.23",
  "Open": "44.98",
  "High": "45.82",
  "Low": "44.98",
  "Average": "45.50",
  "TradingShares": "137950",
  "TransactionAmount": "6276737",
  "TransactionNumber": "324",
  "LatestBidPrice": "45.41",
  "LatesAskPrice": "45.49",
  "Capitals": "22946000",
  "NextReferencePrice": "45.41",
  "NextLimitUp": "49.95",
  "NextLimitDown": "40.87"
 },
 {
  "Date": "1150907",
  "SecuritiesCompanyCode": "00679B",
  "CompanyName": "元大美債20年",
  "Close": "25.62",
  "Change": "-0.16 ",
  "Open": "25.72",
  "High": "25.72",
  "Low": "25.62",
  "Average": "25.66",
  "TradingShares": "14028064",
  "TransactionAmount": "359955832",
  "TransactionNumber": "4115",
  "LatestBidPrice": "25.62",
  "LatesAskPrice": "25.63",
  "Capitals": "6225692000",
  "NextReferencePrice": "25.62",
  "NextLimitUp": "9999.95",
  "NextLimitDown": "0.01"
 },
 {
  "Date": "1150907",
  "SecuritiesCompanyCode": "00687B",
  "CompanyName": "國泰20年美債",
  "Close": "26.97",
  "Change": "-0.15 ",
  "Open": "27.06",
  "High": "27.06",
  "Low": "26.96",
  "Average": "26.99",
  "TradingShares": "9179290",
  "TransactionAmount": "247729283",
  "TransactionNumber": "2455",
  "LatestBidPrice": "26.96",
  "LatesAskPrice": "26.97",
  "Capitals": "4254880380",
  "NextReferencePrice": "26.97",
  "NextLimitUp": "9999.95",
  "NextLimitDown": "0.01"
 },
 {
  "Date": "1150907",
  "SecuritiesCompanyCode": "00772B",
  "CompanyName": "中信高評級公司債",
  "Close": "32.17",
  "Change": "-0.22 ",
  "Open": "32.30",
  "High": "32.30",
  "Low": "32.17",
  "Average": "32.20",
  "TradingShares": "2292232",
  "TransactionAmount": "73806773",
  "TransactionNumber": "931",
  "LatestBidPrice": "32.17",
  "LatesAskPrice": "32.18",
  "Capitals": "3363290000",
  "NextReferencePrice": "32.17",
  "NextLimitUp": "9999.95",
  "NextLimitDown": "0.01"
 }
]
```

前 8 筆疑似 ETF：

```json
[
 {
  "Date": "1150907",
  "SecuritiesCompanyCode": "00411A",
  "CompanyName": "主動統一前沿科技",
  "Close": "9.81",
  "Change": "0.00 ",
  "Open": "9.88",
  "High": "9.90",
  "Low": "9.81",
  "Average": "9.84",
  "TradingShares": "11371620",
  "TransactionAmount": "111949787",
  "TransactionNumber": "1680",
  "LatestBidPrice": "9.81",
  "LatesAskPrice": "9.82",
  "Capitals": "632076000",
  "NextReferencePrice": "9.81",
  "NextLimitUp": "9999.95",
  "NextLimitDown": "0.01"
 },
 {
  "Date": "1150907",
  "SecuritiesCompanyCode": "006201",
  "CompanyName": "元大富櫃50",
  "Close": "45.41",
  "Change": "+1.23",
  "Open": "44.98",
  "High": "45.82",
  "Low": "44.98",
  "Average": "45.50",
  "TradingShares": "137950",
  "TransactionAmount": "6276737",
  "TransactionNumber": "324",
  "LatestBidPrice": "45.41",
  "LatesAskPrice": "45.49",
  "Capitals": "22946000",
  "NextReferencePrice": "45.41",
  "NextLimitUp": "49.95",
  "NextLimitDown": "40.87"
 },
 {
  "Date": "1150907",
  "SecuritiesCompanyCode": "00679B",
  "CompanyName": "元大美債20年",
  "Close": "25.62",
  "Change": "-0.16 ",
  "Open": "25.72",
  "High": "25.72",
  "Low": "25.62",
  "Average": "25.66",
  "TradingShares": "14028064",
  "TransactionAmount": "359955832",
  "TransactionNumber": "4115",
  "LatestBidPrice": "25.62",
  "LatesAskPrice": "25.63",
  "Capitals": "6225692000",
  "NextReferencePrice": "25.62",
  "NextLimitUp": "9999.95",
  "NextLimitDown": "0.01"
 },
 {
  "Date": "1150907",
  "SecuritiesCompanyCode": "00687B",
  "CompanyName": "國泰20年美債",
  "Close": "26.97",
  "Change": "-0.15 ",
  "Open": "27.06",
  "High": "27.06",
  "Low": "26.96",
  "Average": "26.99",
  "TradingShares": "9179290",
  "TransactionAmount": "247729283",
  "TransactionNumber": "2455",
  "LatestBidPrice": "26.96",
  "LatesAskPrice": "26.97",
  "Capitals": "4254880380",
  "NextReferencePrice": "26.97",
  "NextLimitUp": "9999.95",
  "NextLimitDown": "0.01"
 },
 {
  "Date": "1150907",
  "SecuritiesCompanyCode": "00687C",
  "CompanyName": "國泰20年美債+櫃U",
  "Close": "9.09",
  "Change": "0.00 ",
  "Open": "9.09",
  "High": "9.09",
  "Low": "9.09",
  "Average": "9.09",
  "TradingShares": "25000",
  "TransactionAmount": "227250",
  "TransactionNumber": "2",
  "LatestBidPrice": "9.07",
  "LatesAskPrice": "9.10",
  "Capitals": "1942268",
  "NextReferencePrice": "9.09",
  "NextLimitUp": "9999.95",
  "NextLimitDown": "0.01"
 },
 {
  "Date": "1150907",
  "SecuritiesCompanyCode": "00694B",
  "CompanyName": "富邦美債1-3",
  "Close": "41.56",
  "Change": "-0.17 ",
  "Open": "41.61",
  "High": "41.62",
  "Low": "41.51",
  "Average": "41.55",
  "TradingShares": "117055",
  "TransactionAmount": "4863357",
  "TransactionNumber": "51",
  "LatestBidPrice": "41.55",
  "LatesAskPrice": "41.56",
  "Capitals": "27576000",
  "NextReferencePrice": "41.56",
  "NextLimitUp": "9999.95",
  "NextLimitDown": "0.01"
 },
 {
  "Date": "1150907",
  "SecuritiesCompanyCode": "00695B",
  "CompanyName": "富邦美債7-10",
  "Close": "34.41",
  "Change": "-0.21 ",
  "Open": "34.39",
  "High": "34.48",
  "Low": "34.39",
  "Average": "34.42",
  "TradingShares": "152198",
  "TransactionAmount": "5238124",
  "TransactionNumber": "59",
  "LatestBidPrice": "34.40",
  "LatesAskPrice": "34.41",
  "Capitals": "40186000",
  "NextReferencePrice": "34.41",
  "NextLimitUp": "9999.95",
  "NextLimitDown": "0.01"
 },
 {
  "Date": "1150907",
  "SecuritiesCompanyCode": "00696B",
  "CompanyName": "富邦美債20年",
  "Close": "27.94",
  "Change": "-0.15 ",
  "Open": "28.02",
  "High": "28.02",
  "Low": "27.92",
  "Average": "27.95",
  "TradingShares": "1864014",
  "TransactionAmount": "52100805",
  "TransactionNumber": "209",
  "LatestBidPrice": "27.92",
  "LatesAskPrice": "27.94",
  "Capitals": "618181000",
  "NextReferencePrice": "27.94",
  "NextLimitUp": "9999.95",
  "NextLimitDown": "0.01"
 }
]
```

## E. 備援來源測試

- ✅ 證交所 上市基金基本資料 — 271 筆，命中目標代號：無
- ✅ 證交所 上市每日行情 — 1382 筆，命中目標代號：無
- ❌ 集保 OpenAPI 規格 `https://openapi-t.tdcc.com.tw/v3/api-docs` — HTTP 404

---

探測結束，未修改 `data/etfs.json`。
