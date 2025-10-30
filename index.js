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

        // Resolve short links (vt.tiktok.com)
        const response = await axios.get(url, { maxRedirects: 5 });
        const finalUrl = response.request.res.responseUrl || url;

        // Extract video JSON metadata
        const videoIdMatch = finalUrl.match(/\/video\/(\d+)/);
        if (!videoIdMatch) return res.status(400).json({ error: 'Invalid TikTok video URL' });

        const videoId = videoIdMatch[1];
        const apiUrl = `https://www.tiktok.com/node/share/video/@username/${videoId}`; // Scrape endpoint

        const { data } = await axios.get(apiUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
            }
        });

        // Video URL from JSON
        const videoUrl = data?.itemInfo?.itemStruct?.video?.playAddr;
        if (!videoUrl) return res.status(500).json({ error: 'Failed to fetch video link' });

        res.json({ video: videoUrl });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch TikTok video' });
    }
});

app.get('/', (req, res) => res.send('TikTok Scraper API is running!'));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
