# 櫃買中心（TPEx）資料端點探測報告

探測時間：2026-09-08T06:59:47.369Z

## 1. 尋找 OpenAPI 規格

- `https://www.tpex.org.tw/openapi/swagger.json` → HTTP 200，application/json，長度 476923
- `https://www.tpex.org.tw/openapi/v1/swagger.json` → HTTP 200，text/html，長度 21053
- `https://www.tpex.org.tw/openapi/v3/api-docs` → HTTP 200，text/html，長度 9437
- `https://www.tpex.org.tw/openapi/doc.json` → HTTP 200，text/html，長度 9437
- `https://www.tpex.org.tw/openapi/v1/` → HTTP 200，text/html，長度 21053
- `https://www.tpex.org.tw/openapi/` → HTTP 200，text/html，長度 2677

## 2. 端點清單

從 `https://www.tpex.org.tw/openapi/swagger.json` 取得 **225** 個端點。

其中與 ETF／債券／基金相關的有 **24** 個：

- `/tpex_mainboard_peratio_analysis` — 上櫃股票個股本益比、殖利率、股價淨值比
- `/tpex_dpsp_monthly_CBmcs007` — 可轉債資產交換ASO及ASW銀行承作餘額
- `/tpex_international_bond_quotes` — 國際債券當日盤中報價行情表(含寶島債)
- `/tpex_international_bond_trade` — 國際債券當日盤中成交行情表(含寶島債)
- `/tpex_international_bond_issue_investor` — 國際債券(一般投資人)
- `/tpex_international_bond_issue_org` — 國際債券(僅售予專業投資人者)
- `/tpex_opfund_latest` — 開放式基金當日行情表
- `/tpex_opfund_recommended_dealer` — 開放式基金受益憑證造市商與造市之基金
- `/tpex_opfund_market_highlight` — 開放式基金市場現況
- `/BDdos216UTF` — 美元固定利率不可贖回國際債券理論價格
- `/BDdos215UTF` — 美元附息固定利率可贖回國際債券理論價格
- `/BDdos209UTF` — 美元零息可贖回國際債券理論價格
- `/bond_cb_daily` — 轉(交)換公司債買賣斷券商買賣日報表
- `/bond_ISSBD1_data` — 公債發行資料下載
- `/bond_ISSBD2_data` — 外國金融債發行資料下載
- `/bond_ISSBD3_data` — 金融債發行資料下載
- `/bond_ISSBD4_data` — 普通債發行資料下載
- `/bond_ISSBD5_data` — 轉(交)換債發行資料下載
- `/bond_ISSBD6_data` — 海外轉換債發行資料下載
- `/bond_ISSBD7_data` — 附認股權公司債發行資料下載
- `/bond_ISSBD8_data` — 海外附認股權公司債發行資料下載
- `/bond_ISSBD9_data` — 海外普通債發行資料下載
- `/bond_ISSBD10_data` — 國際債券(寶島債券)-本國發行人及第一、二上市(櫃)公司之外國發行人發行資料下載
- `/bond_ISSBD11_data` — 國際債券(寶島債券)-外國發行人(在我國未公開發行股權商品者)發行資料下載

<details><summary>全部端點路徑</summary>

- `/tpex_mainborad_highlight` — 上櫃股票市場現況
- `/tpex_securities` — 上櫃股票現股當沖交易標的資訊
- `/tpex_spendi_today` — 上櫃當日公布暫停/恢復交易股票
- `/tpex_spendi_history` — 上櫃歷史公布暫停/恢復交易股票
- `/tpex_mainboard_daily_close_quotes` — 上櫃股票行情
- `/tpex_mainboard_quotes` — 上櫃股票收盤行情
- `/tpex_mainboard_peratio_analysis` — 上櫃股票個股本益比、殖利率、股價淨值比
- `/tpex_mainboard_margin_balance` — 上櫃股票融資融券餘額
- `/tpex_index` — 櫃買指數歷史資料
- `/tpex50_index` — 富櫃50指數歷史收盤指數
- `/tpex_intraday_trading_statistics` — 上櫃股票現股當沖交易統計資訊
- `/tpex_active_broker_volume` — 上櫃股票熱門股證券商進出排行
- `/tpex_margin_sbl` — 上櫃股票融券借券賣出餘額
- `/tpex_exright_daily` — 上櫃股票除權除息計算結果表
- `/tpex_exright_prepost` — 上櫃股票除權除息預告表
- `/tpex_cmode` — 上櫃股票變更交易、分盤交易、管理股票與停止交易資訊
- `/tpex_odd_stock` — 上櫃股票零股交易資訊
- `/tpex_off_market` — 上櫃股票盤後定價行情
- `/tpex_esb_applicant_companies` — 申請上櫃公司
- `/tpex_trading_warning_information` — 上櫃公布注意股票資訊
- `/tpex_disposal_information` — 上櫃處置有價證券資訊
- `/tpex_trading_warning_note` — 上櫃公布注意累計次數異常資訊
- `/tpex_margin_trading_term` — 上櫃融資融券暫停融券賣出預告表
- `/tpex_margin_trading_adjust` — 上櫃融資融券調整成數
- `/tpex_margin_trading_lend` — 上櫃融資融券標借
- `/tpex_margin_trading_marginspot` — 上櫃信用交易餘額概況表
- `/tpex_margin_trading_margin_mark` — 上櫃平盤下得融(借)券賣出之證券名單
- `/tpex_margin_trading_margin_used` — 上櫃融資融券使用率報表
- `/tpex_margin_trading_short_sell` — 上櫃融資融券增減排行表
- `/tpex_3insti_qfii` — 上櫃僑外資及陸資持股比例排行表
- `/tpex_3insti_qfii_industry` — 上櫃各類股僑外資及陸資持股比例表
- `/tpex_3insti_daily_trading` — 上櫃股票三大法人買賣明細資訊
- `/tpex_3insti_dealer_trading` — 上櫃股票自營商買賣超彙總表
- `/tpex_ceil_non_trading` — 上櫃漲跌停未成交資訊
- `/tpex_daily_trading_index` — 上櫃日成交量值指數
- `/tpex_short_sell` — 上櫃當日融券賣出與借券賣出成交量值
- `/tpex_daily_broker1` — 上櫃各券商當日營業金額統計表
- `/tpex_active_dollar_volume` — 上櫃盤中個股成交金額排行
- `/tpex_active_advanced` — 上櫃盤中個股漲幅排行
- `/tpex_active_declined` — 上櫃盤中個股跌幅排行
- `/tpex_intraday_fee` — 上櫃應付現股當日沖銷券差借券費率
- `/tpex_intraday_trading_pre` — 上櫃暫停先賣後買當日沖銷交易標的預告表
- `/tpex_intraday_trading_his` — 上櫃暫停先賣後買當日沖銷交易歷史查詢
- `/tpex_daily_market_value` — 上櫃歷史個股市值排行
- `/tpex_daily_turnover` — 上櫃歷史個股週轉率排行
- `/tpex_trading_volumes_avg` — 上櫃歷史個股日均量排行
- `/tpex_trading_amount_avg` — 上櫃歷史個股日均值排行
- `/tpex_trading_volume_ratio` — 上櫃歷史類股成交價量比重
- `/tpex_pe_ratio_top10` — 上櫃歷史個股本益比排行
- `/tpex_daily_qutoes_block` — 上櫃鉅額交易日成交資訊
- `/tpex_daily_trading_block` — 上櫃個股單一證券鉅額交易日成交資訊
- `/tpex_daily_trading_summary_odd` — 上櫃鉅額交易日成交量值統計
- `/tpex_monthly_trading_summary_block` — 上櫃鉅額交易月成交量值統計
- `/tpex_yearly_trading_summary_block` — 上櫃鉅額交易年成交量值統計
- `/tpex_volume_rank` — 上櫃歷史個股成交量排行
- `/tpex_amount_rank` — 上櫃歷史個股成交值排行
- `/tpex_prvol` — 上櫃股票等價系統成交分價表
- `/tpex_3insti_summary` — 上櫃股票三大法人買賣金額彙總表
- `/tpex_3insti_trading` — 上櫃股票投信買賣超彙總表
- `/tpex_daily_trade_block_day` — 鉅額交易歷史成交資訊
- `/tpex_delayed_stock_open` — 上櫃每日暫緩開盤股票
- `/tpex_delayed_stock_close` — 上櫃每日暫緩收盤股票
- `/tpex_ipo_no_limit` — 上櫃首五日無漲跌幅資訊
- `/tpex_esb_eps_rank` — 本國興櫃公司EPS排名
- `/tpex_esb_capitals_rank` — 興櫃公司資本額排名
- `/tpex200_change` — 櫃買「富櫃200指數」當日收盤指數
- `/tpcgi_constituents` — 上櫃公司治理指數當日成分股資訊
- `/tpcgi_reward_index` — 上櫃公司治理指數歷史收盤指數
- `/tpcgi_change` — 上櫃公司治理指數當日收盤指數
- `/tpex_index_consti` — 櫃買指數成分股
- `/tpex_reward_index` — 櫃買指數與報酬指數之收市指數
- `/tpex50_constituents` — 櫃買「富櫃50指數」當日成分股
- `/tpex50_change` — 櫃買「富櫃50指數」當日收盤指數
- `/tphd_constituents` — 櫃買「高殖利率指數」當日成分股
- `/tphd_change` — 櫃買「高殖利率指數」當日收盤指數
- `/tpci_constituents` — 櫃買「薪酬指數」當日成分股
- `/tpci_change` — 櫃買「薪酬指數」當日收盤指數
- `/tpci_reward_index` — 櫃買「薪酬指數」歷史收盤指數
- `/tpex_emp88_constituents` — 櫃買「勞工就業88指數」當日成分股
- `/tpex_emp88_change` — 櫃買「勞工就業88指數」當日收盤指數
- `/tpex_emp88_reward_index` — 櫃買「勞工就業88指數」歷史收盤指數
- `/tpex_dpsp_monthly_CBmcs007` — 可轉債資產交換ASO及ASW銀行承作餘額
- `/tpex_international_bond_quotes` — 國際債券當日盤中報價行情表(含寶島債)
- `/tpex_international_bond_trade` — 國際債券當日盤中成交行情表(含寶島債)
- `/tpex_international_bond_issue_investor` — 國際債券(一般投資人)
- `/tpex_international_bond_issue_org` — 國際債券(僅售予專業投資人者)
- `/t187ap46_O_21` — 上櫃公司企業ESG資訊揭露彙總資料-職業安全衛生
- `/t187ap46_O_9` — 上櫃公司企業ESG資訊揭露彙總資料-功能性委員會
- `/t187ap46_O_8` — 上櫃公司企業ESG資訊揭露彙總資料-氣候相關議題管理
- `/tpex_esb_disposal_information` — 興櫃處置有價證券資訊
- `/tpex_esb_warning_information` — 興櫃公布注意有價證券資訊
- `/tpex_esb_recommended_dealer` — 興櫃推薦證券商與推薦之股票
- `/tpex_warrant_gold` — 黃金現貨權證發行基本資料
- `/tpex_warrant_gold_quts` — 黃金現貨權證收盤行情
- `/tpex_warrant_daily_quts` — 上櫃權證收盤行情日報表
- `/tpex_warrant_monthly_quts` — 上櫃權證收盤行情月報表
- `/tpex_warrant_issue` — 上櫃權證發行基本資料
- `/tpex_warrant_wcb_daily_quts` — 上櫃牛熊證收盤行情(不含展延型牛熊證)日報表
- `/tpex_warrant_wcb_monthly_quts` — 上櫃牛熊證收盤行情(不含展延型牛熊證)月報表
- `/tpex_warrant_wcb_issue` — 上櫃牛熊證發行基本資料(不含展延型牛熊證)
- `/tpex_warrant_wxy_daily_quts` — 上櫃展延型牛熊證收盤行情日報表
- `/tpex_warrant_wxy_monthly_quts` — 上櫃展延型牛熊證收盤行情月報表
- `/tpex_warrant_wxy_issue` — 上櫃展延型牛熊證發行基本資料
- `/tpex_warrant_quts` — 單筆權證成交資料
- `/tpex_warrant_statistics` — 每日權證交易人數(上櫃)
- `/tpex_warrant` — 上櫃股票權證資訊
- `/tpex_warrant_suspend_today` — 上櫃權證當日暫停/恢復交易資訊
- `/tpex_warrant_suspend_history` — 上櫃權證歷史暫停/恢復交易資訊
- `/tpex_opfund_latest` — 開放式基金當日行情表
- `/tpex_opfund_recommended_dealer` — 開放式基金受益憑證造市商與造市之基金
- `/tpex_opfund_market_highlight` — 開放式基金市場現況
- `/tpex_gold_market_highlight` — 黃金現貨市場現況
- `/tpex_gold_recommended_dealer` — 造市商與造市之黃金現貨
- `/tpex_gold_latest` — 黃金現貨當日行情表
- `/tpex_gisa_highlight` — 創櫃板公司市場現況
- `/tpex_gisa_company` — 創櫃板公司資訊
- `/tpex_gisa_financing_before` — 於登錄創櫃板前辦理籌資資訊
- `/t187ap46_O_20` — 上櫃公司企業ESG資訊揭露彙總資料-反競爭行為法律訴訟 
- `/t187ap46_O_19` — 上櫃公司企業ESG資訊揭露彙總資料-風險管理政策 
- `/t187ap46_O_15` — 上櫃公司企業ESG資訊揭露彙總資料-社區關係 
- `/t187ap46_O_13` — 上櫃公司企業ESG資訊揭露彙總資料-供應鏈管理 
- `/t187ap46_O_12` — 上櫃公司企業ESG資訊揭露彙總資料-食品安全
- `/t187ap46_O_14` — 上櫃公司企業ESG資訊揭露彙總資料-產品品質與安全
- `/tpex200_constituents` — 櫃買「富櫃200指數」當日成分股
- `/t187ap41_O` — 上櫃公司召開股東常 (臨時) 會日期、地點及採用電子投票情形等資料彙總表
- `/t187ap05_R` — 興櫃公司每月營業收入彙總表
- `/t187ap46_O_4` — 上櫃公司企業ESG資訊揭露彙總資料-廢棄物管理
- `/t187ap46_O_2` — 上櫃公司企業ESG資訊揭露彙總資料-能源管理
- `/t187ap46_O_7` — 上櫃公司企業ESG資訊揭露彙總資料-投資人溝通
- `/t187ap46_O_1` — 上櫃公司企業ESG資訊揭露彙總資料-溫室氣體排放
- `/t187ap46_O_6` — 上櫃公司企業ESG資訊揭露彙總資料-董事會
- `/t187ap46_O_5` — 上櫃公司企業ESG資訊揭露彙總資料-人力發展
- `/t187ap46_O_3` — 上櫃公司企業ESG資訊揭露彙總資料-水資源管理
- `/mopsfin_t187ap05_OA` — 二十九大類股營收變化統計表
- `/mopsfin_t187ap05_OB` — 發行公司營收創新高一覽表(上櫃)
- `/BDdos216UTF` — 美元固定利率不可贖回國際債券理論價格
- `/BDdos215UTF` — 美元附息固定利率可贖回國際債券理論價格
- `/BDdos209UTF` — 美元零息可贖回國際債券理論價格
- `/tpex_gisa_financing_history` — 創櫃板公司透過籌資系統辦理籌資資訊
- `/mopsfin_t187ap35_O` — 上櫃公司股東行使提案權情形彙總表
- `/mopsfin_t187ap37_O` — 上櫃權證基本資料彙總表
- `/mopsfin_t187ap42_O` — 上櫃認購(售)權證每日成交資料檔
- `/mopsfin_t187ap32_O` — 上櫃公司公司治理之相關規程規則
- `/mopsfin_t187ap34_O` — 上櫃公司採累積投票制、全額連記法、候選人提名制選任董監事及當選資料彙總表
- `/mopsfin_t187ap33_O` — 上櫃公司董事長是否兼任總經理
- `/mopsfin_t187ap31_O` — 上櫃公司財務報告經監察人承認情形
- `/mopsfin_t187ap09_O` — 上櫃公司董事、監察人質權設定占董事及監察人實際持有股數彙總表
- `/mopsfin_t187ap10_O` — 上櫃公司董事、監察人持股不足法定成數連續達3個月以上彙總表
- `/mopsfin_t187ap24_O` — 上櫃公司經營權及營業範圍異(變)動專區-經營權異動公司
- `/mopsfin_t187ap25_O` — 上櫃公司經營權及營業範圍異(變)動專區-營業範圍重大變更公司
- `/tpex_gisa_financing_in_process` — 創櫃板辦理中籌資資訊
- `/mopsfin_t187ap03_O` — 上櫃股票基本資料
- `/tpex_3insti_qfii_trading` — 上櫃股票外資及陸資買賣超彙總表
- `/tpex_esb_latest_statistics` — 興櫃股票當日行情表
- `/mopsfin_t187ap36_O` — 上櫃認購(售)權證年度發行量概況統計表
- `/mopsfin_t187ap03_R` — 興櫃公司基本資料
- `/mopsfin_t187ap04_O` — 上櫃公司每日重大訊息
- `/mopsfin_t187ap01` — 券商業務別人員數
- `/mopsfin_t187ap02_O` — 上櫃公司持股逾 10% 大股東名單
- `/mopsfin_t187ap26_O` — 上櫃公司經營權及營業範圍異(變)動專區-經營權異動且營業範圍重大變更停止買賣公司
- `/mopsfin_t187ap27_O` — 上櫃公司經營權及營業範圍異(變)動專區-經營權異動且營業範圍重大變更列為變更交易公司
- `/mopsfin_t187ap05_O` — 上櫃公司每月營業收入彙總表
- `/mopsfin_t187ap39_O` — 上櫃股利分派情形-董事會通過
- `/bond_cb_daily` — 轉(交)換公司債買賣斷券商買賣日報表
- `/mopsfin_t187ap07_O_basi` — 上櫃公司資產負債表(金融業)
- `/mopsfin_t187ap07_O_bd` — 上櫃公司資產負債表(證券期貨業)
- `/mopsfin_t187ap07_O_ci` — 上櫃公司資產負債表(一般業)
- `/mopsfin_t187ap07_O_fh` — 上櫃公司資產負債表(金控業)
- `/mopsfin_t187ap07_O_ins` — 上櫃公司資產負債表(保險業)
- `/mopsfin_t187ap07_O_mim` — 上櫃公司資產負債表(異業)
- `/mopsfin_t187ap06_O_basi` — 上櫃公司綜合損益表(金融業)
- `/mopsfin_t187ap06_O_bd` — 上櫃公司綜合損益表(證券期貨業)
- `/mopsfin_t187ap06_O_ci` — 上櫃公司綜合損益表(一般業)
- `/mopsfin_t187ap06_O_fh` — 上櫃公司綜合損益表(金控業)
- `/mopsfin_t187ap06_O_ins` — 上櫃公司綜合損益表(保險業)
- `/mopsfin_t187ap06_O_mim` — 上櫃公司綜合損益表(異業)
- `/mopsfin_t187ap06_O_basiA` — 上櫃公司財報資訊(金融業)
- `/mopsfin_t187ap06_O_bdA` — 上櫃公司財報資訊(證券期貨業)
- `/mopsfin_t187ap06_O_ciA` — 上櫃公司財報資訊( 一般業)
- `/mopsfin_t187ap06_O_fhA` — 上櫃公司財報資訊(金控業)
- `/mopsfin_t187ap06_O_insA` — 上櫃公司財報資訊(保險業)
- `/mopsfin_t187ap06_O_mimA` — 上櫃公司財報資訊(異業)
- `/mopsfin_t187ap07_U_bd` — 興櫃公司資產負債表-證券期貨業
- `/mopsfin_t187ap07_U_ci` — 興櫃公司資產負債表-一般業
- `/mopsfin_t187ap07_U_fh` — 興櫃公司資產負債表-金控業
- `/mopsfin_t187ap07_U_ins` — 興櫃公司資產負債表-保險業
- `/mopsfin_t187ap07_U_mim` — 興櫃公司資產負債表-異業
- `/mopsfin_t187ap06_U_basi` — 興櫃公司綜合損益表-金融業
- `/mopsfin_t187ap06_U_bd` — 興櫃公司綜合損益表-證券期貨業
- `/mopsfin_t187ap06_U_ci` — 興櫃公司綜合損益表-一般業
- `/mopsfin_t187ap06_U_fh` — 興櫃公司綜合損益表-金控業
- `/mopsfin_t187ap06_U_ins` — 興櫃公司綜合損益表-保險業
- `/mopsfin_t187ap06_U_mim` — 興櫃公司綜合損益表-異業
- `/mopsfin_t187ap07_U_basi` — 興櫃公司資產負債表-金融業
- `/mopsfin_t187ap11_R` — 興櫃公司董監事持股餘額明細資料
- `/mopsfin_t187ap14_O` — 上櫃公司各產業EPS統計資訊
- `/mopsfin_t187ap15_O` — 上櫃公司截至各季綜合損益財測達成情形(簡式)
- `/mopsfin_t187ap16_O` — 上櫃公司當季綜合損益經會計師查核(核閱)數與當季預測數差異達百分之十以上者，或截至當季累計差異達百分之二十以上者(簡式)
- `/mopsfin_187ap17_O` — 上櫃公司營益分析查詢彙總表(全體公司彙總報表)
- `/mopsfin_t187ap08_O` — 上櫃公司董事、監察人持股不足法定成數彙總表
- `/mopsfin_t187ap11_O` — 上櫃公司董監事持股餘額明細資料
- `/mopsfin_t187ap12_O` — 上櫃公司每日內部人持股轉讓事前申報表-持股轉讓日報表
- `/mopsfin_t187ap13_O` — 上櫃公司每日內部人持股轉讓事前申報表-持股未轉讓日報表
- `/mopsfin_t187ap22_O` — 上櫃公司金管會證券期貨局裁罰案件專區
- `/mopsfin_t187ap30_O` — 上櫃公司獨立董監事兼任情形彙總表
- `/mopsfin_t187ap29_A_O` — 上櫃公司董事酬金相關資訊
- `/mopsfin_t187ap29_B_O` — 上櫃公司監察人酬金相關資訊
- `/mopsfin_t187ap29_C_O` — 上櫃公司合併報表董事酬金相關資訊
- `/mopsfin_t187ap29_D_O` — 上櫃公司合併報表監察人酬金相關資訊
- `/mopsfin_t187ap23_O` — 上櫃公司違反資訊申報、重大訊息及說明記者會規定專區
- `/mopsfin_t187ap19_O` — 電子式交易統計資訊(上櫃)
- `/tpex_esb_highlight` — 興櫃股票市場現況
- `/bond_ISSBD1_data` — 公債發行資料下載
- `/bond_ISSBD2_data` — 外國金融債發行資料下載
- `/bond_ISSBD3_data` — 金融債發行資料下載
- `/bond_ISSBD4_data` — 普通債發行資料下載
- `/bond_ISSBD5_data` — 轉(交)換債發行資料下載
- `/bond_ISSBD6_data` — 海外轉換債發行資料下載
- `/bond_ISSBD7_data` — 附認股權公司債發行資料下載
- `/bond_ISSBD8_data` — 海外附認股權公司債發行資料下載
- `/bond_ISSBD9_data` — 海外普通債發行資料下載
- `/bond_ISSBD10_data` — 國際債券(寶島債券)-本國發行人及第一、二上市(櫃)公司之外國發行人發行資料下載
- `/bond_ISSBD11_data` — 國際債券(寶島債券)-外國發行人(在我國未公開發行股權商品者)發行資料下載
- `/tpex_daily_broker2` — 上櫃股票各券商總公司當日營業金額統計表
- `/tphd_index` — 高殖利率指數歷史收盤指數

</details>

## 3. 實際回傳的欄位

### ✅ `https://www.tpex.org.tw/openapi/v1/tpex_mainboard_peratio_analysis`
筆數：**886**

欄位：`Date`, `SecuritiesCompanyCode`, `CompanyName`, `PriceEarningRatio`, `DividendPerShare`, `YieldRatio`, `PriceBookRatio`

前 2 筆：

```json
[{"Date":"1150907","SecuritiesCompanyCode":"1240","CompanyName":"茂生農經","PriceEarningRatio":"10.28","DividendPerShare":"0.50000000","YieldRatio":"0.90","PriceBookRatio":"1.63"},{"Date":"1150907","SecuritiesCompanyCode":"1259","CompanyName":"安心","PriceEarningRatio":"17.77","DividendPerShare":"1.20000000","YieldRatio":"1.91","PriceBookRatio":"0.73"}]
```

包含的指標代號：（都沒有）
看起來像 ETF 代號的筆數（第一欄符合 00xxx 格式）：0

### ✅ `https://www.tpex.org.tw/openapi/v1/tpex_dpsp_monthly_CBmcs007`
筆數：**16**

欄位：`Date`, `FinancialInstitutionsCode`, `FinancialInstitutionsName`, `ASWFixedIncomeOutstanding`, `ASOOptionOutstanding`, `TotalOutstanding`

前 2 筆：

```json
[{"Date":"1150901","FinancialInstitutionsCode":"102T","FinancialInstitutionsName":"合作金庫證券公司","ASWFixedIncomeOutstanding":"96000","ASOOptionOutstanding":"0","TotalOutstanding":"96000"},{"Date":"1150901","FinancialInstitutionsCode":"218T","FinancialInstitutionsName":"亞東證券公司","ASWFixedIncomeOutstanding":"140700","ASOOptionOutstanding":"0","TotalOutstanding":"140700"}]
```

包含的指標代號：（都沒有）
看起來像 ETF 代號的筆數（第一欄符合 00xxx 格式）：0

### ✅ `https://www.tpex.org.tw/openapi/v1/tpex_international_bond_quotes`
筆數：**21**

欄位：`Date`, `Time`, `BondCode`, `BondName`, `BidYieldPrice`, `AskYieldPrice`

前 2 筆：

```json
[{"Date":"20260908","Time":"140005","BondCode":"F00922","BondName":"P21BNP2","BidYieldPrice":"099.5000","AskYieldPrice":"099.8000"},{"Date":"20260908","Time":"140005","BondCode":"F00923","BondName":"P21BNP3","BidYieldPrice":"099.5000","AskYieldPrice":"099.8000"}]
```

包含的指標代號：（都沒有）
看起來像 ETF 代號的筆數（第一欄符合 00xxx 格式）：0

### ✅ `https://www.tpex.org.tw/openapi/v1/tpex_international_bond_trade`
筆數：**1**

欄位：`Date`, `Time`, `BondCode`, `BondName`, `LastField`, `Change`, `Highest`, `Lowest`, `Volume`, `LastClose`

前 2 筆：

```json
[{"Date":"20260908","Time":"140003","BondCode":"","BondName":"","LastField":"","Change":"","Highest":"","Lowest":"","Volume":"","LastClose":""}]
```

包含的指標代號：（都沒有）
看起來像 ETF 代號的筆數（第一欄符合 00xxx 格式）：0

### ✅ `https://www.tpex.org.tw/openapi/v1/tpex_international_bond_issue_investor`
筆數：**7**

欄位：`Date`, `BondCode`, `ShortName`, `Issuer`, `IssuingDate`, `MaturityDate`, `Tenor`, `CurrencyDenomination`, `AmountOfIssuance`, `Coupon`, `IRR`, `EarlyRedemption`, `NonCallPeriodYearxCallFrequencyYear`, `SecuritiesUnderwriterOrFinancialConsultingCompany`, `LiquidityProvider`, `ISIN`, `BondDatabase`

前 2 筆：

```json
[{"Date":"20260908","BondCode":"F02273","ShortName":"22SG8","Issuer":"Societe Generale","IssuingDate":"20220920","MaturityDate":"20270920","Tenor":"5","CurrencyDenomination":"AUD","AmountOfIssuance":"4000000","Coupon":"5.000","IRR":"0","EarlyRedemption":"Not Applicable","NonCallPeriodYearxCallFrequencyYear":"Not Applicable","SecuritiesUnderwriterOrFinancialConsultingCompany":"E.SUN BankSinoPac Securities","LiquidityProvider":"SinoPac Securities","ISIN":"XS2347721396","BondDatabase":"https://mopsov.twse.com.tw/mops/web/t113sb02?encodeURIComponent=1&firstin=true&id=&colorchg=&TYPEK=all&step=11&co_id=E0010&MONYR_REG=202209&BOND_ID=F02273&KIND=A"},{"Date":"20260908","BondCode":"F02276","ShortName":"22SG11","Issuer":"Societe Generale","IssuingDate":"20221219","MaturityDate":"20281219","Tenor":"6","CurrencyDenomination":"USD","AmountOfIssuance":"668000","Coupon":"0","IRR":"3.44","EarlyRedempti
```

包含的指標代號：（都沒有）
看起來像 ETF 代號的筆數（第一欄符合 00xxx 格式）：0

### ✅ `https://www.tpex.org.tw/openapi/v1/tpex_international_bond_issue_org`
筆數：**931**

欄位：`Date`, `BondCode`, `ShortName`, `Issuer`, `IssuingDate`, `MaturityDate`, `Tenor`, `CurrencyDenomination`, `AmountOfIssuance`, `Coupon`, `IRR`, `EarlyRedemption`, `NonCallPeriodYearxCallFrequencyYear`, `SecuritiesUnderwriterOrFinancialConsultingCompany`, `LiquidityProvider`, `ISIN`, `BondDatabase`

前 2 筆：

```json
[{"Date":"20260908","BondCode":"F17901","ShortName":"P21BCI1","Issuer":"Banco de Credito e Inversiones","IssuingDate":"20210924","MaturityDate":"20260924","Tenor":"5","CurrencyDenomination":"USD","AmountOfIssuance":"133000000","Coupon":"1.885","IRR":"0","EarlyRedemption":"Not Applicable","NonCallPeriodYearxCallFrequencyYear":"Not Applicable","SecuritiesUnderwriterOrFinancialConsultingCompany":"Bank of TaiwanCACIB TaipeiSinoPac SecuritiesStandard CharteredTaipei Fubon BankTaishin Internatonal","LiquidityProvider":"Taipei Fubon Bank","ISIN":"XS2384719667","BondDatabase":"https://mopsov.twse.com.tw/mops/web/t113sb02?encodeURIComponent=1&firstin=true&id=&colorchg=&TYPEK=all&step=11&co_id=E0147&MONYR_REG=202109&BOND_ID=F17901&KIND=A"},{"Date":"20260908","BondCode":"F02244","ShortName":"P19SG5","Issuer":"Societe Generale","IssuingDate":"20191002","MaturityDate":"20261002","Tenor":"7","Currency
```

包含的指標代號：（都沒有）
看起來像 ETF 代號的筆數（第一欄符合 00xxx 格式）：0

### ✅ `https://www.tpex.org.tw/openapi/v1/tpex_opfund_latest`
筆數：**3**

欄位：`Date`, `Time`, `SecurityCode`, `ListedOpenEndedFund`, `PreNAV`, `EstimatedNAV`, `Pre Avg.`, `B.Price`, `B.Qty.`, `S.Price`, `S.Qty.`, `Highest`, `Lowest`, `Avg.`, `LatestPrice`, `Type`, `Volume`

前 2 筆：

```json
[{"Date":"1150908","Time":"140004","SecurityCode":"T1001Y","ListedOpenEndedFund":"富邦FB","PreNAV":"52.3","EstimatedNAV":"https://www.fubon.com/asset-management/Home/EmergingStockAdvert","Pre Avg.":"51.3","B.Price":"49.59","B.Qty.":"2000","S.Price":"52.2","S.Qty.":"2000","Highest":"-","Lowest":"-","Avg.":"-","LatestPrice":"-","Type":"","Volume":"-"},{"Date":"1150908","Time":"140004","SecurityCode":"T1010Y","ListedOpenEndedFund":"精銳FB","PreNAV":"113.24","EstimatedNAV":"https://www.fubon.com/asset-management/Home/EmergingStockAdvert","Pre Avg.":"110.2","B.Price":"107.35","B.Qty.":"2000","S.Price":"113","S.Qty.":"2000","Highest":"-","Lowest":"-","Avg.":"-","LatestPrice":"-","Type":"","Volume":"-"}]
```

包含的指標代號：（都沒有）
看起來像 ETF 代號的筆數（第一欄符合 00xxx 格式）：0

### ✅ `https://www.tpex.org.tw/openapi/v1/tpex_opfund_recommended_dealer`
筆數：**3**

欄位：`Date`, `SecurityCode`, `SecurityName`, `No.`, `MarketMakerCode`, `MarketMakerName`, `AddDate`, `Contact`, `Telephone`, `Address`

前 2 筆：

```json
[{"Date":"1150908","SecurityCode":"T1001Y","SecurityName":"富邦FB","No.":"1","MarketMakerCode":"960T","MarketMakerName":"富邦自營","AddDate":"1031027","Contact":"張小姐","Telephone":"(02)27317501","Address":"台北市仁愛路四段169號15樓(部份)"},{"Date":"1150908","SecurityCode":"T1010Y","SecurityName":"精銳FB","No.":"1","MarketMakerCode":"960T","MarketMakerName":"富邦自營","AddDate":"1031027","Contact":"張小姐","Telephone":"(02)27317501","Address":"台北市仁愛路四段169號15樓(部份)"}]
```

包含的指標代號：（都沒有）
看起來像 ETF 代號的筆數（第一欄符合 00xxx 格式）：0

### ✅ `https://www.tpex.org.tw/openapi/v1/tpex_opfund_market_highlight`
筆數：**1**

欄位：`Date`, `NumberOfFunds`, `TotalTradingAmount`, `TotalTradingVolume`, `TotalNumberOfTransactions`, `NumberOfMarketMakers`, `TotalNumberOfPositionsRecommended`, `AverageNumberOfFundsPerMarketMaker`, `AverageNumberOfMarketMakersPerFund`, `NumberOfIncrease`, `NumberOfDecrease`, `NumberOfUnchanged`, `NumberOfIncompleteIincludingSuspended`

前 2 筆：

```json
[{"Date":"1150907","NumberOfFunds":"3","TotalTradingAmount":"0","TotalTradingVolume":"0","TotalNumberOfTransactions":"0","NumberOfMarketMakers":"1","TotalNumberOfPositionsRecommended":"3","AverageNumberOfFundsPerMarketMaker":"3.00","AverageNumberOfMarketMakersPerFund":"1.00","NumberOfIncrease":"0","NumberOfDecrease":"0","NumberOfUnchanged":"0","NumberOfIncompleteIincludingSuspended":"3"}]
```

包含的指標代號：（都沒有）
看起來像 ETF 代號的筆數（第一欄符合 00xxx 格式）：0

### ✅ `https://www.tpex.org.tw/openapi/v1/BDdos216UTF`
筆數：**24**

欄位：`資料日期`, `債券代碼`, `債券簡稱`, `發行人`, `發行日`, `到期日`, `信用評等`, `利率`, `理論價格含息`, `應計利息`, `除息價格`

前 2 筆：

```json
[{"資料日期":"20260907","債券代碼":"F00226","債券簡稱":"P22CABEI1","發行人":"Central American Bank for Economic Integration","發行日":"20221129","到期日":"20321129","信用評等":"AA+","利率":"5.229","理論價格含息":"107.421996","應計利息":"4.03994","除息價格":"103.382056"},{"資料日期":"20260907","債券代碼":"F07502","債券簡稱":"P16ISBI1","發行人":"Intesa Sanpaolo Bank Ireland p.l.c","發行日":"20160115","到期日":"20280115","信用評等":"BBB+","利率":"4.25","理論價格含息":"100.273852","應計利息":".613889","除息價格":"99.659963"}]
```

包含的指標代號：（都沒有）
看起來像 ETF 代號的筆數（第一欄符合 00xxx 格式）：0

### ✅ `https://www.tpex.org.tw/openapi/v1/BDdos215UTF`
筆數：**133**

欄位：`資料日期`, `債券代碼`, `債券簡稱`, `發行人`, `發行日`, `到期日`, `信用評等`, `利率`, `贖回期間結構`, `公平價格含隱含息`, `隱含應計利息`, `扣除隱含息價格`

前 2 筆：

```json
[{"資料日期":"20260907","債券代碼":"F00811","債券簡稱":"P21DB6","發行人":"Deutsche Bank Aktiengesellschaft","發行日":"20211007","到期日":"20361007","信用評等":"A","利率":"2.53","贖回期間結構":"3.000 x 1.000","公平價格含隱含息":"81.46198","隱含應計利息":"2.335918","扣除隱含息價格":"79.126062"},{"資料日期":"20260907","債券代碼":"F00817","債券簡稱":"P22DB5","發行人":"Deutsche Bank Aktiengesellschaft","發行日":"20220310","到期日":"20290310","信用評等":"A","利率":"2.97","贖回期間結構":"1.000 x 1.000","公平價格含隱含息":"97.875016","隱含應計利息":"1.489068","扣除隱含息價格":"96.385947"}]
```

包含的指標代號：（都沒有）
看起來像 ETF 代號的筆數（第一欄符合 00xxx 格式）：0

### ✅ `https://www.tpex.org.tw/openapi/v1/BDdos209UTF`
筆數：**277**

欄位：`資料日期`, `債券代碼`, `債券簡稱`, `發行人`, `發行日`, `到期日`, `信用評等`, `隱含利率%`, `贖回期間結構`, `理論價格`, `隱含應計利息`, `扣除隱含息價格`

前 2 筆：

```json
[{"資料日期":"20260907","債券代碼":"F00807","債券簡稱":"P21DB2","發行人":"Deutsche Bank Aktiengesellschaft","發行日":"20210226","到期日":"20510226","信用評等":"A","隱含利率%":"3.475","贖回期間結構":"5.00 x 1.00","理論價格":"65.632052","隱含應計利息":"20.794789","扣除隱含息價格":"44.837263"},{"資料日期":"20260907","債券代碼":"F00814","債券簡稱":"P22DB2","發行人":"Deutsche Bank Aktiengesellschaft","發行日":"20220127","到期日":"20370127","信用評等":"A","隱含利率%":"3.05","贖回期間結構":"1.00 x 1.00","理論價格":"91.900683","隱含應計利息":"14.859193","扣除隱含息價格":"77.04149"}]
```

包含的指標代號：（都沒有）
看起來像 ETF 代號的筆數（第一欄符合 00xxx 格式）：0

### ✅ `https://www.tpex.org.tw/openapi/v1/bond_cb_daily`
筆數：**1**

欄位：`Date`, `FinancialInstitutionsCode`, `FinancialInstitutionsName`, `ParValueOfPurchase`, `AmountOfPurchase`, `ParValueOfSell`, `AmountOfSell`

前 2 筆：

```json
[{"Date":"20260908","FinancialInstitutionsCode":null,"FinancialInstitutionsName":null,"ParValueOfPurchase":null,"AmountOfPurchase":null,"ParValueOfSell":null,"AmountOfSell":null}]
```

包含的指標代號：（都沒有）
看起來像 ETF 代號的筆數（第一欄符合 00xxx 格式）：0

### ✅ `https://www.tpex.org.tw/openapi/v1/bond_ISSBD1_data`
筆數：**197**

欄位：`Date`, `IssuerCode`, `IssuerName`, `BondCode`, `BondType`, `SeriesNumber`, `TrancheNumber`, `IssueDate`, `MaturityDate`, `IssueAmount`, `OutstandingAmount`, `CouponRate`, `InterestBasis`, `CouponFrequency`, `PaidFrequency`, `BondRatingAgency`, `BondRating`, `IssuerRatingAgency`, `IssuerRating`, `GuarantorRatingAgency`, `GuarantorRating`, `ListingCountry`, `PrincipalRepayment`, `PrincipalRepaymentDescription`, `ShortName`, `ListingDate`, `TenorYear`, `TenorMonth`, `ListingStatus`, `Guaranteed`, `GuaranteeDescription`, `PutOptionDate`, `PutOptionPrice`, `Underwriter`, `OutstandingChangeDate`, `OutstandingChangeDescription`, `Currency`, `OfferingMethod`, `Conversion/ExchangePriceAtIssuance`, `Conversion/ExchangePeriodStartDate`, `Conversion/ExchangePeriodEndDate`, `Trustee`

前 2 筆：

```json
[{"Date":"20260908","IssuerCode":"G001","IssuerName":"中央政府","BondCode":"A90105","BondType":"1","SeriesNumber":"90-5","TrancheNumber":"甲A","IssueDate":"20010717","MaturityDate":"20310717","IssueAmount":"40000000000","OutstandingAmount":"40000000000","CouponRate":"3.625000","InterestBasis":"1","CouponFrequency":"1","PaidFrequency":"1","BondRatingAgency":"","BondRating":"","IssuerRatingAgency":"","IssuerRating":"","GuarantorRatingAgency":"","GuarantorRating":"","ListingCountry":"1","PrincipalRepayment":"1","PrincipalRepaymentDescription":"","ShortName":"90央債甲5","ListingDate":"20010717","TenorYear":"30","TenorMonth":"0","ListingStatus":"6","Guaranteed":"0","GuaranteeDescription":"","PutOptionDate":"","PutOptionPrice":"0.0000","Underwriter":"","OutstandingChangeDate":"","OutstandingChangeDescription":"","Currency":"1","OfferingMethod":"0","Conversion/ExchangePriceAtIssuance":"0.0000","Convers
```

包含的指標代號：（都沒有）
看起來像 ETF 代號的筆數（第一欄符合 00xxx 格式）：0

### ✅ `https://www.tpex.org.tw/openapi/v1/bond_ISSBD2_data`
筆數：**1**

欄位：`Date`, `IssuerCode`, `IssuerName`, `BondCode`, `BondType`, `SeriesNumber`, `TrancheNumber`, `IssueDate`, `MaturityDate`, `IssueAmount`, `OutstandingAmount`, `CouponRate`, `InterestBasis`, `CouponFrequency`, `PaidFrequency`, `BondRatingAgency`, `BondRating`, `IssuerRatingAgency`, `IssuerRating`, `GuarantorRatingAgency`, `GuarantorRating`, `ListingCountry`, `PrincipalRepayment`, `PrincipalRepaymentDescription`, `ShortName`, `ListingDate`, `TenorYear`, `TenorMonth`, `ListingStatus`, `Guaranteed`, `GuaranteeDescription`, `PutOptionDate`, `PutOptionPrice`, `Underwriter`, `OutstandingChangeDate`, `OutstandingChangeDescription`, `Currency`, `OfferingMethod`, `Conversion/ExchangePriceAtIssuance`, `Conversion/ExchangePeriodStartDate`, `Conversion/ExchangePeriodEndDate`, `Trustee`

前 2 筆：

```json
[{"Date":"20260908","IssuerCode":"","IssuerName":"","BondCode":"","BondType":"","SeriesNumber":"","TrancheNumber":"","IssueDate":"","MaturityDate":"","IssueAmount":"","OutstandingAmount":"","CouponRate":"","InterestBasis":"","CouponFrequency":"","PaidFrequency":"","BondRatingAgency":"","BondRating":"","IssuerRatingAgency":"","IssuerRating":"","GuarantorRatingAgency":"","GuarantorRating":"","ListingCountry":"","PrincipalRepayment":"","PrincipalRepaymentDescription":"","ShortName":"","ListingDate":"","TenorYear":"","TenorMonth":"","ListingStatus":"","Guaranteed":"","GuaranteeDescription":"","PutOptionDate":"","PutOptionPrice":"","Underwriter":"","OutstandingChangeDate":"","OutstandingChangeDescription":"","Currency":"","OfferingMethod":"","Conversion/ExchangePriceAtIssuance":"","Conversion/ExchangePeriodStartDate":"","Conversion/ExchangePeriodEndDate":"","Trustee":""}]
```

包含的指標代號：（都沒有）
看起來像 ETF 代號的筆數（第一欄符合 00xxx 格式）：0

### ✅ `https://www.tpex.org.tw/openapi/v1/bond_ISSBD3_data`
筆數：**443**

欄位：`Date`, `IssuerCode`, `IssuerName`, `BondCode`, `BondType`, `SeriesNumber`, `TrancheNumber`, `IssueDate`, `MaturityDate`, `IssueAmount`, `OutstandingAmount`, `CouponRate`, `InterestBasis`, `CouponFrequency`, `PaidFrequency`, `BondRatingAgency`, `BondRating`, `IssuerRatingAgency`, `IssuerRating`, `GuarantorRatingAgency`, `GuarantorRating`, `ListingCountry`, `PrincipalRepayment`, `PrincipalRepaymentDescription`, `ShortName`, `ListingDate`, `TenorYear`, `TenorMonth`, `ListingStatus`, `Guaranteed`, `GuaranteeDescription`, `PutOptionDate`, `PutOptionPrice`, `Underwriter`, `OutstandingChangeDate`, `OutstandingChangeDescription`, `Currency`, `OfferingMethod`, `Conversion/ExchangePriceAtIssuance`, `Conversion/ExchangePeriodStartDate`, `Conversion/ExchangePeriodEndDate`, `Trustee`

前 2 筆：

```json
[{"Date":"20260908","IssuerCode":"000024","IssuerName":"東方匯理","BondCode":"G14003","BondType":"3","SeriesNumber":"110-1","TrancheNumber":"","IssueDate":"20210510","MaturityDate":"20280510","IssueAmount":"1700000000","OutstandingAmount":"1700000000","CouponRate":"0.520000","InterestBasis":"1","CouponFrequency":"1","PaidFrequency":"1","BondRatingAgency":"","BondRating":"","IssuerRatingAgency":"穆迪(Moody's)","IssuerRating":"A1","GuarantorRatingAgency":"","GuarantorRating":"","ListingCountry":"1","PrincipalRepayment":"1","PrincipalRepaymentDescription":"","ShortName":"P10匯理1","ListingDate":"20210510","TenorYear":"7","TenorMonth":"0","ListingStatus":"2","Guaranteed":"2","GuaranteeDescription":"","PutOptionDate":"","PutOptionPrice":"0.0000","Underwriter":"980T元大證券","OutstandingChangeDate":"","OutstandingChangeDescription":"","Currency":"1","OfferingMethod":"8","Conversion/ExchangePriceAtIssuance
```

包含的指標代號：（都沒有）
看起來像 ETF 代號的筆數（第一欄符合 00xxx 格式）：0

### ❌ `https://www.tpex.org.tw/openapi/v1/bond_ISSBD4_data`
HTTP 0

### ❌ `https://www.tpex.org.tw/openapi/v1/bond_ISSBD5_data`
HTTP 520

### ✅ `https://www.tpex.org.tw/openapi/v1/bond_ISSBD6_data`
筆數：**25**

欄位：`Date`, `IssuerCode`, `IssuerName`, `BondCode`, `BondType`, `SeriesNumber`, `TrancheNumber`, `IssueDate`, `MaturityDate`, `IssueAmount`, `OutstandingAmount`, `CouponRate`, `InterestBasis`, `CouponFrequency`, `PaidFrequency`, `BondRatingAgency`, `BondRating`, `IssuerRatingAgency`, `IssuerRating`, `GuarantorRatingAgency`, `GuarantorRating`, `ListingCountry`, `PrincipalRepayment`, `PrincipalRepaymentDescription`, `ShortName`, `ListingDate`, `TenorYear`, `TenorMonth`, `ListingStatus`, `Guaranteed`, `GuaranteeDescription`, `PutOptionDate`, `PutOptionPrice`, `Underwriter`, `OutstandingChangeDate`, `OutstandingChangeDescription`, `Currency`, `OfferingMethod`, `Conversion/ExchangePriceAtIssuance`, `Conversion/ExchangePeriodStartDate`, `Conversion/ExchangePeriodEndDate`, `Trustee`

前 2 筆：

```json
[{"Date":"20260908","IssuerCode":"1101","IssuerName":"台泥","BondCode":"XS2708323857","BondType":"6","SeriesNumber":"112","TrancheNumber":"1","IssueDate":"20231024","MaturityDate":"20281024","IssueAmount":"420000000","OutstandingAmount":"420000000","CouponRate":"0.000000","InterestBasis":"","CouponFrequency":"0","PaidFrequency":"0","BondRatingAgency":"","BondRating":"","IssuerRatingAgency":"","IssuerRating":"","GuarantorRatingAgency":"","GuarantorRating":"","ListingCountry":"5","PrincipalRepayment":"1","PrincipalRepaymentDescription":"","ShortName":"TWCCB28","ListingDate":"20231025","TenorYear":"5","TenorMonth":"0","ListingStatus":"4","Guaranteed":"2","GuaranteeDescription":"","PutOptionDate":"20261024","PutOptionPrice":"108.2200","Underwriter":"023T花旗證券","OutstandingChangeDate":"","OutstandingChangeDescription":"","Currency":"2","OfferingMethod":"1","Conversion/ExchangePriceAtIssuance":"3
```

包含的指標代號：（都沒有）
看起來像 ETF 代號的筆數（第一欄符合 00xxx 格式）：0

### ❌ `https://www.tpex.org.tw/openapi/v1/bond_ISSBD7_data`
HTTP 520

### ✅ `https://www.tpex.org.tw/openapi/v1/bond_ISSBD8_data`
筆數：**1**

欄位：`Date`, `IssuerCode`, `IssuerName`, `BondCode`, `BondType`, `SeriesNumber`, `TrancheNumber`, `IssueDate`, `MaturityDate`, `IssueAmount`, `OutstandingAmount`, `CouponRate`, `InterestBasis`, `CouponFrequency`, `PaidFrequency`, `BondRatingAgency`, `BondRating`, `IssuerRatingAgency`, `IssuerRating`, `GuarantorRatingAgency`, `GuarantorRating`, `ListingCountry`, `PrincipalRepayment`, `PrincipalRepaymentDescription`, `ShortName`, `ListingDate`, `TenorYear`, `TenorMonth`, `ListingStatus`, `Guaranteed`, `GuaranteeDescription`, `PutOptionDate`, `PutOptionPrice`, `Underwriter`, `OutstandingChangeDate`, `OutstandingChangeDescription`, `Currency`, `OfferingMethod`, `Conversion/ExchangePriceAtIssuance`, `Conversion/ExchangePeriodStartDate`, `Conversion/ExchangePeriodEndDate`, `Trustee`

前 2 筆：

```json
[{"Date":"20260908","IssuerCode":"","IssuerName":"","BondCode":"","BondType":"","SeriesNumber":"","TrancheNumber":"","IssueDate":"","MaturityDate":"","IssueAmount":"","OutstandingAmount":"","CouponRate":"","InterestBasis":"","CouponFrequency":"","PaidFrequency":"","BondRatingAgency":"","BondRating":"","IssuerRatingAgency":"","IssuerRating":"","GuarantorRatingAgency":"","GuarantorRating":"","ListingCountry":"","PrincipalRepayment":"","PrincipalRepaymentDescription":"","ShortName":"","ListingDate":"","TenorYear":"","TenorMonth":"","ListingStatus":"","Guaranteed":"","GuaranteeDescription":"","PutOptionDate":"","PutOptionPrice":"","Underwriter":"","OutstandingChangeDate":"","OutstandingChangeDescription":"","Currency":"","OfferingMethod":"","Conversion/ExchangePriceAtIssuance":"","Conversion/ExchangePeriodStartDate":"","Conversion/ExchangePeriodEndDate":"","Trustee":""}]
```

包含的指標代號：（都沒有）
看起來像 ETF 代號的筆數（第一欄符合 00xxx 格式）：0

### ❌ `https://www.tpex.org.tw/openapi/v1/bond_ISSBD9_data`
HTTP 520

### ✅ `https://www.tpex.org.tw/openapi/v1/bond_ISSBD10_data`
筆數：**223**

欄位：`Date`, `IssuerCode`, `IssuerName`, `BondCode`, `BondType`, `SeriesNumber`, `TrancheNumber`, `IssueDate`, `MaturityDate`, `IssueAmount`, `OutstandingAmount`, `CouponRate`, `InterestBasis`, `CouponFrequency`, `PaidFrequency`, `BondRatingAgency`, `BondRating`, `IssuerRatingAgency`, `IssuerRating`, `GuarantorRatingAgency`, `GuarantorRating`, `ListingCountry`, `PrincipalRepayment`, `PrincipalRepaymentDescription`, `ShortName`, `ListingDate`, `TenorYear`, `TenorMonth`, `ListingStatus`, `Guaranteed`, `GuaranteeDescription`, `PutOptionDate`, `PutOptionPrice`, `Underwriter`, `OutstandingChangeDate`, `OutstandingChangeDescription`, `Currency`, `OfferingMethod`, `Conversion/ExchangePriceAtIssuance`, `Conversion/ExchangePeriodStartDate`, `Conversion/ExchangePeriodEndDate`, `Trustee`

前 2 筆：

```json
[{"Date":"20260908","IssuerCode":"2330","IssuerName":"台積電","BondCode":"F16801","BondType":"4","SeriesNumber":"109-1","TrancheNumber":"","IssueDate":"20200922","MaturityDate":"20600922","IssueAmount":"1000000000","OutstandingAmount":"1000000000","CouponRate":"2.700000","InterestBasis":"1","CouponFrequency":"1","PaidFrequency":"1","BondRatingAgency":"","BondRating":"","IssuerRatingAgency":"中華信評","IssuerRating":"twAAA","GuarantorRatingAgency":"","GuarantorRating":"","ListingCountry":"1","PrincipalRepayment":"2","PrincipalRepaymentDescription":"發行期間為40年，到期一次還本；惟本公司有提前贖回權，詳細內容請參閱發行辦法。","ShortName":"P20TSMC1","ListingDate":"20200922","TenorYear":"40","TenorMonth":"0","ListingStatus":"2","Guaranteed":"2","GuaranteeDescription":"","PutOptionDate":"20600922","PutOptionPrice":"0.0000","Underwriter":"920T凱基證券","OutstandingChangeDate":"","OutstandingChangeDescription":"","Currency":"2","OfferingMeth
```

包含的指標代號：（都沒有）
看起來像 ETF 代號的筆數（第一欄符合 00xxx 格式）：0

### ✅ `https://www.tpex.org.tw/openapi/v1/bond_ISSBD11_data`
筆數：**1**

欄位：`Date`, `IssuerCode`, `IssuerName`, `BondCode`, `BondName`, `ShortName`, `BondType`, `IssueDate`, `MaturityDate`, `ListingDate`, `Denomination`, `Volume`, `IssueAmount`, `OutstandingAmount`, `Coupon`, `Currency`, `CreditRating`, `BookRuningManager`, `Note`, `ListedOnTPEx`

前 2 筆：

```json
[{"Date":"20260908","IssuerCode":"E0075","IssuerName":"BNS","BondCode":"F09934","BondName":"The Bank of Nova Scotia USD 30,000,000 Callable Floating Rate Notes due January 18, 2033","ShortName":"P23BNS1","BondType":"普通公司債(金融債券)","IssueDate":"20230118","MaturityDate":"20330118","ListingDate":"20230118","Denomination":"1000000","Volume":"30","IssueAmount":"30000000","OutstandingAmount":"30000000","Coupon":"0.0000","Currency":"1","CreditRating":"","BookRuningManager":"N.A.","Note":"Liquidity Provider: KGI Securities, Allen Chu 02-2181-8878","ListedOnTPEx":"Y"}]
```

包含的指標代號：（都沒有）
看起來像 ETF 代號的筆數（第一欄符合 00xxx 格式）：0

### ❌ `https://www.tpex.org.tw/openapi/v1/tpex_mainboard_daily_close_quotes`
HTTP 0

## 4. 網站用的舊式 JSON（備援路徑）

- `https://www.tpex.org.tw/www/zh-tw/bond/bondEtf` → HTTP 200，長度 9798
- `https://www.tpex.org.tw/web/etf/etf_specification_bond.php?l=zh-tw` → HTTP 200，長度 9798
- `https://www.tpex.org.tw/zh-tw/etf/bond.html` → HTTP 200，長度 9798

---

探測結束。這支腳本不會修改 `data/etfs.json`。
