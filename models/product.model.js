var mongoose = require('mongoose');

var productSchema = new mongoose.Schema({
  email: String,
  password: String,
  name: String,
  avatar: String,
  phone: String
});

var Product = mongoose.model('Product', productSchema, 'products');
module.exports = Product;