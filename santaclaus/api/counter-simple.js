// Simple API endpoint for shared counter
// Uses in-memory storage (resets on server restart)
// For production, use counter.js with JSONBin.io

let sharedCount = 4; // Default value

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        if (req.method === 'GET') {
            // Get current count
            return res.status(200).json({ count: sharedCount });
        } else if (req.method === 'POST') {
            // Increment count by 1
            sharedCount++;
            return res.status(200).json({ count: sharedCount, success: true });
        }
    } catch (error) {
        console.error('Counter API error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

