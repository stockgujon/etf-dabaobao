# info.tpex.org.tw ETF 專區 API 驗證

探測時間：2026-09-08T13:16:30.126Z

## Q1. etfFilter 全量清單

✅ 成功，可用的呼叫方式：**POST 表單**
頂層欄位：`factorList`, `rangeRorYTD`, `rangeRor1M`, `data`, `rangeRor3M`, `issuerList`, `rangeTotalAv`, `status`
資料筆數：**119**

第一筆的所有欄位：
```
issuerID, listingDate, issuerLink, stockName, totalAv, holders, indexName, valueYTD, volumeYTD, rorYTD, stockNo, issuer
```

## Q2. 關鍵欄位完整度

| 欄位 | 有值筆數 | 空值筆數 |
| --- | --- | --- |
| `stockNo` | 119 | 0 |
| `stockName` | 119 | 0 |
| `listingDate` | 119 | 0 |
| `indexName` | 118 | 1 |
| `totalAv` | 119 | 0 |
| `holders` | 119 | 0 |
| `issuer` | 119 | 0 |

指標樣本：

```json
[
 {
  "issuerID": "A00005",
  "listingDate": "20170117",
  "issuerLink": "http://www.yuantaetfs.com/",
  "stockName": "元大美債20年",
  "totalAv": "1,600.66",
  "holders": "234,567",
  "indexName": "ICE美國政府20+年期債券指數",
  "valueYTD": "960.58",
  "volumeYTD": "35,556,496",
  "rorYTD": -6.02,
  "stockNo": "00679B",
  "issuer": "元大投信"
 },
 {
  "issuerID": "A00005",
  "listingDate": "20110127",
  "issuerLink": "http://www.yuantaetfs.com/",
  "stockName": "元大富櫃50",
  "totalAv": "10.49",
  "holders": "5,608",
  "indexName": "櫃買富櫃五十指數",
  "valueYTD": "13.69",
  "volumeYTD": "336,126",
  "rorYTD": 75.51,
  "stockNo": "006201",
  "issuer": "元大投信"
 },
 {
  "issuerID": "A00016",
  "listingDate": "20231205",
  "issuerLink": "https://www.capitalfund.com.tw/",
  "stockName": "群益ESG投等債20+",
  "totalAv": "2,441.01",
  "holders": "212,777",
  "indexName": "ICE ESG 20年期以上BBB級成熟市場大型美元公司債指數",
  "valueYTD": "974.43",
  "volumeYTD": "65,441,873",
  "rorYTD": -5.9,
  "stockNo": "00937B",
  "issuer": "群益投信"
 }
]
```

## Q3. 是否也提供收盤價

可能的價格／量能欄位：`totalAv`, `volumeYTD`

## Q4. 與目前網站的 119 檔比對

目前網站上櫃：**119** 檔　etfFilter：**119** 檔
只在 etfFilter 有的（0 檔）：無
只在網站有的（0 檔）：無

### 官方規模 vs 我們的推估規模

| 代號 | 名稱 | 我們推估 | 官方 totalAv | 差異 |
| --- | --- | --- | --- | --- |
| 00411A | 主動統一前沿科技 | 62 億 | 62.33 億 | 0.5% |
| 006201 | 元大富櫃50 | 10 億 | 10.49 億 | 4.7% |
| 00679B | 元大美債20年 | 1594 億 | 1600.66 億 | 0.4% |
| 00687B | 國泰20年美債 | 1145 億 | 1151.35 億 | 0.6% |
| 00694B | 富邦美債1-3 | 11 億 | 11.47 億 | 4.1% |
| 00695B | 富邦美債7-10 | 14 億 | 13.85 億 | 1.1% |
| 00696B | 富邦美債20年 | 172 億 | 173.15 億 | 0.7% |
| 00697B | 元大美債7-10 | 23 億 | 23.01 億 | 0.0% |

可比對 118 檔，平均差異 **2.3%**

## Q5. 官方分類篩選 vs 我們的代號末碼

- ✅ 債券：官方 **101** 檔　我們代號末碼推得 **101** 檔　官方多出 0 檔　官方少了 0 檔
- ✅ 主動式：官方 **7** 檔　我們代號末碼推得 **7** 檔　官方多出 0 檔　官方少了 0 檔
- ✅ 槓桿：官方 **0** 檔　我們代號末碼推得 **0** 檔　官方多出 0 檔　官方少了 0 檔

## Q6. 單一商品頁網址

`https://info.tpex.org.tw/ETF/zh/detail.html?query=00679B` → HTTP 200，長度 7567
內容含「00679B」：否　含「元大」：否
（若是前端渲染的頁面，內容可能不含代號，仍需人工開網址確認）

---

探測結束，未修改 `data/etfs.json`。
