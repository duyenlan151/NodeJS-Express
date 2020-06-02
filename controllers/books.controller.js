const db  = require('../db');
const shortid = require('shortid');

module.exports.index = (request, respone) => {
  var q = request.query.q;
  if (q) {
    var matchedBooks = db.get('books').value().filter(
      book => book.title.toLowerCase().indexOf(q.toLowerCase()) !== -1
    );
    respone.render("./books", {
      books: matchedBooks,
      value: q
    });
  } else {
    respone.render("./books", {
      books: db.get('books').value()
    });
  }
}

module.exports.create = (req, res) => {
  var action = req.query.action;
  if(action == 'update'){
    var id = req.query.id;
    var value = db.get('books').find({ id: id}).value();
    res.render("books/create", {
      action: action, 
      value: value
    }); 
  }else {
    res.render("books/create", {
      action: action
    }); 
  }
}

module.exports.postCreate = (req, res) => {
  var id = req.query.id;
  if(id)
  {
      // update
      var books = db.get('books').find({ id: id});
      db.get('books')
        .find({id: id})
        .assign(req.body)
        .write();
      res.redirect("/books");
  } else {
    // create
    req.body.id = shortid.generate();
    db.get('books').push(req.body).write();
    res.redirect("/books");
  }
}

module.exports.delete = (req, res) => {
  var id = req.params.id;
  var index = db.get('books').indexOf({ id: id}).value();
  db.get('books').splice(index, 1).write();
  
  res.redirect('/books');
};

module.exports.view = (req, res) => {
  var id = req.query.id;
  res.render('books/view', {
    book: db.get('books').find({ id: id}).value()
  })
}

