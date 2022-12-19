const { Sequelize, Model, DataTypes } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
});

const testDataBase = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

testDataBase()

const User = sequelize.define("user", {
    username: {
        type: Sequelize.TEXT,
        primaryKey: true
    },
    password: DataTypes.TEXT,
    email: DataTypes.TEXT,
    tokens: DataTypes.INTEGER,
    totalPoints: DataTypes.INTEGER,
    Points: DataTypes.INTEGER,
    Admin: DataTypes.BOOLEAN,
})

const Product = sequelize.define("product", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    name: DataTypes.TEXT,
    category: DataTypes.TEXT,
    subcategory: DataTypes.TEXT,
    image: DataTypes.BLOB
})



const Deal = sequelize.define("deal", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    price: DataTypes.FLOAT,
    likes: DataTypes.INTEGER,
    dislikes: DataTypes.INTEGER,
    fk_user: DataTypes.TEXT,
    fk_product: DataTypes.INTEGER,
    fk_shop: DataTypes.INTEGER,
})

const Review = sequelize.define("review", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    vote: DataTypes.BOOLEAN,
    dates: DataTypes.DATE,
    fk_user: DataTypes.TEXT,
    fk_deal: DataTypes.INTEGER
})

const Shop = sequelize.define("shop", {
    id: {
        type: Sequelize.TEXT,
        primaryKey: true
    },
    name: DataTypes.TEXT,
    lat: DataTypes.FLOAT,
    long: DataTypes.FLOAT,
    type: DataTypes.TEXT
})

const Prices = sequelize.define("prices", {
    dates: DataTypes.DATE,
    prices: DataTypes.FLOAT,
    fk_product: DataTypes.INTEGER
})

//Assosiations
Deal.hasMany(Review, {
    foreignKey: 'fk_deal'
});
Review.belongsTo(Deal);

User.hasMany(Deal, {
    foreignKey: 'fk_user'
});
Deal.belongsTo(User);

User.hasMany(Review, {
    foreignKey: 'fk_user'
});
Review.belongsTo(User);

Product.hasMany(Deal, {
    foreignKey: 'fk_product'
});
Deal.belongsTo(Product);

Shop.hasMany(Deal, {
    foreignKey: 'fk_shop'
});
Deal.belongsTo(Shop);

Product.hasMany(Prices, {
    foreignKey: 'fk_product'
});
Prices.belongsTo(Product);


// const userData = [
//     { username: 'user1', email: 'user1@example.com', password: 'password1', tokens: 0, totalPoints: 0, points: 0, admin: false },
//     { username: 'user2', email: 'user2@example.com', password: 'password2', tokens: 0, totalPoints: 0, points: 0, admin: false },
//     { username: 'user3', email: 'user3@example.com', password: 'password3', tokens: 0, totalPoints: 0, points: 0, admin: false },
//     { username: 'user4', email: 'user4@example.com', password: 'password4', tokens: 0, totalPoints: 0, points: 0, admin: false },
//     { username: 'user5', email: 'user5@example.com', password: 'password5', tokens: 0, totalPoints: 0, points: 0, admin: true },
//   ];
  
//   await User.bulkCreate(userData);

// const json_product = require("./pro_new.json")
// Product.bulkCreate(json_product.products)

// const json_prices = require("./output_1324_24_1670170315.json")
// let prices_array = []
// json_prices.data.forEach(product => {
//     product.prices.forEach(price => {
//         prices_array.push({
//             dates: price.date,
//             prices: price.price,
//             fk_product: product.id
//         })
//     })

// });
// // console.log(prices_array)
// // Prices.bulkCreate(prices_array)

// const geoJSON = require('./export.json')
// let Shops_array = []
// geoJSON.features.forEach(shop => {
//     Shops_array.push({
//         id: shop.id.replace(/[^0-9\.]+/g, ""),
//         name: shop.properties.name,
//         lat: shop.geometry.coordinates[0],
//         long: shop.geometry.coordinates[1],
//         type: shop.properties.shop

//     })
// })
// console.log(Shops_array)
// Shop.bulkCreate(Shops_array);



// (async () => {
//     await sequelize.sync();
// })();


// //create a deal for every product
// let createDeals = async () => {
//     let products = await Product.findAll();
//     let shops = await Shop.findAll();
  
//     products.forEach( async (product) => {
//       let prices = await Prices.findAll({
//           where: {
//               fk_product: product.id
//           }
//       });
  
//       // calculate average price
//       let meanPrice = prices.reduce((sum, price) => sum + price.prices, 0) / prices.length;
  
//       [1].forEach( async()=> {
//         // create a deal for the product
//         let deal = await Deal.create({
//           price: (meanPrice - meanPrice * Math.random()/3).toFixed(2) ,
//           likes: Math.floor(Math.random() * 100), // Random number of likes
//           dislikes: Math.floor(Math.random() * 100), // Random number of dislikes
//           fk_product: product.id,
//           fk_shop:  shops[ Math.floor(  Math.random() * shops.length )].id
//         });
//       });
//     });
//   }

// createDeals()



module.exports = { User, Product, Deal, Review, Shop, sequelize }