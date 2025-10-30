const axios = require('axios');
const cheerio = require('cheerio');

/**
 * Fetch direct TikTok video URL from page
 */
async function getTikTokVideo(url) {
    try {
        // Step 1: Resolve short URL if any
        const finalUrl = await resolveUrl(url);

        // Step 2: Get HTML content
        const { data } = await axios.get(finalUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
                'Accept-Language': 'en-US,en;q=0.9',
            }
        });

        // Step 3: Parse video URL from HTML
        const $ = cheerio.load(data);
        const scriptTags = $('script[type="application/ld+json"]');
        for (let i = 0; i < scriptTags.length; i++) {
            const jsonText = $(scriptTags[i]).html();
            const jsonData = JSON.parse(jsonText);
            if (jsonData.video && jsonData.video.contentUrl) {
                return jsonData.video.contentUrl;
            }
        }

        return null;
    } catch (err) {
        console.error('Scraper Error:', err.message);
        return null;
    }
}

/**
 * Resolve short TikTok URLs to long URLs
 */
async function resolveUrl(url) {
    try {
        const res = await axios.get(url, { maxRedirects: 0, validateStatus: null });
        if (res.status === 301 || res.status === 302) {
            return res.headers.location;
        }
        return url;
    } catch {
        return url;
    }
}

module.exports = { getTikTokVideo };
