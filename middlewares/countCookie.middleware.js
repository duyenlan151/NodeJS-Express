const db = require("../db.js");
const shortid = require("shortid");

var count = 0;
module.exports.countCookie = (req, res, next) => {
  if (!req.cookies) {
    res.cookie("cookie-id", count);
  } else {
    res.cookie("cookie-id", count++);
    console.log(req.cookies);
  }
  next();
};
