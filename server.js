const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// set view engine pug
app.set("view engine", "pug");
app.set("views", "./views");

app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) 

// start define Router
const booksRoute = require('./routes/books.route');
const usersRoute = require('./routes/users.route');
const transactionsRoute = require('./routes/transactions.route');
// end define Router

// start route 
app.get("/", (request, response) => {
  response.render("./index");
});
 
app.use('/books', booksRoute);
app.use('/users', usersRoute);
app.use('/transactions', transactionsRoute);
// end route  

// listen for requests :)
app.listen(process.env.PORT, () => {
  console.log("Server listening on port " + process.env.PORT);
});
