const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// TikTok download route
app.post('/api/tiktok', async (req, res) => {
    try {
        const { url } = req.body;
        if (!url) return res.status(400).json({ error: 'TikTok URL is required' });

        // Example using third-party API (replace with your own if you have one)
        const apiKey = process.env.TIKTOK_API_KEY || "YOUR_API_KEY_HERE";
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

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
