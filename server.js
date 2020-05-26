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
const db = low(adapter)

db.defaults({ todos: [] })
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

app.get("/todos/create", (req, res) => {
  res.render("create");
});

app.post("/todos/create", (req, res) => {
  db.get('todoList').push(req.body).write();
  res.redirect("/todos");
});

app.get("/todos", (request, respone) => {
  var q = request.query.q;
  if (q) {
    var matchedTodolist = db.get('todoList').value().filter(
      todo => todo.name.toLowerCase().indexOf(q.toLowerCase()) !== -1
    );
    respone.render("./todos", {
      todoList: matchedTodolist,
      value: q
    });
  } else {
    respone.render("./todos", {
      todoList: db.get('todoList').value()
    });
  }
});

// listen for requests :)
app.listen(process.env.PORT, () => {
  console.log("Server listening on port " + process.env.PORT);
});
