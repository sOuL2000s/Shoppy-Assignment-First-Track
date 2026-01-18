const { createClient } = require('redis');

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

const redisClient = createClient({ url: REDIS_URL });

redisClient.on('error', (err) => console.error('Redis Client Error', err));

async function connectRedis() {
    await redisClient.connect();
    console.log("Redis connected successfully.");
}

function checkConnection() {
    if (!redisClient.isReady) {
        connectRedis().catch(err => {
            console.error("Failed to connect to Redis:", err.message);
        });
    }
}

module.exports = {
    redisClient,
    checkConnection
};