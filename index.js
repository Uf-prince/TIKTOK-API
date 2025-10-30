const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// ✅ Root route (for browser test)
app.get('/', (req, res) => {
    res.send('✅ TikTok API is running successfully!');
});

// ✅ TikTok download route
app.post('/api/tiktok', async (req, res) => {
    try {
        const { url } = req.body;

        if (!url) {
            console.log('⚠️ No URL received!');
            return res.status(400).json({ error: 'TikTok URL is required' });
        }

        console.log('➡️ URL received:', url);

        // Resolve redirects (short → long URL)
        const resolvedUrl = await axios
            .get(url, { maxRedirects: 5 })
            .then(r => r.request.res.responseUrl)
            .catch(() => url);

        console.log('🔗 Final URL:', resolvedUrl);

        // Get TikTok HTML page
        const html = await axios.get(resolvedUrl, {
            headers: { 'User-Agent': 'Mozilla/5.0' },
        }).then(r => r.data);

        // Extract video link
        const match = html.match(/"downloadAddr":"([^"]+)"/);
        if (!match) {
            console.log('❌ Video URL not found in HTML!');
            return res.status(500).json({ error: 'Video not found!' });
        }

        const videoUrl = decodeURIComponent(match[1]).replace(/\\u0026/g, '&');

        console.log('✅ Video URL fetched successfully!');
        res.json({ videoUrl, originalUrl: resolvedUrl });

    } catch (err) {
        console.error('💥 Error in /api/tiktok:', err.message);
        res.status(500).json({ error: 'Internal server error', details: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
