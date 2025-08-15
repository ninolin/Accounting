const config = {
    // 開發環境
    development: {
        apiUrl: 'http://68.183.239.7:8787'
    },
    // 生產環境
    production: {
        apiUrl: 'https://your-worker.your-subdomain.workers.dev'
    }
};

// 自動偵測環境
//const environment = window.location.hostname === 'localhost' ? 'development' : 'production';
const environment = 'development'
// 導出設定
window.CONFIG = config[environment];
