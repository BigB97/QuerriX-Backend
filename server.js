/* eslint-disable no-console */
require('express-async-errors');
const app = require('express')();

// Mongoose Database Setting
const MongoDB = require('./src/config/mongo-db.config');

const { PORT } = process.env;

// database url
const { MONGODB_URI } = require('./src/config/index');

// Pre-route middlewares
require('./src/middlewares/pre-route.middleware')(app);

// API routes
app.use('/api', require('./src/routes'));

// Ping route for testing connection
app.get('/ping', (req, res) => res.status(200).send("Hello world!, We're changing the world"));

// Error middlewares
require('./src/middlewares/error.middleware')(app);

console.log(MONGODB_URI);
app.listen(PORT, async () => {
  // Initialize MongoDB
  MongoDB(MONGODB_URI);
  // MongoDB(TEST_URL);
  console.log(
    `:::> Server listening on port ${PORT} @ http://localhost:${PORT}`,
  );
});

app.on('error', (error) => {
  console.error(`<::: An error occiurred in our server: \n ${error}`);
});

