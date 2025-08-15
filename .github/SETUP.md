# GitHub Actions 設定指南

## 必要的 Secrets 設定

在你的 GitHub 儲存庫中設定以下 secrets：

### 1. CLOUDFLARE_API_TOKEN

1. 前往 [Cloudflare Dashboard](https://dash.cloudflare.com/profile/api-tokens)
2. 點擊 "Create Token"
3. 使用 "Custom token" 模板
4. 設定權限：
   - Account: Cloudflare Pages:Edit
   - Zone: Zone:Read
   - Account: Cloudflare Workers:Edit
   - Account: D1:Edit (如果需要資料庫操作)
5. 複製產生的 token

### 2. 在 GitHub 中添加 Secret

1. 前往你的 GitHub 儲存庫
2. 點擊 "Settings" 頁籤
3. 在左側選單選擇 "Secrets and variables" > "Actions"
4. 點擊 "New repository secret"
5. Name: `CLOUDFLARE_API_TOKEN`
6. Value: 貼上你的 Cloudflare API token
7. 點擊 "Add secret"

## 部署觸發條件

GitHub Actions 會在以下情況自動部署：
- 推送到 `main` 或 `master` 分支
- 手動觸發 (在 Actions 頁面點擊 "Run workflow")

## 注意事項

1. 確保 `wrangler.toml` 中的 `database_id` 已設定
2. 第一次部署前，請先手動建立 D1 資料庫：
   ```bash
   wrangler d1 create accounting-db
   ```
3. 如需資料庫遷移，可以在 workflow 中添加遷移步驟