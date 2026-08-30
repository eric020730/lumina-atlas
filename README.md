# 微光研習所 LUMINA ATLAS

個人的台灣醫美課程、法規與臨床知識學習索引。

網站：<https://eric020730.com/beauty/>

## 功能

- 醫美法規與學會消息重點整理
- 放射診斷科專科醫師資格掃描與個人合規待辦追蹤
- 法規關鍵期限倒數、官方版本時間軸與瀏覽器端進度保存
- 每週自動搜尋並更新課程期限、時數、費用、資格與查核來源
- 由課程 JSON 自動生成的學分課程橫向時間軸、今日位置與下一站提醒
- 依皮膚科住院醫師訓練基準重排的動態門診課程，會依病例作答、先修證據與複習日期產生今日課表
- 十五個高影響門診單元、病例判斷、危險徵象、督導界線與官方六大學習護照領域
- 六週零基礎 YouTube 學習路徑、主題篩選、逐堂進度與個人影片筆記
- 法規、課程、技術與安全四層知識圖譜
- 瀏覽器端收藏與個人學習進度
- 響應式版面、鍵盤操作與減少動態效果支援

## 本機預覽

```bash
python3 -m http.server 4173
```

開啟 `http://localhost:4173`。

## Cloudflare 部署

`worker/` 內的 Cloudflare Worker 接管 `eric020730.com/beauty` 與其子路徑，並直接提供建置後的靜態資產，不依賴 GitHub Pages。舊網址 `eric020730.com/lumina-atlas` 會保留為永久導向，根網站與其他既有路由不受影響。

push 到 GitHub `main` 後，GitHub Actions 會先驗證資料、建置與執行 Wrangler dry-run，通過後自動部署 Cloudflare Worker。GitHub repository 需設定 Secret `CLOUDFLARE_API_TOKEN` 與 Variable `CLOUDFLARE_ACCOUNT_ID`。

```bash
npm run check
npm run cf:types
npm run cf:check
npm run cf:deploy
```

## 資料聲明

網站內容僅供個人學習整理，不取代法規原文、專業訓練或臨床判斷。時效性資訊應以衛福部、醫師全聯會及各主辦學會最新公告為準。

課程情報位於 `data/course-intelligence.json`，更新後以 `npm run validate:data` 檢查格式與必要欄位。
