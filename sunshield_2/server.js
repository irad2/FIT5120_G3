const express = require('express');
const path = require('path');
const basicAuth = require('express-basic-auth');
const { Pool } = require('pg');
require('dotenv').config({ path: './keys.env' });

// Dynamic import of node-fetch
import('node-fetch').then(({ default: fetch }) => {
    const app = express();
    const port = 3000;

    const pool = new Pool({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT || 5432,
    });

    // Basic Authentication Configuration
    app.use(basicAuth({
        users: { 'user': process.env.PASSWORD },
        challenge: true,
        realm: 'SunshieldProtected'
    }));

    // Serve static files from the 'public' directory
    app.use(express.static('public'));

    // Route for the home page
    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, 'public', 'home.html'));
    });

    app.use('/tamagochi', express.static(path.join(__dirname, 'tamagotchi')));
    app.get('/tamagochi/*', (req, res) => {
        res.sendFile(path.join(__dirname, 'tamagotchi', 'index.html'));
    });

    // Proxy endpoint to securely fetch data from the external API using the API key
    app.get('/fetch-data', async (req, res) => {
        const { lat, lon, exclude = 'minutely,hourly,alerts' } = req.query; // Removed 'current' from the default exclude list
        const apiUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=${exclude}&appid=${process.env.API_KEY}`;
    
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            if (!response.ok) {
                throw new Error('Failed to fetch weather data');
            }
            if (!data.current && !data.daily) {
                console.error('Unexpected data structure received from API:', data);
                return res.status(500).json({ error: 'Data format error from API' });
            }
            res.json(data);
        } catch (error) {
            console.error('Server error fetching data:', error);
            res.status(500).json({ error: 'Failed to fetch data' });
        }
    });

    app.get('/api/sunburn-data', async(req, res) => {
        try {
            const query = 'SELECT activity, percentage FROM sunburn_location';
            const { rows } = await pool.query(query);

            const formattedData = {
                labels: rows.map(row => row.location),
                datasets: [{
                    data: rows.map(row => row.percentage),
                    backgroundColor: [
                        'rgba(96, 165, 250, 0.7)',
                        'rgba(244, 114, 182, 0.7)',
                        'rgba(52, 211, 153, 0.7)',
                        'rgba(252, 211, 77, 0.7)',
                        'rgba(167, 139, 250, 0.7)'
                    ],
                    borderRadius: 8,
                    borderColor: [
                        'rgba(96, 165, 250, 0.9)',
                        'rgba(244, 114, 182, 0.9)',
                        'rgba(52, 211, 153, 0.9)',
                        'rgba(252, 211, 77, 0.9)',
                        'rgba(167, 139, 250, 0.9)'
                    ],
                    borderWidth: 2
                }]
            };

            res.json(formattedData);
        } catch (error) {
            console.error('Error fetching data:', error);
            res.status(500).json({ error: 'An error occurred while fetching data' });
        }
    });

    // 404 Error handler for undefined routes
    app.use((req, res) => {
        res.status(404).sendFile(path.join(__dirname, 'public', 'error.html'));
    });

    // Start the server after fetch is available
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
});
