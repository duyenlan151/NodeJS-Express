const db = require("../db");
const md5 = require("md5");
const bcrypt = require("bcrypt");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports.login = (req, res) => {
  res.render("auth/login");
};

module.exports.postLogin = (req, res) => {
  var email = req.body.email;
  var password = req.body.password;
  var user = db
    .get("users")
    .find({ email: email })
    .value();
  if (!user) {
    res.render("auth/login", {
      message: "Email address does not exist"
    });
    return;
  }
  if (user.wrongLoginCount) {
    if (user.wrongLoginCount >= 5) {
      console.log(process.env.SENDGRID_API_KEY);
      let msg = {
        to: user.email,
        from: "loanduyen151@gmail.com",
        subject: "Wrong password many times",
        text:
          "You entered wrong password more than 5 times so your account has been locked!",
        html: "<button>Confirm to Reset</button>"
      };
      sgMail
        .send(msg)
        .then(() => {
          console.log("Message sent");
        })
        .catch(error => {
          console.log(error.response.body);
          // console.log(error.response.body.errors[0].message)
        });
      // try{
      //  console.log('sendding mail');
      //  await sgMail.send(msg);
      // }catch(err){
      //  throw err;
      // }
      // res.status(429).send("Too Many Requests");
      res.render("auth/login", {
        message: "Your account has been clocked. Please check your email!"
      });
      return;
    }
  }
  if (!bcrypt.compareSync(password, user.password)) {
    db.get("users")
      .find({ email: email })
      .assign({
        wrongLoginCount: user.wrongLoginCount ? user.wrongLoginCount + 1 : 1
      })
      .write();
    res.render("auth/login", {
      message: "Wrong password",
      value: req.body
    });
    return;
  }

  res.cookie("cookieId", user.id, {
    signed: true
  });
  res.redirect("/transactions");
};
