# Cloudflare 部署指南

## 前置準備

1. 安裝 Node.js 和 npm
2. 註冊 Cloudflare 帳號
3. 安裝 Wrangler CLI：
   ```bash
   npm install -g wrangler
   ```

## 部署步驟

### 1. 安裝依賴
```bash
npm install
```

### 2. 登入 Cloudflare
```bash
wrangler login
```

### 3. 建立 D1 資料庫
```bash
wrangler d1 create accounting-db
```

複製輸出的 database_id，並更新 `wrangler.toml` 中的 `database_id`

### 4. 執行資料庫遷移
```bash
wrangler d1 migrations apply accounting-db
```

### 5. 部署 Worker
```bash
wrangler deploy
```

### 6. 部署前端到 Pages
```bash
wrangler pages deploy frontend
```

或者透過 Cloudflare Dashboard 連結 GitHub 倉庫自動部署

### 7. 更新前端 API URL
部署完成後，將 `frontend/app.js` 中的 `apiUrl` 更新為你的 Worker URL

## 本地開發

### 啟動本地開發伺服器
```bash
wrangler dev
wrangler dev --port=8787 --ip=0.0.0.0
```

### 本地資料庫管理
```bash
# 建立本地資料庫
wrangler d1 migrations apply accounting-db --local

# 打開資料庫控制台
wrangler d1 console accounting-db --local
```

## 專案結構
```
├── frontend/          # 前端檔案 (部署到 Pages)
│   ├── index.html
│   ├── style.css
│   └── app.js
├── backend/src/       # Worker 原始碼
│   └── index.js
├── schema/            # D1 資料庫 schema
│   └── 001_initial.sql
├── wrangler.toml      # Wrangler 配置
└── package.json
```

## 注意事項

1. 確保在 `frontend/app.js` 中將 `apiUrl` 更新為你的實際 Worker URL
2. D1 資料庫需要在 Cloudflare Dashboard 中手動建立或使用 CLI
3. Pages 部署可選擇手動上傳或連結 Git 倉庫自動部署
4. 免費方案有使用限制，請注意配額
