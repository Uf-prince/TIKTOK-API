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

        console.log('Received URL:', url);

        // --- Scraping logic ---
        const videoData = await fetchTikTokVideo(url);

        if (!videoData) {
            console.log('❌ Failed to fetch TikTok video for URL:', url);
            return res.status(500).json({ error: 'Failed to fetch TikTok video' });
        }

        console.log('✅ Video fetched successfully');
        res.json(videoData);

    } catch (err) {
        console.error('💥 Error in /api/tiktok:', err.message);
        res.status(500).json({ error: 'Internal server error', details: err.message });
    }
});

app.get('/', (req, res) => {
    res.send('TikTok API is running!');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// --- Example TikTok scraper ---
async function fetchTikTokVideo(url) {
    try {
        // Convert short URLs to full TikTok links if needed
        const resolvedUrl = await axios.get(url, { maxRedirects: 5 }).then(r => r.request.res.responseUrl).catch(() => url);

        // Request TikTok page HTML
        const pageHtml = await axios.get(resolvedUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } }).then(r => r.data);

        // Extract video URL from HTML
        const videoMatch = pageHtml.match(/"downloadAddr":"([^"]+)"/);
        if (!videoMatch) return null;

        const videoUrl = decodeURIComponent(videoMatch[1]);

        return { videoUrl, originalUrl: resolvedUrl };

    } catch (err) {
        console.error('Error fetching TikTok video:', err.message);
        return null;
    }
}
