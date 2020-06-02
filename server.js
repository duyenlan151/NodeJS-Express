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

// start route  ------->   users
app.get('/users', (req, res)=>{
  var listUsers =  db.get('users').value();
  res.render("users/index", {
    users: listUsers
  })
})

app.get('/users/create', (req, res) => {
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

app.post('/users/create', (req, res) => {
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

app.get('/users/:id/delete', (req, res) => {
  var id = req.params.id;
  var index = db.get('users').indexOf({ id: id}).value();
  db.get('users').splice(index, 1).write();
  
  res.redirect('/users');
});

app.get("/users/search", (req, res) => {
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

// end route  ------->   users

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
