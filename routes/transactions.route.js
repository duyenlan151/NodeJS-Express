const express = require('express')
const router = express.Router();
const transactionsController = require('../controllers/transactions.controller');

router.get('/', transactionsController.index);
router.get('/create', transactionsController.create);
router.post('/create', transactionsController.postCreate);
router.get('/:id/complete', transactionsController.isComplete);

module.exports = router;