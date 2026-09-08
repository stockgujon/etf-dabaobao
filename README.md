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
| 平日 18:15 | `15 10 * * 1-5` | 失敗時自動重試 |
| 平日 18:45 | `45 10 * * 1-5` | 失敗時自動重試 |

- 若 `data/etfs.json` 的 `officialDate` 已等於台灣當天日期且上次同步成功，後續排程會直接跳過，不再改動資料檔。
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
| 資產規模 | ✅ ETF e添富官方 AUM | ⚠️ 推估：`已發行受益權單位數 × 收盤價`，畫面標示「推估」 |
| 受益人數 | ✅ 官方 | ❌ 櫃買未公開 |
| 掛牌日期、發行人、經理人、保管機構、標的指數 | ✅ 官方 | ❌ 櫃買未公開 |
| 管理方式、產品結構、資產類別 | ✅ ETF e添富官方篩選 | ✅ 依櫃買代號末碼規則推導 |
| 策略／主題（市值、高股息、產業、ESG、因子） | ✅ 官方篩選 | ➖ 一律留空（櫃買無官方分類來源） |

櫃買代號末碼規則：`B` 台幣計價債券、`C` 外幣計價債券、`D` 主動式債券、`A` 主動式股票、`L` 槓桿、`R` 反向、`T` 多資產、`U` 期貨信託、無尾碼為一般股票型。

上櫃規模為推估值一事，在表格、比較卡與詳情視窗三處都有明確標示，排序與篩選照常可用。

## 官方資料來源

- 商品與官方分類入口：<https://www.twse.com.tw/zh/ETFortune/products>
- ETF e添富商品結果：`https://www.twse.com.tw/rwd/zh/ETFortune/ajaxProductsResult`
- 收盤價與成交股數：`https://openapi.twse.com.tw/v1/exchangeReport/STOCK_DAY_ALL`
- 基金基本資料：`https://openapi.twse.com.tw/v1/opendata/t187ap47_L`
- 上櫃 ETF 行情：`https://www.tpex.org.tw/openapi/v1/tpex_mainboard_daily_close_quotes`

分類一律採用證交所 ETF e添富的官方篩選結果交叉比對，不以名稱關鍵字猜測。「市值」僅限官方市值型、被動式、非槓桿、非反向的 ETF；主動式 ETF 不會出現在市值篩選結果。

## 本機預覽

必須用靜態 HTTP server 開啟（ES modules 與 `fetch` 不支援 `file://`）：

```bash
python3 -m http.server 8000
# 然後開啟 http://localhost:8000/
```

## 免責

資料來源為臺灣證券交易所 ETF e添富，僅供參考，不構成投資建議。投入模擬的年化報酬率由使用者自行假設，未計交易成本、稅負及配息，屬數學試算而非報酬預測。
