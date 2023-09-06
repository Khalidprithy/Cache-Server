const express = require('express');
const { fetchAndCacheFixtures } = require('../api/fixtures');

const router = express.Router();

router.post('/fixtures', async (req, res, next) => {
    try {
        const { date } = req.body;
        const apiToken = process.env.SPORTMONKS_API_KEY;

        const fixturesData = await fetchAndCacheFixtures(date, apiToken);

        res.json({
            status: true,
            result: fixturesData,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            message: 'Something went wrong or invalid request, Try again',
            error: error.message,
        });
        next(error);
    }
});

module.exports = router;
