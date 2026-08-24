# 微光研習所 LUMINA ATLAS

個人的台灣醫美課程、法規與臨床知識學習索引。

網站：<https://eric020730.com/beauty/>

## 功能

- 醫美法規與學會消息重點整理
- 放射診斷科專科醫師資格掃描與個人合規待辦追蹤
- 法規關鍵期限倒數、官方版本時間軸與瀏覽器端進度保存
- 每週自動搜尋並更新課程期限、時數、費用、資格與查核來源
- 法規、課程、技術與安全四層知識圖譜
- 瀏覽器端收藏與個人研習筆記
- 響應式版面、鍵盤操作與減少動態效果支援

## 本機預覽

```bash
python3 -m http.server 4173
```

開啟 `http://localhost:4173`。

## Cloudflare 路由

`worker/` 內的 Cloudflare Worker 接管 `eric020730.com/beauty*`，並以串流方式代理 GitHub Pages 上的已發布內容。舊網址 `eric020730.com/lumina-atlas*` 會保留為永久導向，根網站與其他既有路由不受影響。

```bash
npm run cf:types
npm run cf:check
npm run cf:deploy
```

## 資料聲明

網站內容僅供個人學習整理，不取代法規原文、專業訓練或臨床判斷。時效性資訊應以衛福部、醫師全聯會及各主辦學會最新公告為準。

課程情報位於 `data/course-intelligence.json`，更新後以 `npm run validate:data` 檢查格式與必要欄位。
