const axios = require('axios');
const NodeCache = require('node-cache');
const cache = new NodeCache();
const CACHE_TTL_SECONDS = 15 * 24 * 60 * 60; // 15 days in seconds

// Function to fetch fixtures and cache them
async function fetchAndCacheFixtures(date, apiToken) {
    try {
        const cachedData = cache.get(date);

        if (cachedData) {
            console.log(`Cache hit for date: ${date}`);
            return cachedData;
        } else {
            console.log(`Cache miss for date: ${date}, fetching from API...`);
            let has_more = true;
            let page = 1;
            let fixtures = [];

            while (has_more) {
                const response = await axios.get(
                    `https://api.sportmonks.com/v3/football/fixtures/date/${date}?api_token=${apiToken}&include=league.country;round.stage;participants;state;scores;events.type&page=${page}`
                );

                const data = response.data;

                if (data && data.data) {
                    fixtures = fixtures.concat(data.data);
                    has_more = data.pagination.has_more;
                    page++;
                } else {
                    // Handle unexpected API response format
                    console.error('Unexpected API response format');
                    throw new Error('Unexpected API response format');
                }
            }

            let group_by_league = {};

            fixtures.forEach((fixture) => {
                if (group_by_league[fixture.league.id] !== undefined) {
                    group_by_league[fixture.league.id].push(fixture);
                } else {
                    group_by_league[fixture.league.id] = [];
                    group_by_league[fixture.league.id].push(fixture);
                }
            });

            const sortedKeys = Object.keys(group_by_league).sort();

            const sortedObj = {};

            sortedKeys.forEach((key) => {
                sortedObj[key] = group_by_league[key];
            });

            // Cache the data with the specified TTL
            cache.set(date, sortedObj, CACHE_TTL_SECONDS);

            console.log(`Data for date: ${date} fetched from API and cached.`);
            return sortedObj;
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
}

// Function to clear the cache manually
function clearCache() {
    cache.flushAll();
    console.log('Cache cleared manually.');
}

module.exports = {
    fetchAndCacheFixtures,
    clearCache,
};
