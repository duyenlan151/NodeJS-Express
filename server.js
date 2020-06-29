const express = require("express");
const app = express();

const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true});

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

// start middlewares
const countCookie = require("./middlewares/countCookie.middleware");
const authMiddleware = require("./middlewares/auth.middleware");
var errorMiddleware = require('./middlewares/error.middleware');
// end middlewares

// set view engine pug
app.set("view engine", "pug");
app.set("views", "./views");

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser(process.env.SECRET));

// start define Router
const booksRoute = require("./routes/books.route");
const usersRoute = require("./routes/users.route");
const transactionsRoute = require("./routes/transactions.route");
const authRoute = require("./routes/auth.route");
var apiRoutes = require("./api/routes/api.route");
// end define Router

// set static files
app.use(express.static("public"));
// app.use(countCookie.countCookie);

// start route
app.get("/", (req, res) => {
  res.render("./index");
});
app.use("/books", booksRoute, errorMiddleware.index);
app.use("/users", usersRoute);
app.use("/transactions", authMiddleware.requireAuth, transactionsRoute);
app.use("/auth", authRoute);
app.use('/api', apiRoutes);
app.get("*", function(req, res) {
  res.render("layouts/404");
});
// end route

// listen for requests :)
app.listen(process.env.PORT, () => {
  console.log("Server listening on port " + process.env.PORT);
});
