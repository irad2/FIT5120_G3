const express = require('express');
const path = require('path');
const app = express();
const port = 3000;
const basicAuth = require('express-basic-auth');
require('dotenv').config({ path: './keys.env' });

// Basic Authentication Configuration
app.use(basicAuth({
    users: { 'user': process.env.PASSWORD },
    challenge: true,
    realm: 'SunshieldProtected'
}));

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Secure endpoint to get the API key
app.get('/get-api-key', (req, res) => {
    res.json({ apiKey: process.env.API_KEY });
});

// Route for the home page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

// Add this after your other routes
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', 'error.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

// Correctly access and log the API Key and Password
console.log('API Key:', process.env.API_KEY);
console.log('Password:', process.env.PASSWORD);