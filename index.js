const express = require('express');
const axios = require('axios');
const app = express();
require('dotenv').config();

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('TikTok Scraper API is running!');
});

app.post('/api/tiktok', async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'TikTok URL is required' });

  try {
    const videoUrl = await getTikTokVideo(url);
    if (!videoUrl) return res.status(500).json({ error: 'Failed to fetch TikTok video' });

    res.json({ video: videoUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching TikTok video' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

async function getTikTokVideo(tiktokUrl) {
  try {
    const { data } = await axios.get(tiktokUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }
    });

    const match = data.match(/<script id="__NEXT_DATA__" type="application\/json">(.+?)<\/script>/);
    if (!match) return null;

    const jsonData = JSON.parse(match[1]);
    const video = jsonData.props.pageProps.itemInfo.itemStruct.video.playAddr;

    return video ? video.split('?')[0] : null;
  } catch (err) {
    console.error('Scraper error:', err.message);
    return null;
  }
}
