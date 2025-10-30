const express = require('express');
const axios = require('axios');
const config = require('./config');

const app = express();
app.use(express.json());

// TikTok download route
app.post('/api/tiktok', async (req, res) => {
    try {
        const { url } = req.body;
        if (!url) return res.status(400).json({ error: 'TikTok URL is required' });

        // Use your API key from config
        const apiKey = config.TIKTOK_API_KEY;
        const apiUrl = `https://api.tiktok-downloader.com/download?url=${encodeURIComponent(url)}&apikey=${apiKey}`;

        const response = await axios.get(apiUrl);
        if (response.data) {
            res.json(response.data);
        } else {
            res.status(500).json({ error: 'No data from TikTok API' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch TikTok video' });
    }
});

app.get('/', (req, res) => {
    res.send('TikTok API is running!');
});

app.listen(config.PORT, () => {
    console.log(`Server running on port ${config.PORT}`);
});
