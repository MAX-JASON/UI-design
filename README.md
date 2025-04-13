# 台灣儲蓄險分析系統 3.0

專業的儲蓄險分析工具，提供全面的保單比較和數據可視化功能。

## 特點

- 保單數據比較與分析
- 動態圖表和視覺化
- 產品導入功能
- 完全響應式設計，支持桌面和iPad設備
- 可作為主屏幕Web App

## 安裝到iPad主屏幕的步驟

1. 在Safari瀏覽器中打開應用網址
2. 點擊分享按鈕（箭頭向上的圖標）
3. 滾動並選擇"添加到主屏幕"
4. 輸入名稱（或使用默認名稱）
5. 點擊"添加"
6. 現在可以從主屏幕啟動應用，它將以全屏模式運行

## 文件結構

```
UI-design-rebuild/
├── css/                  # 樣式文件
├── html/                 # HTML文件
│   └── js/              # 客戶端腳本
├── JavaScript/           # 主要JavaScript文件
├── icons/                # 應用圖標和啟動畫面
└── js/                   # 共享JavaScript文件
```

## GitHub部署準備

上傳到GitHub前，請確保：

1. 所有文件路徑正確（相對路徑）
2. 所有圖像和圖標文件已包含
3. manifest.json配置正確

## 上傳到GitHub的步驟

```bash
# 初始化Git倉庫（如果尚未初始化）
git init

# 添加所有文件
git add .

# 提交更改
git commit -m "初始化台灣儲蓄險分析系統3.0"

# 添加GitHub遠程倉庫（替換為您的倉庫URL）
git remote add origin https://github.com/yourusername/savings-insurance-analysis.git

# 推送到GitHub
git push -u origin master
```

## iPad兼容性說明

系統已經過優化，可在iPad上流暢運行：

- 支持豎屏和橫屏模式
- 優化的觸控界面（更大的點擊區域）
- 增強的滾動體驗
- 適配不同iPad屏幕尺寸

## 技術堆棧

- HTML5/CSS3
- JavaScript (ES6+)
- Bootstrap 5.3.0
- Chart.js
- Particles.js
- Font Awesome

## 注意事項

首次加載時，如果遇到任何顯示問題，可使用頁面底部的緊急控制按鈕進行修復。
