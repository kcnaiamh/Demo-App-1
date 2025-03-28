const mysql = require("mysql2/promise");
const { getDatabaseCredentials } = require("./vaultService");
require('dotenv').config();

// MySQL Server Configuration
const MYSQL_HOST = process.env.MYSQL_HOST_IP;
const MYSQL_PORT = process.env.MYSQL_PORT;
const MYSQL_DATABASE = process.env.MYSQL_DATABASE;

async function connectToDatabase() {
	try {
		// Fetch credentials from Vault
		const credentials = await getDatabaseCredentials();

		// Establish MySQL connection
		const connection = await mysql.createConnection({
			host: MYSQL_HOST,
			port: MYSQL_PORT,
			database: MYSQL_DATABASE,
			user: credentials.username,
			password: credentials.password,
		});

		// Schedule credential renewal
		setTimeout(() => {
			renewDatabaseCredentials(credentials.leaseId);
		}, (credentials.leaseDuration / 2) * 1000); // Renew at half lease time

		return connection;
	} catch (error) {
		console.error("Error connecting to MySQL:", error);
		throw error;
	}
}

async function renewDatabaseCredentials(leaseId) {
	try {
		await vault.write("sys/leases/renew", { lease_id: leaseId });
		console.log("Database credentials renewed successfully");
	} catch (error) {
		console.error("Error renewing credentials:", error);
		connectToDatabase(); // Reconnect if renewal fails
	}
}

module.exports = { connectToDatabase };
