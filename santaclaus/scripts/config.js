// config.js - Конфигурация URL адресов сайта
// Измените эти значения на нужные вам URL

const CONFIG = {
    // Базовый URL сайта
    BASE_URL: "https://santaclaus.dev", // Ваш домен
    
    // API URL для запросов
    API_URL: "https://api.pumpleverage.fun/",
    
    // Социальные сети
    SOCIAL: {
        TWITTER: "https://twitter.com/santaclaus",
        TELEGRAM: "https://t.me/santaclaus",
        DEXSCREENER: "https://dexscreener.com/solana/santaclaus"
    },
    
    // Внешние ссылки
    EXTERNAL: {
        BINANCE_SOL: "https://www.binance.com/en/trade/SOL_USDT"
    },
    
    // Адрес контракта токена
    CONTRACT_ADDRESS: "SANTACLAUS_CONTRACT_ADDRESS_HERE"
};

// Экспорт для использования в других скриптах
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}

