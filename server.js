// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const app = express();
var bodyParser = require('body-parser')

var todoList = [
  {
    id: 1,
    name: "Đi học"
  },
  {
    id: 2,
    name: "Nấu Cơm"
  },
  {
    id: 3,
    name: "Rửa bát"
  },
  {
    id: 4,
    name: "Học code tại CodersX"
  }
];
// set view engine pug
app.set("view engine", "pug");
app.set("views", "./views");

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.render("./index");
});

app.get('/todos/create', (req, res) => {
  res.render('create');
});
app.post('/todos/create', (req, res) => {
  todoList.push(req.body);
  res.redirect('/todos');
});

app.get("/todos", (request, respone) => {
  var q = request.query.q;
  if (q) {
    var matchedTodolist = todoList.filter(
      todo => todo.name.toLowerCase().indexOf(q.toLowerCase()) !== -1
    );
    respone.render("./todos", {
      todoList: matchedTodolist,
      value: q
    });
  } else {
    respone.render("./todos", {
      todoList: todoList
    });
  }
});

// listen for requests :)
app.listen(process.env.PORT, () => {
  console.log("Server listening on port " + process.env.PORT);
});
