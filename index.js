const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// TikTok scraper route
app.post('/api/tiktok', async (req, res) => {
    try {
        const { url } = req.body;
        if (!url) return res.status(400).json({ error: 'TikTok URL is required' });

        // TikTok scraping API (custom or third-party)
        // Example free endpoint: https://api.tiktokdlapi.com
        // Replace below with your own scraper logic if needed
        const apiResponse = await axios.get(`https://api.tiktokdlapi.com/download?url=${encodeURIComponent(url)}`);

        if (apiResponse.data && apiResponse.data.video) {
            res.json({ video: apiResponse.data.video });
        } else {
            res.status(500).json({ error: 'Failed to fetch TikTok video' });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Failed to fetch TikTok video' });
    }
});

app.get('/', (req, res) => {
    res.send('TikTok Scraper API is running!');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
