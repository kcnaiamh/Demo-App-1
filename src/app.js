const express = require('express');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Import routes
const homeRoute = require('./routes/home');
const usersRoute = require('./routes/users');
const healthcheckRoute = require('./routes/healthcheck');

// Use routes
app.use('/', homeRoute)
app.use('/users', usersRoute);
app.use('/healthcheck', healthcheckRoute);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
