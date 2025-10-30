const express = require('express');
const { getTikTokVideo } = require('./tiktokScraper');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// TikTok download route
app.post('/api/tiktok', async (req, res) => {
    try {
        let { url } = req.body;
        if (!url) return res.status(400).json({ error: 'TikTok URL is required' });

        const videoUrl = await getTikTokVideo(url);
        if (!videoUrl) return res.status(500).json({ error: 'Failed to fetch TikTok video' });

        res.json({ video: videoUrl });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch TikTok video' });
    }
});

app.get('/', (req, res) => res.send('TikTok Custom Scraper API is running!'));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
