const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');

// instead of defining schema and models here, we isolate them in /models folder
const Product = require('./models/product');

// connect to MongoDB, farmStand db will automatically be created
mongoose
  .connect('mongodb://localhost:27017/farmStand', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('MONGO CONNECTION OPEN!!!');
  })
  .catch((err) => {
    console.log('OH NO MONGO CONNECTION ERROR!!!!');
    console.log(err);
  });

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// ************
// MIDDLEWARE
// ************

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

const categories = ['fruit', 'vegetable', 'dairy'];
// **********
// ROUTES
// **********

// GET the list of products
app.get('/products', async (req, res) => {
  const products = await Product.find({});
  res.render('products/index', { products });
});

// render a form for adding a new product
app.get('/products/new', (req, res) => {
  res.render('products/new', { categories });
});

// POST a new product
app.post('/products', async (req, res) => {
  const newProduct = new Product(req.body);
  await newProduct.save();
  console.log(newProduct);
  res.redirect(`/products/${newProduct._id}`);
});

// get a specific product by id
app.get('/products/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);
  console.log(product);
  res.render('products/show', { product });
});

// render a form for editing a product
app.get('/products/:id/edit', async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.render('products/edit', { product, categories });
});

// PUT product update
app.put('/products/:id', async (req, res) => {
  console.log(req.body);
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    runValidators: true,
    new: true,
  });
  res.redirect(`/products/${product._id}`);
});

app.listen(3000, () => {
  console.log('APP IS LISTENING ON PORT 3000!');
});
