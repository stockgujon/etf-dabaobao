# 國內ETF大秘寶｜國內上市與上櫃ETF清單

以純 HTML / CSS / JavaScript（ES modules）建置的臺灣 ETF 資料工具，涵蓋證交所全部上市 ETF 與櫃買中心全部上櫃 ETF，可直接放進 GitHub repository 並用 GitHub Pages 發布。網站開啟時只讀取本 repository 的 `./data/etfs.json`，搜尋、篩選、排序、比較與投入試算全部在瀏覽器本機完成。

- 沒有 React / Next.js / Vue / Vite / npm build。
- 沒有登入、會員、後台管理頁或資料輸入表單。
- 瀏覽器不會直接呼叫證交所，也不會觸發 GitHub Actions。

## 檔案結構

```text
/
├─ index.html                     入口頁（必須放在 repository 根目錄）
├─ assets/
│  ├─ styles.css                  純 CSS（米白底 + 土黃字配色）
│  ├─ app.js                      前端主程式（ES module）
│  ├─ etf-classification.js       四層分類規則
│  ├─ favicon.svg
│  └─ og.png
├─ data/
│  └─ etfs.json                   最後一次成功保存的完整 ETF 資料
├─ scripts/
│  └─ update-etfs.mjs             每日同步腳本（只在 GitHub Actions 執行）
├─ .github/workflows/
│  ├─ pages.yml                   GitHub Pages 部署
│  └─ update-etfs.yml             每日 ETF 同步排程
├─ .nojekyll
└─ README.md
```

所有內部資源都使用相對路徑（`./assets/...`、`./data/...`），因此「使用者網站」`https://<帳號>.github.io/` 與「專案子路徑網站」`https://<帳號>.github.io/<repo>/` 都能正常運作。

## 建立 GitHub repository 與發布

1. 在 GitHub 建立新的 repository（公開或私有皆可，私有需 GitHub Pages 支援的方案）。
2. 把本資料夾內所有檔案（含 `.github/`、`.nojekyll`）推上 `main` 分支。
3. 進入 repository → **Settings → Pages**，Source 選 **GitHub Actions**。
4. 進入 **Actions** 分頁，確認 `Deploy to GitHub Pages` 執行成功，取得網址。
5. 在 **Actions** 分頁點 `Update ETF snapshot` → **Run workflow**，手動試跑一次每日同步。
6. 若 repository 的 Actions 寫入權限被關閉，請到 **Settings → Actions → General → Workflow permissions**，選 **Read and write permissions**。

不需要、也不應該建立任何 Personal Access Token；同步只使用 GitHub Actions 自動提供的 `GITHUB_TOKEN`，權限限定 `contents: write`。

## 每日資料同步

| 台灣時間 | UTC cron | 用途 |
| --- | --- | --- |
| 平日 18:00 | `0 10 * * 1-5` | 例行同步 |
| 平日 18:15 | `15 10 * * 1-5` | 重試 |
| 平日 18:45 | `45 10 * * 1-5` | 重試 |
| 平日 20:00 | `0 12 * * 1-5` | 證交所較晚更新時的補抓 |
| 平日 22:00 | `0 14 * * 1-5` | 補抓 |
| 隔日 08:30 | `30 0 * * 2-6` | 補抓 |

證交所 ETF e添富 的「資料更新時間」不保證當天 18:00 就翻新（實測平日 18:30 仍停在前一交易日），因此排程拉長到深夜與隔日早上。資料若與上一次成功保存的完全相同，腳本會直接跳過不寫檔，所以多跑幾次沒有副作用。

- 若 `data/etfs.json` 的 `officialDate` 已等於台灣當天日期且上次同步成功，後續排程會直接跳過，不再改動資料檔。
- **不要求 `officialDate` 必須等於今天**：只要日期沒有倒退且通過全部驗證就照常保存，並在資料日非當天時於 `syncWarning` 附上說明。否則遇到交易所更新較慢，資料會永遠停在舊版本。
- 若合併後的 ETF 陣列與上一次成功保存的完全相同，直接跳過不寫檔，不產生無意義的提交。
- 同步成功：通過全部驗證後以暫存檔 + `rename` 原子替換整份 JSON，`syncStatus` 設為 `success`。
- 假日或證交所尚未提供當日完整資料：視為本次同步未完成，**完整保留** `etfs` 陣列與 `officialDate`，只更新 `lastAttemptAt`、`syncStatus: fallback` 與 `syncWarning`。
- 同步失敗：同樣完整保留舊資料，只更新狀態欄位，`syncStatus: error`，工作流程以失敗結束，方便在 Actions 追查。
- 只有檔案真的變更才會 commit，訊息固定為 `data: refresh TWSE ETF snapshot`。

同步前的驗證項目：ETF 至少 100 檔、`meta.count` 等於陣列長度、代號不重複且代號與名稱非空、每檔都有分類資料、新資料日期不早於現有日期、筆數不得比上一版減少超過 5%、`00919` 資產規模大於 1,000 億、`00981A` 必須為主動式且不含「市值」主題、主動式 ETF 一律不得進入市值主題、`dailyTradingVolume` 由 `TradeVolume / 1000` 換算為張。

## 「重新載入最新資料」按鈕做什麼

按下按鈕時，前端只會做一件事：

```js
fetch('./data/etfs.json?ts=' + Date.now(), { cache: 'no-store' })
```

它只是重新讀取 GitHub Pages 上目前的資料檔，看看排程有沒有更新過內容。它**不會**觸發 GitHub Actions、不會呼叫證交所或 GitHub API，也**不會影響每日同步的執行時間與頻率**。讀取失敗時會保留畫面上已有的資料，只顯示錯誤提示。

## 兩個市場的資料差異

| 欄位 | 上市（證交所） | 上櫃（櫃買中心） |
| --- | --- | --- |
| 代號、名稱、收盤價 | ✅ 官方 | ✅ 官方 |
| 日成交量（張） | ✅ `TradeVolume / 1000` | ✅ `TradingShares / 1000`（同口徑） |
| 資產規模 | ✅ ETF e添富官方 AUM | ✅ 櫃買 ETF 訊息中心官方 `totalAv`；取不到才退回推估並標示 |
| 受益人數 | ✅ 官方 | ✅ 官方 `holders` |
| 掛牌日期、標的指數、發行人 | ✅ 官方 | ✅ 官方 |
| 基金經理人、保管機構 | ✅ 官方 | ❌ API 未提供（詳情視窗導向櫃買商品頁） |
| 管理方式、產品結構、資產類別 | ✅ ETF e添富官方篩選 | ✅ 依櫃買代號末碼規則推導 |
| 策略／主題（市值、高股息、產業、ESG、因子） | ✅ 官方篩選 | ➖ 一律留空（櫃買無官方分類來源） |

櫃買代號末碼規則：`B` 台幣計價債券、`C` 外幣計價債券、`D` 主動式債券、`A` 主動式股票、`L` 槓桿、`R` 反向、`T` 多資產、`U` 期貨信託、無尾碼為一般股票型。

上櫃的基金面資料取自櫃買中心 ETF 訊息中心：

```
POST https://info.tpex.org.tw/api/etfFilter        （表單格式，不帶條件即回傳全部 119 檔）
欄位：stockNo, stockName, listingDate, indexName, totalAv, holders, issuer, issuerLink
```

實測（2026-09-08）：119 檔全部有規模、受益人數、掛牌日期與發行人，標的指數 118/119（缺的是主動式，本來就不適用）；檔數與代號跟每日行情端點**完全一致**。

**代號末碼推導已與官方篩選核對過**：債券 101 對 101、主動式 7 對 7、槓桿 0 對 0，完全吻合，因此不需要額外呼叫 8 個官方分類篩選端點（每次同步省下 8 個請求）。

若訊息中心暫時取不到，上櫃規模會自動退回「已發行單位數 × 收盤價」的推估值並在畫面標示「推估」，受益人數與基本資料留空，上市資料完全不受影響。

上櫃單一商品頁：`https://info.tpex.org.tw/ETF/zh/detail.html?query=<代號>`

**刻意不採用**：回傳中的 `rorYTD`、`valueYTD`、`volumeYTD`（今年以來報酬率與成交值）——本站不呈現歷史報酬與績效。

## 三個日期分別代表什麼

`data/etfs.json` 的 meta 有三個日期，來源不同、更新節奏也不同：

| 欄位 | 意義 | 來源 |
| --- | --- | --- |
| `officialDate` | e添富 首頁標示的「資料更新時間」，對應**資產規模與受益人數**的口徑，通常比收盤價晚一天 | `https://www.twse.com.tw/rwd/zh/ETFortune/index` 的 HTML |
| `listedPriceDate` | **上市收盤價**的實際交易日 | 依序嘗試三支證交所 RWD 端點（見下），全部取不到則為 `null`，畫面就不標日期 |
| 每檔的 `priceDate` | **該檔收盤價**的實際交易日 | 上市：價格確實取自當日行情時才寫入 `listedPriceDate`，否則 `null`；上櫃：櫃買行情該列自帶的 `Date` |
| `listedPriceDateSource` | 上面那個日期實際取自哪一支端點 | 由同步腳本記錄，方便日後追查 |
| `otcOfficialDate` | **上櫃**收盤價與成交量的交易日 | 櫃買行情每列的 `Date`（民國年轉西元） |

因此畫面上會出現「e添富 資料更新日 09/07」但「收盤價 09/08」的情形，這是證交所本身的更新節奏，不是資料抓錯。每一列 ETF 的收盤價下方都會標示該筆價格的實際交易日。

### ⚠️ 證交所日報的 `date` 欄位是「查詢日」，不是「資料日」

實測 2026-09-09 17:27 取 `BWIBBU_ALL`：頂層 `date` 是 `20260909`，`title` 卻是「115/09/8」，真正的資料日是 **9/8**。若採信 `date`，全站的收盤價都會被標成隔一天（實際發生過）。因此：

- 日期一律從 `title`（含 `tables[].title`）解析，`date` 只在完全沒有標題時當備援，並在 `listedPriceDateSource` 註明來源是標題還是 `date` 欄位。
- 解析出來的日期若晚於台灣當天，直接判定為查詢日並丟棄，寧可不標也不標錯。

同一個原因也改了收盤價的來源：上市收盤價**優先取自證交所每日行情 `STOCK_DAY_ALL` 的 `ClosingPrice`**（與日期同屬當日盤後檔案），只有該檔當日沒有行情時才退回 e添富 的 `close1`，而且**那一檔不標日期**（`priceDate: null`），滑鼠移到價格上會說明原因。上櫃則直接用櫃買行情每列自帶的 `Date`，逐檔各標各的。

腳本另有兩個健康度警告（只警告、不中止）：當日行情覆蓋率低於 90%，或兩個價格來源不一致的比例超過 20%（代表兩份檔案可能不是同一個交易日），都會寫進 `syncWarning` 顯示在畫面上。

## 官方資料來源

- 商品與官方分類入口：<https://www.twse.com.tw/zh/ETFortune/products>
- ETF e添富商品結果：`https://www.twse.com.tw/rwd/zh/ETFortune/ajaxProductsResult`
- 收盤價與成交股數：`https://openapi.twse.com.tw/v1/exchangeReport/STOCK_DAY_ALL`
- 基金基本資料：`https://openapi.twse.com.tw/v1/opendata/t187ap47_L`
- 上櫃 ETF 收盤價與成交量：`https://www.tpex.org.tw/openapi/v1/tpex_mainboard_daily_close_quotes`
- 上櫃 ETF 基金面資料：`POST https://info.tpex.org.tw/api/etfFilter`
- 上市收盤價日期（依序嘗試，取到就停）：
  1. `https://www.twse.com.tw/rwd/zh/afterTrading/BWIBBU_ALL?response=json` — 有 `date` 欄位，回應小，首選
  2. `https://www.twse.com.tw/rwd/zh/afterTrading/MI_INDEX?type=ALL&response=json` — 也有 `date`，備援
  3. `https://www.twse.com.tw/rwd/zh/afterTrading/STOCK_DAY_AVG_ALL?response=json` — 從標題「115年09月08日」解析

  註：`/rwd/zh/afterTrading/STOCK_DAY_ALL` 與舊路徑 `/exchangeReport/STOCK_DAY_ALL` 實測回傳非 JSON，不可用。

分類一律採用證交所 ETF e添富的官方篩選結果交叉比對，不以名稱關鍵字猜測。「市值」僅限官方市值型、被動式、非槓桿、非反向的 ETF；主動式 ETF 不會出現在市值篩選結果。

## 表格的響應式行為

實測固定欄寬要到 **1366px 以上**才能完整顯示 8 個欄位而不截字，因此：

- **≥1366px**：沿用 v17 的固定欄寬（`table-layout:fixed`、`overflow-x:hidden`），桌機不需要左右捲動。
- **<1366px**（含筆電 1280、平板、手機）：改為 `table-layout:auto` + `min-width:900px`，表格區塊可左右滑動，所有欄位完整顯示不截字，並在表格上方出現「← 左右滑動可看完整欄位 →」提示。

頁面本身在任何寬度都不會產生水平捲軸，只有表格區塊內部會捲動。

## 不讓搜尋引擎收錄

本站僅供個人使用，因此做了兩件事：

1. `index.html` 的 `<head>` 放入 `noindex` 指令：

   ```html
   <meta name="robots" content="noindex, nofollow, noarchive, nosnippet, noimageindex" />
   <meta name="googlebot" content="noindex, nofollow, noarchive, nosnippet, noimageindex" />
   ```

2. 根目錄的 `robots.txt`：**刻意允許** Googlebot 與 Bingbot 抓取，其餘爬蟲一律 `Disallow: /`。

第 2 點看起來矛盾，但這是 Google 官方建議的作法：`noindex` 寫在網頁裡，爬蟲必須讀得到那一頁才看得到它。若在 `robots.txt` 直接封鎖 Googlebot，Google 讀不到 `noindex`，一旦從別處發現這個網址，反而可能在搜尋結果留下一筆「只有網址、沒有摘要」的項目，而且再也無法用 `noindex` 移除。

`robots.txt` 必須被複製進 `_site/`，否則不會部署（見 `pages.yml` 的 Assemble static site 步驟）。

注意：這只讓網站不出現在搜尋結果，**不等於不公開**。GitHub Pages 網址與公開 repository 的內容，任何知道網址的人都能直接開啟。

## 本機預覽

必須用靜態 HTTP server 開啟（ES modules 與 `fetch` 不支援 `file://`）：

```bash
python3 -m http.server 8000
# 然後開啟 http://localhost:8000/
```

## 免責

資料來源為臺灣證券交易所 ETF e添富，僅供參考，不構成投資建議。投入模擬的年化報酬率由使用者自行假設，未計交易成本、稅負及配息，屬數學試算而非報酬預測。
