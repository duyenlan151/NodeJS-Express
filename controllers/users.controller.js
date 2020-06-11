const shortid = require("shortid");
const db = require("../db.js");
const md5 = require("md5");
const bcrypt = require("bcrypt");
const saltRounds = 10;

module.exports.index = (req, res) => {
  var listUsers = [];
  //if (req.cookies.cookieId) {
  // listUsers.push(
  //   db
  //     .get("users")
  //    .find({ id: req.cookies.cookieId })
  //    .value()
  // );
  // console.log(listUsers[0].name);
  // res.render("users/index", {
  //   users: listUsers
  // });
  //}

  var page = parseInt(req.query.page) || 1;
  var perPage = 3;

  var start = (page - 1) * perPage;
  var end = page * perPage;
  res.render("users/index", {
    users: db.get("users").slice(start, end).value()
  });
};

module.exports.create = (req, res) => {
  var id = req.query.id;
  var action = req.query.action;
  if (id) {
    res.render("users/create", {
      action: action,
      value: db
        .get("users")
        .find({ id: id })
        .value()
    });
  } else {
    res.render("users/create");
  }
};

module.exports.postCreate = (req, res) => {
  var id = req.query.id;
  if (id) {
    db.get("users")
      .find({ id: id })
      .assign(req.body)
      .write();
    res.redirect("/users");
  } else {
    req.body.id = shortid.generate();
    // req.body.password = md5(req.body.password);
    const salt = bcrypt.genSaltSync(saltRounds);
    req.body.password = bcrypt.hashSync(req.body.password, saltRounds);
    db.get("users")
      .push(req.body)
      .write();
    res.redirect("/users");
  }
};

module.exports.delete = (req, res) => {
  var id = req.params.id;
  var index = db
    .get("users")
    .indexOf({ id: id })
    .value();
  db.get("users")
    .splice(index, 1)
    .write();

  res.redirect("/users");
};

module.exports.search = (req, res) => {
  var q = req.query.q;
  if (q) {
    var matchedUser = db
      .get("users")
      .value()
      .filter(user => user.name.toLowerCase().indexOf(q.toLowerCase()) !== -1);
    res.render("users/index", {
      users: matchedUser
    });
  } else {
    res.render("users/index", {
      users: db.get("users").value()
    });
  }
};
