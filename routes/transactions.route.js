const express = require('express')
const router = express.Router();
const shortid = require('shortid');
const db = require('../db.js');

router.get('/', (req, res) => {
  var tran = db.get('transactions');
  var tranUserId = [];
  tran.value().forEach(tran => tranUserId.push(tran.id));
  
  var list = tranUserId.forEach(id => {
    return db.get('users').find({id: id}).value()
  })
   
   res.render("transactions/index", {
    transactions: db.get('transactions').value()
  })
})

router.get('/create', (req, res) => {
  res.render('transactions/create', {
    users: db.get("users").value(),
    books: db.get("books").value()
  })
})

router.post('/create', (req, res) => {
  req.body.id = shortid.generate();
  db.get('transactions').push(req.body).write();
  res.redirect('/transactions');
})

module.exports = router;