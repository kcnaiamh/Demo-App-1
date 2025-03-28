const vault = require("node-vault")();
require('dotenv').config();

// Vault Configuration
const VAULT_ADDR = process.env.VAULT_ADDR;
const ROLE_ID = process.env.VAULT_ROLE_ID;
const SECRET_ID = process.env.VAULT_SECRET_ID;

vault.apiVersion = "v1";
vault.endpoint = VAULT_ADDR;

async function getDatabaseCredentials() {
	try {
		// Authenticate with Vault using AppRole
		const result = await vault.approleLogin({
			role_id: ROLE_ID,
			secret_id: SECRET_ID,
		});
		vault.token = result.auth.client_token;

		// Retrieve database credentials
		const response = await vault.read("database/creds/nodejs-app");
		return {
			username: response.data.username,
			password: response.data.password,
			leaseId: response.lease_id,
			leaseDuration: response.lease_duration,
		};
	} catch (error) {
		console.error("Error retrieving credentials from Vault:", error);
		throw error;
	}
}

module.exports = { getDatabaseCredentials };
