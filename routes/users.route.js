const express = require('express')
const router = express.Router();
const shortid = require('shortid');
const db = require('../db.js');

router.get('/', (req, res)=>{
  var listUsers =  db.get('users').value();
  res.render("users/index", {
    users: listUsers
  })
})

router.get('/create', (req, res) => {
  var id = req.query.id;
  var action  = req.query.action;
  if(id){
    res.render('users/create', {
      action: action,
      value: db.get('users').find({ id: id}).value()
    })  
  }else{
    res.render('users/create');    
  }
})  

router.post('/create', (req, res) => {
  var id = req.query.id;
  if(id){
    db.get('users')
        .find({id: id})
        .assign(req.body)
        .write();
    res.redirect('/users');
  }else{
    req.body.id = shortid.generate();
    db.get('users').push(req.body).write();
    res.redirect('/users'); 
  }
});

router.get('/:id/delete', (req, res) => {
  var id = req.params.id;
  var index = db.get('users').indexOf({ id: id}).value();
  db.get('users').splice(index, 1).write();
  
  res.redirect('/users');
});

router.get("/search", (req, res) => {
  var q = req.query.q;
  if(q){
     var matchedUser= db.get('users').value().filter(
      user => user.name.toLowerCase().indexOf(q.toLowerCase()) !== -1
    );
    res.render("users/index", {
      users: matchedUser
    })
  }else {
    res.render("users/index", {
      users: db.get('users').value()
    });
  }
})

module.exports = router;