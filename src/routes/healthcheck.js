const express = require("express");
const router = express.Router();
const redisService = require("../services/redisService");

// /healthcheck endpoint: Return latest health status.
router.get("/", (req, res) => {
	const healthStatus = redisService.getHealthStatus();
	res.json(healthStatus);
});

module.exports = router;
