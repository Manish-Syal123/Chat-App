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

app.listen(port, "192.168.0.136", () => {
  // console.log("Server running on port 8000");
  console.log("Server running on http://192.168.0.136");
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

  // save the user to the database ie. in the "User" collection
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

//function to create a token for the user
const createToken = (userId) => {
  // Set the token payload
  const payload = {
    userId: userId,
  };

  // Generate the token with a secret key and expiration time
  const token = jwt.sign(payload, "Q$r2K6W8n!jCW%Zk", { expiresIn: "1h" });

  return token;
};

//enpoint for logging in of that particular user
app.post("/login", (req, resp) => {
  const { email, password } = req.body;

  //check if the email and password are provided
  if (!email || !password) {
    return resp.status(404).json({ message: "Email & Password are required" });
  }

  //check for that user in the database
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        //user not found
        return resp.status(404).json({ message: "User not found" });
      }

      //compare the provided passwords with the password in the database
      if (user.password !== password) {
        return resp.status(404).json({ message: "Invalid Password!" });
      }

      const token = createToken(user._id);
      resp.status(200).json({ token }); //if everything is fine then send the response to the frontend part
    })
    .catch((err) => {
      console.log("error in sending the user", err);
      resp.status(500).json({ message: "Internal server Error!" });
    });
});


//endpoint to access to all the users except the current loggedin user
app.get("/users/:userId", (req, resp) => {
  const loggedInUserId = req.params.userId; //Id of current loggedIn user grabbed from URL=>"/users/:userId"
  //$ne => 'Not' => find all the user details except the current loggedInUserId
  User.find({ _id: { $ne: loggedInUserId } }).then((users) => {
    resp.status(200).json(users)
  }).catch((err) => {
    console.log("Error retrieving users", err);
    resp.status(500).json({ message: "Error retrieving users" });
  })
})
