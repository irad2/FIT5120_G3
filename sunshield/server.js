const express = require('express');
const path = require('path');
const app = express();
const port = 3000;
require('dotenv').config();




// Serve static files from the 'public' directory
app.use(express.static('public'));

// Route for the home page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
    // res.sendFile(path.join(__dirname, 'public', 'uv_analysis.html'));

});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});