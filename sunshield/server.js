const express = require('express');
const path = require('path');
const app = express();
const port = 3000;
require('dotenv').config();

app.get('/openweather/api/uv-index', async (req, res) => {
    const { lat, lon } = req.query;
    const apiKey = process.env.WEATHER_API_KEY;
    console.log(lat, lon);

    const url = `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        res.json({ uvIndex: data.value });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch UV index' });
    }
});


// Serve static files from the 'public' directory
app.use(express.static('public'));

// Route for the home page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});