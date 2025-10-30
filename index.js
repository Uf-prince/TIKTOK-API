const express = require('express');
const axios = require('axios');
const { PORT, TIKTOK_API_KEY } = require('./config');

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.send('TikTok Custom API is running!');
});

// TikTok download endpoint
app.post('/api/tiktok', async (req, res) => {
    try {
        const { url } = req.body;
        if (!url) return res.status(400).json({ error: 'TikTok URL is required' });

        const apiEndpoint = `https://foreign-marna-sithaunarathnapromax-9a005c2e.koyeb.app/api/tiktok/download?apiKey=${TIKTOK_API_KEY}&url=${encodeURIComponent(url)}`;

        const response = await axios.get(apiEndpoint);

        if (response.data) {
            res.json(response.data);
        } else {
            res.status(500).json({ error: 'Failed to fetch video from TikTok' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error while fetching TikTok video' });
    }
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));const express = require('express');
const axios = require('axios');
const { PORT, TIKTOK_API_KEY } = require('./config');

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.send('TikTok Custom API is running!');
});

// TikTok download endpoint
app.post('/api/tiktok', async (req, res) => {
    try {
        const { url } = req.body;
        if (!url) return res.status(400).json({ error: 'TikTok URL is required' });

        const apiEndpoint = `https://foreign-marna-sithaunarathnapromax-9a005c2e.koyeb.app/api/tiktok/download?apiKey=${TIKTOK_API_KEY}&url=${encodeURIComponent(url)}`;

        const response = await axios.get(apiEndpoint);

        if (response.data) {
            res.json(response.data);
        } else {
            res.status(500).json({ error: 'Failed to fetch video from TikTok' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error while fetching TikTok video' });
    }
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
