const db = require("../db.js");
const shortid = require("shortid");


module.exports.requireAuth = (req, res, next) => {
  if (!req.signedCookies.cookieId) {
    res.redirect("/auth/login");
    return;
  }
  var id = req.signedCookies.cookieId;
  var user = db.get("users").find({ id: id }).value();
  if (!user) {
    res.redirect("/auth/login");
    return;
  }
  res.locals.user = user;
  next();
};
