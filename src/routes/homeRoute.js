const express = require("express");
const router = express.Router();
require('dotenv').config();

router.get("/", async (req, res) => {
    res.send(`
        <html>
            <head>
                <title>Home</title>
            </head>
            <body>
                <a href="http://${process.env.HOST_IP}:3000/users">User List</a>
                <a href="http://${process.env.HOST_IP}:3000/healthcheck">Health Check</a>
            </body>
        </html>
    `);
});

module.exports = router;