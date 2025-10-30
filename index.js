require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;
const API_KEY = process.env.MY_API_KEY || '';

app.get('/', (req, res) => {
  res.send('🎵 TikTok API is running!');
});

// TikTok Downloader API
app.get('/api/tiktok', async (req, res) => {
  const { url, apikey } = req.query;

  // Optional API key check
  if (API_KEY && apikey !== API_KEY) {
    return res.status(403).json({ error: "Invalid or missing API key!" });
  }

  if (!url) return res.status(400).json({ error: "Please provide ?url=<tiktok_video_url>" });

  try {
    // TikTok public video scraping
    const { data } = await axios.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    const $ = cheerio.load(data);
    const scriptTag = $('script[id="SIGI_STATE"]').html();
    if (!scriptTag) return res.json({ error: "Failed to extract video info!" });

    const jsonData = JSON.parse(scriptTag);
    const videoUrl = jsonData.ItemModule[Object.keys(jsonData.ItemModule)[0]].video.playAddr;

    return res.json({ video: videoUrl });
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch video!", details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 TikTok API running on port ${PORT}`);
});
