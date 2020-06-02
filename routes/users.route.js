const express = require('express')
const router = express.Router();
const usersController = require('../controllers/users.controller');

router.get('/', usersController.index);
router.get('/create', usersController.create);  
router.post('/create', usersController.postCreate);
router.get('/:id/delete', usersController.delete);
router.get("/search", usersController.search);

module.exports = router;