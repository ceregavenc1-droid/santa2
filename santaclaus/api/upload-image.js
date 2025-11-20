// Vercel Serverless Function to upload image to Imgur
// Note: For production, get your own Imgur Client ID at https://api.imgur.com/oauth2/addclient

export default async function handler(req, res) {
    // Enable CORS
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
        const { image } = req.body;
        
        if (!image) {
            return res.status(400).json({ error: 'No image provided' });
        }

        // Upload to Imgur using public client ID
        // Note: This is a public client ID with rate limits
        // For production, get your own at https://api.imgur.com/oauth2/addclient
        const imgurClientId = '546c25a59c58ad7';
        
        // Extract base64 data (remove data:image/png;base64, prefix if present)
        const base64Data = image.includes(',') ? image.split(',')[1] : image;
        
        // Imgur API accepts base64 directly
        const imgurResponse = await fetch('https://api.imgur.com/3/image', {
            method: 'POST',
            headers: {
                'Authorization': `Client-ID ${imgurClientId}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                image: base64Data,
                type: 'base64'
            })
        });
        
        if (imgurResponse.ok) {
            const data = await imgurResponse.json();
            if (data.success && data.data && data.data.link) {
                return res.status(200).json({ 
                    url: data.data.link,
                    success: true
                });
            }
        }
        
        // Fallback: return data URL (Twitter won't use it directly, but it's a fallback)
        res.status(200).json({ 
            url: image,
            success: false,
            message: 'Imgur upload failed, using data URL'
        });
    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({ error: 'Failed to upload image' });
    }
}

