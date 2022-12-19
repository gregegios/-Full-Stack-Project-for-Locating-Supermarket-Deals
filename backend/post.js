const { application } = require('express');
const express = require('express');
const Sequelize = require('sequelize');
const { Shop , Product , Deal , Review} = require('./new');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
// Use the cors middleware to enable CORS
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/deals/review', async (req, res) => {
  try {
    // Find the deal with the specified id
    const deal = await Deal.findByPk(req.body.dealId);

    // Check if the user has already liked the deal
    const existingReview = await Review.findOne({
      where: {
        vote: true,
        fk_user: req.body.fk_user,
        fk_deal: req.body.dealId,
      },
    });

    if (existingReview) {
      // Return an error if the user has already liked the deal
       res.status(400).json({
        success: false,
        message: 'You have already liked this deal',
      });
      return
    }

    // Increment the likes or dislikes field, depending on the value of the vote parameter
    if (req.body.vote === 'like') {
      deal.likes += 1;
    } else if (req.body.vote === 'dislike') {
      deal.dislikes += 1;
    }

    // Create a new review entry
    const review = await Review.create({
      vote: req.body.vote === 'like',
      date: new Date(),
      fk_user: req.body.fk_user,
      fk_deal: req.body.dealId,
    });

    // Save the updated deal to the database
    await deal.save();

    // Return a success response
    res.json({
      success: true,
    });
  } catch (error) {
    // Handle errors
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});
  
  
  
  

  app.post("/create_deal", async (req, res) => {
    try {
    // Extract the information about the new deal from the request body
    const { price, fk_user, fk_product, fk_shop } = req.body;
    
    
    // Set default values for likes and dislikes
    const likes = 0;
    const dislikes = 0;
    
    // Get the shop with the provided fk_shop id
    const shop = await Shop.findOne({ where: { id: fk_shop } });
    
    // Get all shops with the same name as the provided shop
    const sameNameShops = await Shop.findAll({ where: { name: shop.name } });
    
    // Create the new deal using the provided information
    const newDeal = await Deal.create({
      price,
      likes,
      dislikes,
      fk_user,
      fk_product,
      fk_shop
    });
    
    // For each shop with the same name, create a new deal with the same information
    for (let i = 0; i < sameNameShops.length; i++) {
      await Deal.create({
        price,
        likes,
        dislikes,
        fk_user,
        fk_product,
        fk_shop: sameNameShops[i].id
      });
    }
    
    // Send a response to the client with the new deal
    res.json({ deal: newDeal });
  } catch (error) {
    // If there was an error, send a response to the client with the error
    res.status(500).json({ error: error.message });
    }
    });

    //update product from admin page endpoint
    app.post("/products/:id", async (req, res) => {
      try {
        // Get the product ID from the request parameters
        const productId = req.params.id;
        // Get the updated product data from the request body
        const { name, category, subcategory } = req.body;
    
        // Update the product in the database
        const updatedProduct = await Product.update(
          { name, category, subcategory },
          { where: { id: productId } }
        );
        const updatedProduct1 = await Product.findByPk(productId);
        // Send the updated product data as the response
        res.json(updatedProduct1);
      } catch (error) {
        // Handle any errors that occurred during the update
        console.error(error);
        res.status(500).send(error.message);
      }
    });

    //delete product from admin page endpoint
    app.delete("/products/:id", async (req, res) => {
      try {
        // Get the product ID from the request parameters
        const productId = req.params.id;
        
        // Delete the product from the database
        const updatedProduct = await Product.destroy(
          { where: { id: productId } }
        );
        const updatedProduct1 = await Product.findByPk(productId);
        // Send the updated product data as the response
        res.json(updatedProduct1);
      } catch (error) {
        // Handle any errors that occurred during the update
        console.error(error);
        res.status(500).send(error.message);
      }
    });

    app.post("/addproduct", async (req, res) => {
      try {
        // Get the product data from the request body
        const { id, name, category, subcategory } = req.body;
    
        // Check if a product with the specified ID already exists
        const existingProduct = await Product.findByPk(id);
        if (existingProduct) {
          // If a product with the specified ID already exists, send a response with an error message
          res.status(400).send("A product with the specified ID already exists");
          return;
        }
    
        // Create a new product in the database
        const newProduct = await Product.create({ id, name, category, subcategory });
        
        // Send the new product data as the response
        res.json(newProduct);
      } catch (error) {
        // Handle any errors that occurred during the creation of the product
        console.error(error);
        res.status(500).send(error.message);
      }
    });

  module.exports = app;


