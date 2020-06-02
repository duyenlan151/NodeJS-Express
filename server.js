// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require('express');
const app = express();
const bodyParser = require('body-parser')

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
 
const adapter = new FileSync('db.json')
const db = low(adapter);
const shortid = require('shortid');

db.defaults({ books: [] })
  .write()

// set view engine pug
app.set("view engine", "pug");
app.set("views", "./views");

app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) 
// for parsing application/x-www-form-urlencoded

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.render("./index");
});

// start route  ------->   books
app.get("/books", (request, respone) => {
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
});

app.get("/books/create", (req, res) => {
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
});

app.post("/books/create", (req, res) => {
  var id = req.query.id;
  if(id)
  {
      var books = db.get('books').find({ id: id});
      if(books){
        
      }
      db.get('books')
        .find({id: id})
        .assign(req.body)
        .write();
      res.redirect("/books");
  } else {
    req.body.id = shortid.generate();
    db.get('books').push(req.body).write();
    res.redirect("/books");
  }
  
});

app.get('/books/:id/delete', (req, res) => {
  var id = req.params.id;
  var index = db.get('books').indexOf({ id: id}).value();
  db.get('books').splice(index, 1).write();
  
  res.redirect('/books');
});

app.get('/books/view', (req, res) => {
  var id = req.query.id;
  res.render('books/view', {
    book: db.get('books').find({ id: id}).value()
  })
})
// end route  ------->   books

// listen for requests :)
app.listen(process.env.PORT, () => {
  console.log("Server listening on port " + process.env.PORT);
});
