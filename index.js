const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { verifyApiKeyInHeader, getUserIp } = require('./middleware/userAuth');
const fixturesRoute = require('./routes/fixtures');
const clearCacheRoute = require('./routes/clear-cache');
const path = require('path');

dotenv.config();

const API_KEY = process.env.API_KEY;

if (!process.env.SPORTMONKS_API_KEY) {
    console.error('SPORTMONKS_API_KEY is not set in the environment variables.');
    process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(getUserIp); // Apply getUserIp middleware globally
app.use('/api/admin/v1', verifyApiKeyInHeader(API_KEY)); // Apply api_key middleware to specific routes

// Serve static files from the root directory (including index.html)
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/admin/v1', fixturesRoute);
app.use('/api/admin/v1', clearCacheRoute);

// Global error handling middleware
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'An error occurred' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
