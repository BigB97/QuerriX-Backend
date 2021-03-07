/* eslint-disable no-console */
require('dotenv').config();
require('express-async-errors');
const app = require('express')();
// Mongoose Database Setting
const MongoDB = require('./config/mongo-db.config');

const { PORT, MONGODB_URI } = process.env;

// Pre-route middlewares
require('./middlewares/pre-route.middleware')(app);

// API routes
app.use('/api', require('./routes'));

// Ping route for testing connection
app.get('/', (req, res) => res.status(200).send("Hello world!, We're changing the world"));

// Error middlewares
require('./middlewares/error.middleware')(app);

app.listen(PORT || 3000, async () => {
  // Initialize MongoDB
  MongoDB(MONGODB_URI);
  console.log(
    `:::> Server listening on port ${PORT} @ http://localhost:${PORT}`,
  );
});

app.on('error', (error) => {
  console.error(`<::: An error occiurred in our server: \n ${error}`);
});
