# 證交所「上市收盤價交易日」端點探測 v4

探測時間：2026-09-08T12:18:12.072Z

目標：找出哪一支端點能提供上市收盤價的實際交易日。

## A. `https://www.twse.com.tw/rwd/zh/afterTrading/STOCK_DAY_ALL?response=json`

HTTP 200，長度 128912，非 JSON
文字中找到的日期：（無）

## B. `https://www.twse.com.tw/exchangeReport/STOCK_DAY_ALL?response=json`

HTTP 200，長度 128912，非 JSON
文字中找到的日期：（無）

## C. `https://www.twse.com.tw/rwd/zh/afterTrading/BWIBBU_ALL?response=json`

HTTP 200，長度 39838，JSON
頂層欄位：`stat`, `date`, `title`, `fields`, `data`, `notes`
**date 欄位：`20260908`** ← 這就是要的
title：`115/09/7 個股日本益比、殖利率及股價淨值比`
stat：`OK`
data 筆數：1083
文字中找到的日期：2026.09.08

## D. `https://www.twse.com.tw/rwd/zh/afterTrading/MI_INDEX?type=ALL&response=json`

HTTP 200，長度 4397565，JSON
頂層欄位：`tables`, `type`, `params`, `stat`, `date`
**date 欄位：`20260908`** ← 這就是要的
stat：`OK`
文字中找到的日期：2026.09.08

## E. `https://www.twse.com.tw/rwd/zh/afterTrading/STOCK_DAY_AVG_ALL?response=json`

HTTP 200，長度 946326，JSON
頂層欄位：`stat`, `title`, `fields`, `data`, `notes`
title：`115年09月08日 個股日收盤價及月平均價`
stat：`OK`
data 筆數：26101
文字中找到的日期：2026.09.08

## F. `https://openapi.twse.com.tw/v1/exchangeReport/BWIBBU_ALL`

HTTP 200，長度 111439，JSON
陣列，1083 筆
第一筆欄位：`Date`, `Code`, `Name`, `PEratio`, `DividendYield`, `PBratio`
文字中找到的日期：（無）

## G. e添富 首頁的日期標示

HTTP 200，長度 49539
「資料更新時間」附近的文字：

```
受益人次排行 資料更新時間：2026.09.07 排名
```

整頁找到的日期：2026.08.20、2026.07.31、2026.06.24、2026.06.23、2026.06.08、2026.06.09

---

探測結束，未修改 `data/etfs.json`。
