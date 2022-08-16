//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/internDB", {
  useNewUrlParser: true
});

const internSchema = {
  email: String,
  password: String
};

const Intern = new mongoose.model("Intern", internSchema);

app.get("/", function(req, res) {
  res.render("home");
});

app.get("/login", function(req, res) {
  res.render("login");
});

app.get("/register", function(req, res) {
  res.render("register");
});

app.get("/logout", function(req, res) {
  res.redirect("/");
});

app.post("/register", function(req, res) {
  const username = req.body.username;
  Intern.findOne({
    email: username
  }, function(err, foundUser) {
    if (err) {
      console.log(err);
    } else if (foundUser) {
      let errors = [];
      errors.push({text: "Email already exist!"});
      console.log(errors);
      res.render("register");
    } else {
      bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        const newUser = new Intern({
          email: req.body.username,
          password: hash
        });
        newUser.save(function(err) {
          if (err) {
            console.log(err);
          } else {
            res.render("end");
          }
        });
      });
    }
  });
});

app.post("/login", function(req, res) {
  const username = req.body.username;
  const password = req.body.password;

  Intern.findOne({
    email: username
  }, function(err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      bcrypt.compare(password, foundUser.password, function(err, result) {
        if (result === true) {
          res.render("end");
        }
      });
    }
  });
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
