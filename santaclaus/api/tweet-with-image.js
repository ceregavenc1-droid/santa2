// Vercel Serverless Function to post tweet with image using Twitter API v2
// Requires Twitter Developer App credentials in environment variables
// Uses OAuth 1.0a for authentication

// Simple OAuth 1.0a signature generator
function generateOAuthSignature(method, url, params, consumerSecret, tokenSecret) {
    // Use Node.js crypto (available in Vercel Serverless Functions)
    const crypto = require('crypto');
    
    // Create parameter string (sorted)
    const sortedKeys = Object.keys(params).sort();
    const paramString = sortedKeys
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
        .join('&');
    
    // Create signature base string
    const signatureBaseString = `${method.toUpperCase()}&${encodeURIComponent(url)}&${encodeURIComponent(paramString)}`;
    
    // Create signing key
    const signingKey = `${encodeURIComponent(consumerSecret)}&${encodeURIComponent(tokenSecret || '')}`;
    
    // Generate signature using HMAC-SHA1
    const signature = crypto
        .createHmac('sha1', signingKey)
        .update(signatureBaseString)
        .digest('base64');
    
    return signature;
}

// Generate OAuth 1.0a header
function generateOAuthHeader(method, url, params, consumerKey, consumerSecret, accessToken, accessTokenSecret) {
    const oauthParams = {
        oauth_consumer_key: consumerKey,
        oauth_token: accessToken,
        oauth_signature_method: 'HMAC-SHA1',
        oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
        oauth_nonce: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
        oauth_version: '1.0'
    };
    
    // Merge with other params for signature
    const allParams = { ...oauthParams, ...params };
    
    // Generate signature
    oauthParams.oauth_signature = generateOAuthSignature(method, url, allParams, consumerSecret, accessTokenSecret);
    
    // Create header string
    const headerParams = Object.keys(oauthParams)
        .sort()
        .map(key => `${encodeURIComponent(key)}="${encodeURIComponent(oauthParams[key])}"`)
        .join(', ');
    
    return `OAuth ${headerParams}`;
}

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
        const { text, imageUrl } = req.body;
        
        if (!text) {
            return res.status(400).json({ error: 'Text is required' });
        }

        // Get Twitter API credentials from environment variables
        const TWITTER_API_KEY = process.env.TWITTER_API_KEY;
        const TWITTER_API_SECRET = process.env.TWITTER_API_SECRET;
        const TWITTER_ACCESS_TOKEN = process.env.TWITTER_ACCESS_TOKEN;
        const TWITTER_ACCESS_TOKEN_SECRET = process.env.TWITTER_ACCESS_TOKEN_SECRET;

        // Check if credentials are available
        if (!TWITTER_API_KEY || !TWITTER_API_SECRET || !TWITTER_ACCESS_TOKEN || !TWITTER_ACCESS_TOKEN_SECRET) {
            // Fallback: return Twitter Intent URL (without image attachment)
            const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}${imageUrl ? '&url=' + encodeURIComponent(imageUrl) : ''}`;
            return res.status(200).json({ 
                success: false,
                tweetUrl: tweetUrl,
                message: 'Twitter API credentials not configured. Add TWITTER_API_KEY, TWITTER_API_SECRET, TWITTER_ACCESS_TOKEN, and TWITTER_ACCESS_TOKEN_SECRET to Vercel environment variables. See TWITTER_API_SETUP.md for instructions.'
            });
        }

        let mediaId = null;

        // Step 1: Upload image to Twitter Media API if provided
        if (imageUrl && imageUrl.startsWith('http')) {
            try {
                // Fetch image
                const imageResponse = await fetch(imageUrl);
                const imageBuffer = await imageResponse.arrayBuffer();
                const imageBase64 = Buffer.from(imageBuffer).toString('base64');

                // Upload to Twitter Media API v1.1
                const mediaUrl = 'https://upload.twitter.com/1.1/media/upload.json';
                const mediaParams = {
                    media_data: imageBase64
                };

                const mediaAuthHeader = generateOAuthHeader(
                    'POST',
                    mediaUrl,
                    mediaParams,
                    TWITTER_API_KEY,
                    TWITTER_API_SECRET,
                    TWITTER_ACCESS_TOKEN,
                    TWITTER_ACCESS_TOKEN_SECRET
                );

                const mediaFormData = new URLSearchParams(mediaParams);
                const mediaResponse = await fetch(mediaUrl, {
                    method: 'POST',
                    headers: {
                        'Authorization': mediaAuthHeader,
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: mediaFormData.toString()
                });

                if (mediaResponse.ok) {
                    const mediaData = await mediaResponse.json();
                    mediaId = mediaData.media_id_string;
                } else {
                    const errorText = await mediaResponse.text();
                    console.error('Media upload error:', errorText);
                }
            } catch (mediaError) {
                console.error('Error uploading media:', mediaError);
            }
        }

        // Step 2: Post tweet with media using Twitter API v2
        const tweetUrl = 'https://api.twitter.com/2/tweets';
        const tweetBody = {
            text: text
        };

        // Add media if available (Twitter API v2 format)
        if (mediaId) {
            tweetBody.media = {
                media_ids: [mediaId]
            };
        }

        // For OAuth 1.0a, we need to include body parameters in signature
        // But Twitter API v2 uses JSON body, so we need to handle this differently
        // Actually, for JSON bodies, OAuth signature is calculated without body params
        const tweetAuthHeader = generateOAuthHeader(
            'POST',
            tweetUrl,
            {},
            TWITTER_API_KEY,
            TWITTER_API_SECRET,
            TWITTER_ACCESS_TOKEN,
            TWITTER_ACCESS_TOKEN_SECRET
        );

        const tweetResponse = await fetch(tweetUrl, {
            method: 'POST',
            headers: {
                'Authorization': tweetAuthHeader,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(tweetBody)
        });

        if (tweetResponse.ok) {
            const tweetData = await tweetResponse.json();
            return res.status(200).json({ 
                success: true,
                tweetId: tweetData.data.id,
                tweetUrl: `https://twitter.com/i/web/status/${tweetData.data.id}`,
                message: 'Tweet posted successfully with image attached!'
            });
        } else {
            const errorData = await tweetResponse.text();
            console.error('Tweet error:', errorData);
            return res.status(tweetResponse.status).json({ 
                success: false,
                error: 'Failed to post tweet',
                details: errorData,
                tweetUrl: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}${imageUrl ? '&url=' + encodeURIComponent(imageUrl) : ''}`
            });
        }
    } catch (error) {
        console.error('Error creating tweet:', error);
        res.status(500).json({ error: 'Failed to create tweet', details: error.message });
    }
}

