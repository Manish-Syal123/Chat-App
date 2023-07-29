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

//endPoint for registeration
// get api =>to read data through api
// Post api =>to save new data into database
// Put api =>to update data
// delete api =>to delete data through api

app.post("/regester", (req, res) => {
  // "/register": This is the URL path of the route. In this case, the path is "/register," meaning that the route will be triggered when a POST request is made to the "/register" URL of the server.
  const { name, email, password, image } = req.body; // whatever details user has entered in the register page and pressed the "Register button" is considered as the request to the server

  //create a new User object
  const newUser = new User({ name, email, password, image });

  // save the user to the database ie. to the "User" collection
  newUser
    .save()
    .then(() => {
      res.status(200).json({ message: "User registered successfully" }); // sending a message responce back to user
    })
    .catch((err) => {
      console.log("Error registering the user", err);
      res.status(500).json({ message: "Error registering the user" });
    });
});
