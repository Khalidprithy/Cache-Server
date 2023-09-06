const verifyApiKey = (apiKey) => {
    return (req, res, next) => {
        const requestApiKey = req.body.api_key;

        if (!requestApiKey || requestApiKey !== apiKey) {
            return res.status(401).json({
                status: false,
                message: 'Invalid API key or API key is missing',
            });
        }

        next();
    };
};

const verifyApiKeyInHeader = (apiKey) => {
    return (req, res, next) => {
        const requestApiKey = req.headers.api_key;

        if (!requestApiKey || requestApiKey !== apiKey) {
            return res.status(401).json({
                status: false,
                message: 'Invalid API key or API key is missing in the header',
            });
        }

        next();
    };
};

const getUserIp = (req, res, next) => {
    const publicIP =
        req.headers['cf-connecting-ip'] || req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';

    if (publicIP) {
        req.userIp = publicIP; // Store user's IP in the request object
    }

    next();
};

module.exports = {
    verifyApiKey,
    verifyApiKeyInHeader,
    getUserIp,
};
