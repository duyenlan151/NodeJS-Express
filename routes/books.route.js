const express = require('express')
const router = express.Router();


const booksController = require('../controllers/books.controller');

router.get("/", booksController.index);
router.get("/create", booksController.create);
router.post("/create", booksController.postCreate);
router.get('/:id/delete', booksController.delete);
router.get('/view', booksController.view);


module.exports = router;