import express from 'express';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Create Express application
const app = express();
const port = process.env.PORT || 3001;

// Middleware configuration
app.use(express.json()); // Parse JSON request bodies
app.use(express.static('public')); // Serve static files from public directory

// Import and use API route
import directLinkGenerator from './api/direct-link-generator.js';
app.post('/api/generate-link', directLinkGenerator);

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});