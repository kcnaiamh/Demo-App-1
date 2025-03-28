const express = require("express");
const router = express.Router();
const { connectToDatabase } = require("../services/dbService");

router.get("/", async (req, res) => {
	let connection;
	try {
		connection = await connectToDatabase();
		const [users] = await connection.execute(
			"SELECT username, email FROM my_database.users"
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
