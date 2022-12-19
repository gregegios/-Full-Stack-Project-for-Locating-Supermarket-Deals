const { application } = require('express');
const express = require('express');
const Sequelize = require('sequelize');
const { Shop , Product , Deal } = require('./new');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
// Use the cors middleware to enable CORS
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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

  

  app.get('/deals', async (req, res) => {
    try {
      let deals = await Deal.findAll();
      res.send({ success: true, deals: deals });
    } catch (error) {
      res.status(500).send({ error: err.message });
    }
  });

  //Get all categories with subcategories and its products
  app.get('/products', function(req, res) {
    Product.findAll().then(products => {
      // Create an empty array to store the hierarchical data
      let hierarchicalData = [];
  
      // Loop through each product
      products.forEach(product => {
        // Check if the category exists in the hierarchical data array
        let categoryIndex = hierarchicalData.findIndex(c => c.name == product.category);
        if (categoryIndex == -1) {
          // If it doesn't, create a new entry for it
          hierarchicalData.push({
            type: "category",
            name: product.category,
            subcategories: []
          });
          categoryIndex = hierarchicalData.length - 1;
        }
  
        // Check if the subcategory exists in the hierarchical data array for the given category
        let subcategoryIndex = hierarchicalData[categoryIndex].subcategories.findIndex(s => s.name == product.subcategory);
        if (subcategoryIndex == -1) {
          // If it doesn't, create a new entry for it
          hierarchicalData[categoryIndex].subcategories.push({
            type: "subcategory",
            name: product.subcategory,
            products: []
          });
          subcategoryIndex = hierarchicalData[categoryIndex].subcategories.length - 1;
        }
  
        // Add the product to the products array in the hierarchical data object
        hierarchicalData[categoryIndex].subcategories[subcategoryIndex].products.push(product);
      });
  
      // Return the hierarchical data array as a JSON response
      res.json(hierarchicalData);
    });
  });

  

  app.get('/deals-by-shop', async (req, res) => {
    try {
    // Find all shops that have deals
    const shopsWithDeals = await Shop.findAll({
    include: [{
    model: Deal,
    include: [{
    model: Product,
    attributes: ['name']
    }]
    }]
    });

    let productsarray = await Product.findAll();
      // Create an empty array to store the hierarchical data
      let hierarchicalData = [];
    
      // Loop through each shop with deals
      shopsWithDeals.forEach(shop => {
        // Only add the shop to the hierarchical data if it has deals
        if (shop.deals.length > 0) {
          hierarchicalData.push({
            shopid: shop.id,
            shopname: shop.name,
            lat: shop.lat,
            long: shop.long,
            type: shop.type,
            deals: shop.deals.map(deal => {
              return {
                id: deal.id,
                price: deal.price,
                likes: deal.likes,
                dislikes: deal.dislikes,
                fk_user: deal.fk_user,
                fk_product: productsarray.filter((product) => product.id == deal.fk_product)[0],  //
                fk_shop: deal.fk_shop,
                createdAt: deal.createdAt
              }
            })
          });
        }
      });
    
      // Return the hierarchical data array as a JSON response
      res.json(hierarchicalData);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
    });
  
  module.exports = app;