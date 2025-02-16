import fetch from 'node-fetch';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Main API handler function
export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    // Validate request body
    const { url } = req.body;
    if (!url) {
        return res.status(400).json({ error: 'URL parameter is required' });
    }

    try {
        // Configure API request options
        const options = {
            method: 'POST',
            headers: {
                'x-rapidapi-key': process.env.RAPIDAPI_KEY,
                'Content-Type': 'application/json',
                'x-rapidapi-host': 'terabox-downloader-direct-download-link-generator.p.rapidapi.com'
            },
            body: JSON.stringify({ url })
        };

        // Make request to external API
        const response = await fetch('https://terabox-downloader-direct-download-link-generator.p.rapidapi.com/fetch', options);
        
        // Handle non-OK responses
        if (!response.ok) {
            const errorText = await response.text();
            console.error('API Error:', errorText);
            return res.status(response.status).json({ 
                error: 'Failed to fetch from RapidAPI',
                details: errorText 
            });
        }

        // Process successful response
        const data = await response.json();
        if (data.length > 0 && data[0].dlink) {
            return res.status(200).json({ dlink: data[0].dlink });
        }
        
        return res.status(404).json({ error: 'No download link found' });

    } catch (error) {
        // Handle any unexpected errors
        console.error('Fetch error:', error);
        return res.status(500).json({ 
            error: 'Internal Server Error',
            details: error.message 
        });
    }
}