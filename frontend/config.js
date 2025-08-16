const config = {
    // 開發環境
    development: {
        apiUrl: 'http://127.0.0.1:8787'
    },
    // 生產環境
    production: {
        apiUrl: ''  // Use relative URLs for same-origin requests in Cloudflare Pages
    }
};

// 自動偵測環境
const environment = window.location.hostname === 'localhost' ? 'development' : 'production';
// 導出設定
window.CONFIG = config[environment];
