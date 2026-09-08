# 櫃買中心探測報告 v3｜補完基本資料與受益人數

探測時間：2026-09-08T07:23:20.750Z

## Q6. 上櫃 ETF 組成分佈

上櫃 ETF 共 **119** 檔（資料日 1150907）

| 代號末碼 | 櫃買定義 | 檔數 |
| --- | --- | --- |
| B | 債券（台幣計價） | 95 |
| （無英文尾碼） | 一般股票型 | 15 |
| D | 主動式債券 | 5 |
| A | 主動式股票 | 2 |
| C | 債券（外幣計價） | 1 |
| T | 多資產 | 1 |

無英文尾碼的（可能是股票型）：006201 元大富櫃50、00858 永豐美國500大、00877 復華中國5G、00886 永豐美國科技、00887 永豐中國科技50大、00888 永豐台灣ESG、00928 中信上櫃ESG 30、00955 中信日本商社、009806 台新標普500、009807 台新標普科技精選、009814 富邦標普500、009815 大華美國MAG7+、009822 華南永昌未來金融、009823 群益S&P500、009825 聯邦美國金融創新

規模推估抽查（Capitals × Close ÷ 1e8 = 億元）：

- 00679B 元大美債20年：1595 億（單位數 6,225,692,000，收盤 25.62）
- 00687B 國泰20年美債：1148 億（單位數 4,254,880,380，收盤 26.97）
- 00937B 群益ESG投等債20+：2433 億（單位數 17,100,305,000，收盤 14.23）
- 006201 元大富櫃50：10 億（單位數 22,946,000，收盤 45.41）

## Q4. 基本資料類端點（上市日期／發行人／標的指數）

- `/tpex_margin_trading_marginspot` — 上櫃信用交易餘額概況表
- `/t187ap46_O_21` — 上櫃公司企業ESG資訊揭露彙總資料-職業安全衛生
- `/t187ap46_O_9` — 上櫃公司企業ESG資訊揭露彙總資料-功能性委員會
- `/t187ap46_O_8` — 上櫃公司企業ESG資訊揭露彙總資料-氣候相關議題管理
- `/tpex_warrant_gold` — 黃金現貨權證發行基本資料
- `/tpex_warrant_issue` — 上櫃權證發行基本資料
- `/tpex_warrant_wcb_issue` — 上櫃牛熊證發行基本資料(不含展延型牛熊證)
- `/tpex_warrant_wxy_issue` — 上櫃展延型牛熊證發行基本資料
- `/t187ap46_O_20` — 上櫃公司企業ESG資訊揭露彙總資料-反競爭行為法律訴訟
- `/t187ap46_O_19` — 上櫃公司企業ESG資訊揭露彙總資料-風險管理政策
- `/t187ap46_O_15` — 上櫃公司企業ESG資訊揭露彙總資料-社區關係
- `/t187ap46_O_13` — 上櫃公司企業ESG資訊揭露彙總資料-供應鏈管理
- `/t187ap46_O_12` — 上櫃公司企業ESG資訊揭露彙總資料-食品安全
- `/t187ap46_O_14` — 上櫃公司企業ESG資訊揭露彙總資料-產品品質與安全
- `/t187ap41_O` — 上櫃公司召開股東常 (臨時) 會日期、地點及採用電子投票情形等資料彙總表
- `/t187ap46_O_4` — 上櫃公司企業ESG資訊揭露彙總資料-廢棄物管理
- `/t187ap46_O_2` — 上櫃公司企業ESG資訊揭露彙總資料-能源管理
- `/t187ap46_O_7` — 上櫃公司企業ESG資訊揭露彙總資料-投資人溝通
- `/t187ap46_O_1` — 上櫃公司企業ESG資訊揭露彙總資料-溫室氣體排放
- `/t187ap46_O_6` — 上櫃公司企業ESG資訊揭露彙總資料-董事會
- `/t187ap46_O_5` — 上櫃公司企業ESG資訊揭露彙總資料-人力發展
- `/t187ap46_O_3` — 上櫃公司企業ESG資訊揭露彙總資料-水資源管理
- `/mopsfin_t187ap37_O` — 上櫃權證基本資料彙總表
- `/mopsfin_t187ap42_O` — 上櫃認購(售)權證每日成交資料檔
- `/mopsfin_t187ap03_O` — 上櫃股票基本資料
- `/mopsfin_t187ap36_O` — 上櫃認購(售)權證年度發行量概況統計表
- `/mopsfin_t187ap03_R` — 興櫃公司基本資料

## Q5. 受益人數相關端點

**swagger 裡沒有任何端點提供受益人數。**

## 實測基本資料端點

- ❌ `/mopsfin_t187ap47_O` — 回傳不是 JSON
- ❌ `/mopsfin_t187ap47_R` — 回傳不是 JSON
- ❌ `/tpex_mainboard_basic` — 回傳不是 JSON
- ❌ `/tpex_company_basic_info` — 回傳不是 JSON
- ❌ `/tpex_securities_basic` — 回傳不是 JSON
- ✅ `/tpex_margin_trading_marginspot` — 34 筆，命中 ETF 代號：無
  欄位：`Month`, `Ranking`, `SecuritiesCompanyCode`, `CompanyName`, `MonthlyAverageMarginPurchaseBalance`, `MarketShare`, `MonthlyAverageShortSaleBalance`, `MonthlyAverageMarginTradingBalance`
- ✅ `/t187ap46_O_21` — 888 筆，命中 ETF 代號：無
  欄位：`出表日期`, `報告年度`, `公司代號`, `公司名稱`, `職業災害人數及比率-人數`, `職業災害人數及比率-比率`, `火災件數(件)`, `火災死傷人數(人)`, `火災死傷人數占員工總人數比率`
- ✅ `/t187ap46_O_9` — 888 筆，命中 ETF 代號：無
  欄位：`出表日期`, `報告年度`, `公司代號`, `公司名稱`, `薪酬委員會席次(席)`, `薪酬委員會獨立董事席次(席)`, `薪酬委員會出席率`, `審計委員會席次(席)`, `審計委員會出席率`
- ✅ `/t187ap46_O_8` — 888 筆，命中 ETF 代號：無
  欄位：`出表日期`, `報告年度`, `公司代號`, `公司名稱`, `董事會與管理階層對於氣候相關風險與機會之監督及治理`, `辨識之氣候風險與機會如何影響企業之業務、策略及財務 (短期、中期、長期)`, `極端氣候事件及轉型行動對財務之影響`, `氣候風險之辨識、評估及管理流程如何整合於整體風險管理制度`, `若使用情境分析評估面對氣候變遷風險之韌性，應說明所使用之情境、參數、假設、分析因子及主要財務影響`, `若有因應管理氣候相關風險之轉型計畫，說明該計畫內容，及用於辨識及管理實體風險及轉型風險之指標與目標`, `使用內部碳定價作為規劃工具，應說明價格制定基礎`, `若有設定氣候相關目標，應說明所涵蓋之活動、溫室氣體排放範疇、規劃期程，每年達成進度等資訊；若使用碳抵換或再生能源憑證(RECs)以達成相關目標，應說明所抵換之減碳額度來源及數量或再生能源憑證(RECs)數量`
- ✅ `/tpex_warrant_gold` — 2 筆，命中 ETF 代號：無
  欄位：`Date`, `Code`, `Name`, `ListedDate`, `ExpiryDate`, `UnderlyingStockCode`, `UnderlyingStock`, `Type`, `American/European`, `CapPrice/Index`, `FloorPrice/Index`, `Reset`, `LatestExercisePrice`, `LatestExerciseRatio`, `InitialIssuance`, `Accum.Accum.Issuance`, `Accum.CanceledWarrant`
- ✅ `/tpex_warrant_issue` — 9971 筆，命中 ETF 代號：00679B
  欄位：`Date`, `Code`, `Name`, `ListedDate`, `ExpiryDate`, `UnderlyingStockCode`, `UnderlyingStock`, `Type`, `American/European`, `CapPrice/Index`, `FloorPrice/Index`, `Reset`, `LatestExercisePrice`, `Latest ExerciseRatio`, `InitialIssuance`, `Accum.Accum.Issuance`, `Accum.CanceledWarrant`

```json
{
 "Date": "1150907",
 "Code": "701064",
 "Name": "元債20群益61購01",
 "ListedDate": "20251030",
 "ExpiryDate": "20270129",
 "UnderlyingStockCode": "00679B",
 "UnderlyingStock": "元大美債2",
 "Type": "認購",
 "American/European": "美式",
 "CapPrice/Index": "    ",
 "FloorPrice/Index": "    ",
 "Reset": "N",
 "LatestExercisePrice": "29.73",
 "Latest ExerciseRatio": "0.678",
 "InitialIssuance": "5000",
 "Accum.Accum.Issuance": "0",
 "Accum.CanceledWarrant": "3500"
}
```

- ✅ `/tpex_warrant_wcb_issue` — 1 筆，命中 ETF 代號：00679B
  欄位：`Date`, `Code`, `Name`, `ListedDate`, `ExpiryDate`, `UnderlyingStockCode`, `UnderlyingStock`, `Type`, `American/European`, `CapPrice/Index`, `FloorPrice/Index`, `Reset`, `LatestExercisePrice`, `Latest ExerciseRatio`, `InitialIssuance`, `Accum.Accum.Issuance`, `Accum.CanceledWarrant`

```json
{
 "Date": "1150601",
 "Code": "70006C",
 "Name": "元債20富邦56牛01",
 "ListedDate": "20250604",
 "ExpiryDate": "20260603",
 "UnderlyingStockCode": "00679B",
 "UnderlyingStock": "元大美",
 "Type": "認購",
 "American/European": "歐式",
 "CapPrice/Index": "",
 "FloorPrice/Index": "21.77",
 "Reset": "Y",
 "LatestExercisePrice": "21.28",
 "Latest ExerciseRatio": "0.312",
 "InitialIssuance": "20000",
 "Accum.Accum.Issuance": "0",
 "Accum.CanceledWarrant": "0"
}
```


## 外部備援：集保結算所

- ❌ `https://openapi.tdcc.com.tw/v1/swagger.json` — HTTP 404
- ❌ `https://openapi.tdcc.com.tw/swagger/v1/swagger.json` — HTTP 404
- ❌ `https://www.tdcc.com.tw/portal/zh/openAPI` — HTTP 404

---

探測結束，未修改 `data/etfs.json`。
