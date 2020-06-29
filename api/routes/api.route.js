var express = require("express");
var router = express.Router();


var prodductsController = require('../controllers/products.controller');
var transactionsController = require('../controllers/transactions.controller');

router.get('/product', prodductsController.index);
router.get('/transaction', transactionsController.index);

module.exports = router;