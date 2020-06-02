
const shortid = require('shortid');
const db = require('../db.js');

module.exports.index = (req, res) => {
  var tran = db.get('transactions');
  var tranUserId = [];
  tran.value().forEach(tran => tranUserId.push(tran.id));
  
  var list = tranUserId.forEach(id => {
    return db.get('users').find({id: id}).value()
  })
   
   res.render("transactions/index", {
    transactions: db.get('transactions').value()
  })
}

module.exports.create = (req, res) => {
  res.render('transactions/create', {
    users: db.get("users").value(),
    books: db.get("books").value()
  })
}

module.exports.postCreate = (req, res) => {
  req.body.id = shortid.generate();
  req.body.isComplete = false;
  db.get('transactions').push(req.body).write();
  res.redirect('/transactions');
}

module.exports.isComplete = (req, res) => {
  var id = req.params.id;
  var check = db.get('transactions').find({id: id}).value();
  db.get('transactions')
    .find({id: id})
    .assign({ isComplete: !check.isComplete})
    .write();
  res.redirect('/transactions');
}

