require('dotenv').config();

const PORT = process.env.PORT || 3000;
const TIKTOK_API_KEY = process.env.TIKTOK_API_KEY || 'bilaltech05';

module.exports = { PORT, TIKTOK_API_KEY };
