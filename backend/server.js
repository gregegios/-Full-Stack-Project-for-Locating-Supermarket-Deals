const express = require('express');
const app = express();
const cors = require('cors');
// Use the cors middleware to enable CORS
app.use(cors());

// Import the app objects from the get.js, post.js, and jwt.js files
const get = require('./get');
const post = require('./post');
const jwt = require('./jwt');

// Set up routes for each of the endpoints
app.use('/', get);
app.use('/', post);
app.use('/', jwt);

// Start the server on port 3000
app.listen(3000, () => {
  console.log('Server listening on port 3000...');
});