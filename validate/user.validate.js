const db = require('../db.js');
module.exports.postCreate = (req, res, next) => {
  var name = req.body.name;
  if(name.length > 30){
    res.render('users/index', {
      users: db.get('users').value(),
      message: "Length of name must shorter than 30 character!"      
    })
    return;
  }
  next();
}