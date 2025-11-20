// Simplified version - uses Twitter Web Intent with image link
// For automatic posting, you need to implement OAuth 1.0a signing

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { text, imageUrl } = req.body;
        
        if (!text) {
            return res.status(400).json({ error: 'Text is required' });
        }

        // Twitter Web Intent doesn't support direct image attachment
        // But we can create a URL that includes the image link
        // Twitter will show a preview of the image if it's a valid URL
        
        const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}${imageUrl && imageUrl.startsWith('http') ? '&url=' + encodeURIComponent(imageUrl) : ''}`;
        
        res.status(200).json({ 
            success: true,
            tweetUrl: tweetUrl,
            message: 'Use this URL to tweet. Image will be shown as a link preview if it\'s a valid URL.'
        });
    } catch (error) {
        console.error('Error creating tweet:', error);
        res.status(500).json({ error: 'Failed to create tweet' });
    }
}

