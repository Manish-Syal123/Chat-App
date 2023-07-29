const express = require("express");
const bodyParser = require("body-parser");
const mongose = require("mongoose");
const passport = require("passport"); //Authentican middleware for nodejs
const LocalStrategy = require("passport-local").Strategy; // used for handeling the local username and password authentican inside of our app

const app = express();
const port = 8000;
const cors = require("cors");
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());
const jwt = require("jsonwebtoken");

mongose
  .connect("mongodb+srv://manishsyal:manish@cluster0.ol5jn5a.mongodb.net/", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to Mongo Db");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDb", err);
  });

app.listen(port, () => {
  console.log("Server running on port 8000");
});

const User = require("./models/user");
const Message = require("./models/message");
