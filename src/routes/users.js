const express = require("express");
const router = express.Router();
const { connectToDatabase } = require("../services/dbService");

const DB_NAME = process.env.DB_NAME;

router.get("/", async (req, res) => {
	let connection;
	try {
		connection = await connectToDatabase();
		const [users] = await connection.execute(
			`SELECT username, email FROM ${DB_NAME}.users`
		);
		res.json({ success: true, data: users });
	} catch (error) {
		console.error("Error fetching users:", error);
		res.status(500).json({ success: false, message: "Internal Server Error" });
	} finally {
		if (connection) await connection.end();
	}
});

module.exports = router;
