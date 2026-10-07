# 國內ETF大秘寶｜國內上市與上櫃ETF清單

以純 HTML / CSS / JavaScript（ES modules）建置的臺灣 ETF 資料工具，涵蓋證交所全部上市 ETF 與櫃買中心全部上櫃 ETF，可直接放進 GitHub repository 並用 GitHub Pages 發布。網站開啟時只讀取本 repository 的 `./data/etfs.json`，搜尋、篩選、排序、比較與投入試算全部在瀏覽器本機完成。

- 沒有 React / Next.js / Vue / Vite / npm build。
- 沒有登入、會員、後台管理頁或資料輸入表單。
- 瀏覽器不會直接呼叫證交所，也不會觸發 GitHub Actions。

---

## 🔔 人工確認紀錄（請每 1～2 個月更新一次）

GitHub 官方規則：**公開 repository 若連續 60 天沒有「repository activity」，排程工作會被自動停用。**

同步腳本每天都在提交 `data/etfs.json`，但那是 `github-actions[bot]` 的提交，**不保證被算成 activity**。最保險的作法是定期由本人提交一次。

**做法**：在下面表格加一列（日期 + 當天看到的狀態），然後 Commit。這一個動作同時完成三件事：重置 60 天計時器、留下維護紀錄、順手確認網站還活著。

| 確認日期 | 官方資料日 | 收盤價日 | 狀態 |
| --- | --- | --- | --- |
| 2026-10-07 | — | — | 建立本紀錄表；排程與資料正常 |

> 下次請直接複製上面那一列改日期即可。欄位看網站左側「查證狀態」區塊就有。
>
> 提交後會觸發一次 `Deploy to GitHub Pages`（約 25 秒，綠燈），屬正常現象。
>
> 萬一真的被停用，GitHub 會寄信通知，到 **Actions → Update ETF snapshot → Enable workflow** 點一下即可恢復，資料不會遺失。

---

## 檔案結構

```text
/
├─ index.html                     入口頁（必須放在 repository 根目錄）
├─ robots.txt                     搜尋引擎規則（必須被 pages.yml 複製進 _site/）
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
2. 把本資料夾內所有檔案（含 `.github/`、`.nojekyll`、`robots.txt`）推上 `main` 分支。
3. 進入 repository → **Settings → Pages**，Source 選 **GitHub Actions**。
4. 進入 **Actions** 分頁，確認 `Deploy to GitHub Pages` 執行成功，取得網址。
5. 在 **Actions** 分頁點 `Update ETF snapshot` → **Run workflow**，手動試跑一次每日同步。
6. 若 repository 的 Actions 寫入權限被關閉，請到 **Settings → Actions → General → Workflow permissions**，選 **Read and write permissions**。

不需要、也不應該建立任何 Personal Access Token；同步只使用 GitHub Actions 自動提供的 `GITHUB_TOKEN`，權限限定 `contents: write`。

## 每日資料同步

| 台灣時間 | UTC cron | 用途 |
| --- | --- | --- |
| **平日 18:00** | `0 10 * * 1-5` | **關鍵班次：當天收盤價通常在這一班進來** |
| 平日 18:15 | `15 10 * * 1-5` | 接力 |
| 平日 18:45 | `45 10 * * 1-5` | 接力 |
| 平日 20:00 | `0 12 * * 1-5` | 補抓 |
| 平日 22:00 | `0 14 * * 1-5` | 補抓 |
| 隔日 08:30 | `30 0 * * 2-6` | 主要是補**資產規模與受益人數**（來源端慢一個交易日） |

每一班都完整重抓全部資料（20 個請求），不是增量更新。資料若與上一次成功保存的完全相同，腳本直接跳過不寫檔，所以多跑幾次沒有副作用。

**判斷是否正常只看一條：傍晚 18:00 那班有沒有在 18:00～18:20 之間跑完。** 其餘班次晚跑不影響收盤價。

### ⚠️ GitHub 的排程不保證準時

官方文件原文：

> Scheduled workflows are delayed during periods of high load on GitHub Actions runners and runs are not guaranteed to run at the exact scheduled time.

實測 2026-09-28～29：傍晚四班誤差都在 15 分鐘內，但 22:00 那班被延到隔天 04:18（+6h18m）、08:30 那班被延到 13:58（+5h28m）。這是 GitHub 端的負載問題，**不是設定壞掉，也不影響資料正確性**——晚跑只是晚確認一次。一天排六班就是為了這種狀況。

### 同步的保存規則

- 若 `data/etfs.json` 的 `officialDate` 已等於台灣當天日期且上次同步成功，後續排程會直接跳過，不再改動資料檔。
- **不要求 `officialDate` 必須等於今天**：只要日期沒有倒退且通過全部驗證就照常保存，並在資料日非當天時於 `syncWarning` 附上說明。否則遇到交易所更新較慢，資料會永遠停在舊版本。
- 若合併後的 ETF 陣列與上一次成功保存的完全相同，直接跳過不寫檔，不產生無意義的提交。**因此畫面上的「最後成功更新」停著不動，代表資料沒變，不是沒跑。**
- 同步成功：通過全部驗證後以暫存檔 + `rename` 原子替換整份 JSON，`syncStatus` 設為 `success`。
- 假日或證交所尚未提供當日完整資料：視為本次同步未完成，**完整保留** `etfs` 陣列與 `officialDate`，只更新 `lastAttemptAt`、`syncStatus: fallback` 與 `syncWarning`。
- 同步失敗：同樣完整保留舊資料，只更新狀態欄位，`syncStatus: error`，工作流程以失敗結束，方便在 Actions 追查。
- 只有檔案真的變更才會 commit，訊息固定為 `data: refresh TWSE ETF snapshot`。

### 驗證分級（重要原則）

只有會**誤導數字**的才致命並中止同步；只影響**資訊豐富度**的（掛牌日期、發行人、受益人數、價格日期缺漏）記警告即可。

致命項目：ETF 至少 100 檔、`meta.count` 等於陣列長度、代號不重複且代號與名稱非空、每檔都有分類資料、新資料日期不早於現有日期、筆數不得比上一版減少超過 5%、`00919` 資產規模大於 1,000 億、`00981A` 必須為主動式且不含「市值」主題、主動式 ETF 一律不得進入市值主題、`00679B` 存在且規模大於 1,000 億且為債券且非推估、`006201` 存在、上櫃官方規模覆蓋率 ≥ 90%、上櫃不得帶策略主題、每檔都要有 `market`。

## 連假與長假期間的行為

- cron 設定是週一～週五與週二～週六，**連假中的平日照常觸發**。
- 交易所照常回應，只是內容跟封關日相同 → 判定「無變更」→ 跳過寫檔。
- 驗證規則只要求「日期不倒退」「筆數不驟減」，**完全相同是通過的**；**沒有任何「太久沒更新就算失敗」的機制**。
- 畫面上：橫幅那句「官方資料日為 X（尚未更新至今天）」會整個連假掛著，「最後成功更新」停在放假前——兩者都正確。
- 開市後第一個交易日傍晚自動恢復，不需人工介入。

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
POST https://info.tpex.org.tw/api/etfFilter        （表單格式，不帶條件即回傳全部上櫃 ETF）
欄位：stockNo, stockName, listingDate, indexName, totalAv, holders, issuer, issuerLink
```

實測（2026-09-08）：119 檔全部有規模、受益人數、掛牌日期與發行人，標的指數 118/119（缺的是主動式，本來就不適用）；檔數與代號跟每日行情端點**完全一致**。

**代號末碼推導已與官方篩選核對過**：債券 101 對 101、主動式 7 對 7、槓桿 0 對 0，完全吻合，因此不需要額外呼叫 8 個官方分類篩選端點（每次同步省下 8 個請求）。

若訊息中心暫時取不到，上櫃規模會自動退回「已發行單位數 × 收盤價」的推估值並在畫面標示「推估」，受益人數與基本資料留空，上市資料完全不受影響。

上櫃單一商品頁：`https://info.tpex.org.tw/ETF/zh/detail.html?query=<代號>`

**刻意不採用**：回傳中的 `rorYTD`、`valueYTD`、`volumeYTD`（今年以來報酬率與成交值）——本站不呈現歷史報酬與績效。

> 註：總檔數會隨下市、合併而變動（2026-09-08 為 359 檔，2026-09-18 起為 358 檔）。畫面右上角「已載入 N 檔」與左側「符合條件 N−1 檔」固定差 1，是預設收盤價範圍 0–9999 擋掉一檔，不是資料掉了。

## 日期欄位分別代表什麼

`data/etfs.json` 的欄位中有數個日期，來源不同、更新節奏也不同：

| 欄位 | 意義 | 來源 |
| --- | --- | --- |
| `meta.officialDate` | e添富 首頁標示的「資料更新時間」，對應**資產規模與受益人數**的口徑，比收盤價慢一個交易日 | `https://www.twse.com.tw/rwd/zh/ETFortune/index` 的 HTML |
| **每檔的 `priceDate`** | **該檔收盤價的實際交易日——畫面完全以它為準** | 見下方決策規則；無法確認時為 `null`，畫面就不標日期 |
| `meta.listedPriceDate` | 上市整體實際採用的收盤價日（整體參考） | 同上 |
| `meta.listedPriceOrigin` | 上市價格這次取自 `e添富` 還是 `證交所每日行情` | 同步腳本記錄 |
| `meta.listedReportDate` | 證交所日報自己標的日期（僅供追查，**不可信**，見下） | 日報 `title` |
| `meta.otcOfficialDate` | 上櫃收盤價與成交量的交易日 | 櫃買行情每列的 `Date`（民國年轉西元） |

因此畫面上會出現「e添富 資料更新日 09/07」但「收盤價 09/08」的情形，這是證交所本身的更新節奏，不是資料抓錯。

### 上市收盤價：兩個來源交叉比對後才決定日期

證交所有兩種節奏完全不同的來源，而且**都不會告訴你自己是哪一天**的價格：

| 來源 | 新鮮度 | 有沒有日期 |
| --- | --- | --- |
| e添富 `close1` | 快（收盤後約一小時就換日） | ❌ 沒有 |
| 每日行情 `STOCK_DAY_ALL.ClosingPrice` | 慢（可能慢半天到一天） | ❌ 沒有 |

因此改成比對兩者的價格：

1. **兩邊價格一致** → 用日行情的價格，標示日報的交易日。
2. **大面積不一致（超過一半）** → 代表 e添富 已經換日。**改用 e添富 的較新價格**，並以**櫃買行情的交易日**為它定日期——上市與上櫃共用同一個交易日曆與交易時段，櫃買已發布該日行情即代表該交易日確實已收盤。這是跨市場交叉驗證，不是推測。
3. **不一致但櫃買也沒有更新的日期** → 價格照樣顯示最新的，但**不標日期**，滑鼠移上去說明「實際交易日不明」。

規則 2 是每天傍晚的常態，因此**只寫進 Actions 執行記錄，不掛 `::warning::`、不進 `syncWarning`**（否則網站每天都會掛一條嚇人的黃字）。只有規則 3、或當日行情覆蓋率低於 90% 才算需要注意，會寫進 `syncWarning` 顯示在畫面上。

**沒有任何路徑會把新價格換成舊價格**：不一致時一律採用較新的 e添富。唯一會變動的是日期標示，不是價格。

上櫃則直接用櫃買行情每列自帶的 `Date`，逐檔各標各的。

### 🟡 已知問題（經討論後決定不修）：非交易日的日期標示

**證交所日報的日期欄位兩個都不可信**：

| 查詢日 | `date` | `title` | 當時最近交易日 | 判定 |
| --- | --- | --- | --- | --- |
| 2026-09-09（三） | 20260909 | 115/09/8 | 9/8 | 巧合吻合 |
| 2026-09-14（一） | 20260914 | **115/09/13** | 9/11（五） | ❌ 9/13 是週日 |
| 2026-09-20（六） | 20260920 | 115/09/19 | 9/19（五） | 吻合（不具鑑別力） |

三次觀察都符合「`title` = 查詢日 − 1 天」，`date` 則一律等於查詢日。兩者都不是資料日。

**何時會出事**：只有走**規則 1** 時才會採用這個日期。平常傍晚 e添富 領先 → 走規則 2 → 用櫃買日期，繞過了它。但**排程跑在非交易日的平日時**（連假、碰到週一的國定假日），兩個來源都停在封關日、必然一致 → 走規則 1 → 可能把收盤價標成沒開盤的日子。

**影響**：只有日期標示錯，價格數字正確；不會累積；開市後第一天自動回正。

**決定（2026-09-20）**：評估後**不修**——不影響數字、會自癒、頻率低。
> 請勿在未經討論下「順手修掉」這件事。若日後要修，方向是：交易日一律以櫃買行情的日期為準，對不上就留白，等於廢掉規則 1 的日期來源。

另外保留的防護：解析出來的日期若晚於台灣當天，直接判定為查詢日並丟棄，寧可不標也不標錯。

## 外部來源故障時會怎樣（兩次實際案例）

| 日期 | 現象 | 處理與結果 |
| --- | --- | --- |
| 2026-09-14 | 櫃買兩個主機 TLS 憑證鏈不完整（`unable to verify the first certificate`），傍晚起連續四班失敗 | **等**。當晚 22:00 對方自行修好。期間上櫃沿用舊快照、上市照常更新、上市收盤價暫不標日期 |
| 2026-09-18 | 20:00 那班卡在「證交所每日行情」（`read ECONNRESET`，對方切斷連線），Actions 紅叉 | **等**。22:00 那班正常。18:00 已抓到當天資料，畫面全程正確 |

憑證問題的意義：對方伺服器沒把中介憑證一起送出，瀏覽器會自行補抓（AIA）、Node.js 不會，所以會出現「網站打得開但程式抓不到」。若再次發生且持續多日，備而未用的修法是讓 Node 改用系統憑證庫（`NODE_OPTIONS=--use-openssl-ca` 或 `NODE_EXTRA_CA_CERTS=/etc/ssl/certs/ca-certificates.crt`），或把缺的中介憑證放進 repo——**都保留完整驗證**。絕不關閉憑證驗證。

**共同教訓：外部來源的短暫故障，先等。** 降級設計（保留舊資料、不猜日期、把原因寫進 `syncWarning` 顯示在前台）讓兩次事件都不需要人工介入。

## Actions 頁面的圖示怎麼看

| 圖示 | 意思 |
| --- | --- |
| 🟢 綠勾 | 成功 |
| ⚪ 灰色驚嘆號 | **已取消**，不是錯誤。`pages.yml` 設了 `cancel-in-progress`，短時間連推兩次時前一次會被取消 |
| 🔴 紅叉 | 同步沒成功，但舊資料完整保留，網站不會壞 |
| ⚠️ 黃色註記 | 多半是本專案自己寫的診斷訊息；`Node.js 20 is deprecated` 則是 GitHub 自己的提醒，與資料無關 |

**真正需要處理的只有**：連續兩三天同一階段紅叉，或網站橫幅出現失敗訊息。

## 官方資料來源

- 商品與官方分類入口：<https://www.twse.com.tw/zh/ETFortune/products>
- ETF e添富商品結果：`https://www.twse.com.tw/rwd/zh/ETFortune/ajaxProductsResult`
- 收盤價與成交股數：`https://openapi.twse.com.tw/v1/exchangeReport/STOCK_DAY_ALL`
- 基金基本資料：`https://openapi.twse.com.tw/v1/opendata/t187ap47_L`
- 上櫃 ETF 收盤價與成交量：`https://www.tpex.org.tw/openapi/v1/tpex_mainboard_daily_close_quotes`
- 上櫃 ETF 基金面資料：`POST https://info.tpex.org.tw/api/etfFilter`
- 上市收盤價日期（依序嘗試，取到就停；日期一律解析 `title`，見前述已知問題）：
  1. `https://www.twse.com.tw/rwd/zh/afterTrading/BWIBBU_ALL?response=json` — 回應小，首選
  2. `https://www.twse.com.tw/rwd/zh/afterTrading/MI_INDEX?type=ALL&response=json` — 日期在 `tables[].title`
  3. `https://www.twse.com.tw/rwd/zh/afterTrading/STOCK_DAY_AVG_ALL?response=json` — 從標題解析

  ❌ 不可用：`/rwd/zh/afterTrading/STOCK_DAY_ALL` 與舊路徑 `/exchangeReport/STOCK_DAY_ALL`（HTTP 200 但非 JSON）。
  ⚠️ `MI_INDEX` 不帶 `date` 與帶 `date=` 參數實測都曾回到一週前的內容，不能假設它是最新交易日。

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

資料來源為臺灣證券交易所 ETF e添富與證券櫃檯買賣中心，僅供參考，不構成投資建議。投入模擬的年化報酬率由使用者自行假設，未計交易成本、稅負及配息，屬數學試算而非報酬預測。
