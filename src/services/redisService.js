const { createClient } = require("redis");
require('dotenv').config();


// Global object to store health status for MySQL and Vault (using Redis channel for Vault health)
let healthStatus = {
	mysql: null,
	vault: null,
};

// Create a Redis client for normal commands using env variables for security.
const redisClient = createClient({
	password: process.env.REDIS_PASSWORD, // Use an env variable for Redis password
	socket: {
		host: process.env.REDIS_HOST, // e.g., '192.168.10.13'
		port: process.env.REDIS_PORT, // e.g., 6379
	},
});

redisClient.on("error", (err) => console.error("Redis Client Error:", err));

// Initialize Redis: Connect, fetch initial health status, then subscribe for updates.
async function initializeRedis() {
	try {
		await redisClient.connect();
		console.log("Connected to Redis");

		// Fetch initial health statuses
		healthStatus.mysql = await redisClient.get("health:mysql");
		healthStatus.vault = await redisClient.get("health:vault");

		// Create a duplicate client for subscribing to avoid interference with normal commands.
		const subscriber = redisClient.duplicate();
		subscriber.on("error", (err) =>
			console.error("Redis Subscriber Error:", err)
		);
		await subscriber.connect();

		// Subscribe to MySQL health channel
		await subscriber.subscribe("health:mysql", (message) => {
			console.log(`Received MySQL health update: ${message}`);
			healthStatus.mysql = message;
		});

		// Subscribe to Vault health channel
		await subscriber.subscribe("health:vault", (message) => {
			console.log(`Received Vault health update: ${message}`);
			healthStatus.vault = message;
		});

		console.log("Subscribed to health channels");
	} catch (err) {
		console.error("Error setting up Redis service:", err);
	}
}

// Kick off the Redis initialization.
initializeRedis();

// Function to retrieve the current health status
function getHealthStatus() {
	return healthStatus;
}

module.exports = { getHealthStatus };
