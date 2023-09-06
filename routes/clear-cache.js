const express = require('express');
const { clearCache } = require('../api/fixtures');

const router = express.Router();

router.post('/clear-cache', (req, res) => {
    clearCache();
    res.json({
        status: true,
        message: 'Cache cleared successfully.',
    });
});

module.exports = router;
