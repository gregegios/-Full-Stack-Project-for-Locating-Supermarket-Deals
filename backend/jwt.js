const jwt = require('jsonwebtoken');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const { User,Shop } = require('./new');
const cors = require('cors');
// Use the cors middleware to enable CORS
app.use(cors());


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/register', async function (req, res) {
    try {
      // Create a new user
      console.log(req.body);
      const user = await User.create(req.body);
      console.log('User registered successfully');
      const token = jwt.sign({username: user.username} , 'secret');
      res.json({
        token: token
      })
    } catch (err) {
      if(error.name=='SequelizeUniqueConstraintError'){
        res.status(409).send({msg:'User already exists', error: err});
      }
      console.error('Error creating user:', err);
      res.status(400).send({msg:'Error creating user', error: err});
    }
  });

  app.post('/login', async function (req, res) {
    try {
      // Check if the user's credentials are correct
      const user = await User.findOne({
        where: {
          username: req.body.username,
          password: req.body.password
        }
      });
      if (user) {
        // Generate a JWT for the user
        const token = jwt.sign({ username: user.username }, 'secret');
  
        // Log the user in
        console.log('User logged in successfully');
        res.send({ token:token, userID:user.username });
      } else {
        // Return an error if the user's credentials are invalid
        console.error('Invalid username or password');
        res.status(401).send({"msg":"Invalid username or password"});
      }
    } catch (err) {
      console.error('Error logging in:', err);
      res.status(500).send({"msg":"Error logging in"});
    }
  });

// Create a middleware function to validate JWTs
const validateJWT = (req, res, next) => {
    // Get the JWT from the request header
    const token = req.headers['x-access-token'];
  
    // If a token was provided, validate it
    if (token) {
      // Verify the JWT and decode its payload
      jwt.verify(token, 'secret', (err, decoded) => {
        if (err) {
          // If the token is invalid, return an error
          return res.json({
            success: false,
            error: 'Invalid token',
          });
        } else {
          // If the token is valid, save the decoded
          // payload to the request object
          req.decoded = decoded;
  
          // Continue to the next middleware function
          next();
        }
      });
    } else {
      // If no token was provided, return an error
      return res.status(403).send({
        success: false,
        error: 'No token provided',
      });
    }
  };

// Create a new route to handle password change requests
app.post('/change-password', validateJWT, async (req, res) => {
    try {
      // If the request has a valid JWT, the decoded payload
      // will be available on the request object
      const userId = req.decoded.username;
  
      // Get the new password from the request body
      const newPassword = req.body.newPassword;
  
      // Change the user's password (in this example, we are just
      // assuming that this operation is asynchronous and
      // returns a promise)
      const changedPassword = await User.update(
        { password: newPassword },
        { where: { username: userId } }
      );
  
      // Send a success response
      res.json({
        success: true,
        changedPassword: changedPassword,
      });
    } catch (err) {
      // If an error occurred, send a failure response
      res.json({
        success: false,
        error: err.message
    })
}});

app.post('/change-username', validateJWT, async (req, res) => {
  try {
    // If the request has a valid JWT, the decoded payload
    // will be available on the request object
    const userId = req.decoded.username;

    // Get the new username from the request body
    const newUsername = req.body.newUsername;

    // Change the user's username (in this example, we are just
    // assuming that this operation is asynchronous and
    // returns a promise)
    const changedUsername = await User.update(
      { username: newUsername },
      { where: { username: userId } }
    );

    // Send a success response
    res.json({
      success: true,
      changedUsername: changedUsername,
    });
  } catch (err) {
    // If an error occurred, send a failure response
    res.json({
      success: false,
      error: err.message
  })
}});

app.get('/shops', async (req, res) => {
  try {
    // retrieve a list of all shops from the database
    const shops = await Shop.findAll();

    // send the list of shops as the response
    res.json(shops);
  } catch (err) {
    // if an error occurred, send an error response
    res.status(500).send({ error: err.message });
  }
});

module.exports = app;