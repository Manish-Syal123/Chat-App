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
// get api =>to read data through api or from database
// Post api =>to save(push) new data into database
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
  User.find({ _id: { $ne: loggedInUserId } })
    .then((users) => {
      resp.status(200).json(users);
    })
    .catch((err) => {
      console.log("Error retrieving users", err);
      resp.status(500).json({ message: "Error retrieving users" });
    });
});

//endpoint to send a request to a user
app.post("/friend-request", async (req, resp) => {
  const { currentUserId, selectedUserId } = req.body;

  try {
    //update the recepient's(the person who is receiving the request) friendRequestsArray! , he will have the choice to 'Accept' it
    await User.findByIdAndUpdate(selectedUserId, {
      $push: { freindRequests: currentUserId },
    });

    //update the sender's sentFriendRequests array
    await User.findByIdAndUpdate(currentUserId, {
      $push: { sentFriendRequests: selectedUserId },
    });

    resp.sendStatus(200);
  } catch (error) {
    resp.sendStatus(500);
  }
});

//endpoint to show all the friend-requests of a particular user
app.get("/friend-request/:userId", async (req, resp) => {
  try {
    const { userId } = req.params; //current userId

    //fetch the user document based on the User id
    const user = await User.findById(userId)
      .populate("freindRequests", "name email image")
      .lean();

    const freindRequests = user.freindRequests;

    resp.json(freindRequests);
  } catch (error) {
    console.log(error);
    resp.status(500).json({ message: "Internal Server Error" });
  }
});

//endpoint to accept a friend-request of a particular person
app.post("/friend-request/accept", async (req, resp) => {
  try {
    const { senderId, recepientId } = req.body; // I am the receiver and sender is the other person

    //retrieve the documents(object or details) of sender and the recipient
    const sender = await User.findById(senderId);
    const recepient = await User.findById(recepientId);

    // those who are Accepted as a friend there Id's are stored into the 'friends array' of both sender and receiver , and only those people can chat with each other
    sender.friends.push(recepientId); //its the current user
    recepient.friends.push(senderId); //other person

    // 'I am the receiver here' and I have Accepted the senders request, so Update my freindRequests array
    recepient.freindRequests = recepient.freindRequests.filter(
      (request) => request.toString() !== senderId.toString()
    );

    // 'Sender is the other person here' As I have Accepted its request so I have to update the senders(other persons) sentFriendRequests array
    sender.sentFriendRequests = sender.sentFriendRequests.filter(
      (request) => request.toString() !== recepientId.toString()
    );

    await sender.save();
    await recepient.save();

    resp.status(200).json({ message: "Friend Request accepted successfully" });
  } catch (error) {
    console.log(error);
    resp.status(500).json({ message: "Internal Server Error" });
  }
});

//endpoint to access all the 'friends'(friends array) of the current loggedIn user!
app.get("/accepted-friends/:userId", async (req, resp) => {
  try {
    const { userId } = req.params;
    //find the current user , then inside the friends array Populate on each ID and grab there name,email,image
    const user = await User.findById(userId).populate(
      "friends",
      "name email image"
    );

    const acceptedFriends = user.friends;
    resp.json(acceptedFriends); //array of accepted friends
  } catch (error) {
    console.error(error);
    resp.status(500).json({ error: "Internal Server Error" });
  }
});

const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "files/"); // Specify the desired destination folder
  },
  filename: function (req, file, cb) {
    // Generate a unique filename for the uploaded file
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

//endpoint to post Messages and store it in the backend inside 'Message' Collection(model)
app.post("/messages", upload.single("imageFile"), async (req, resp) => {
  try {
    const { senderId, recepientId, messageType, messageText } = req.body;

    //This below message structure(Schema) is already defined in ("./models/message")
    //this newMessage will get store inside the 'Message' Collection(model) as a new object
    const newMessage = new Message({
      senderId,
      recepientId,
      messageType,
      message: messageText,
      timeStamp: new Date(),
      imageUrl: messageType === "image" ? req.file.path : null, //when messageType is "image" then only it will gonna filled up with the imageURL
    });

    await newMessage.save();
    resp.status(200).json({ message: "Message sent Successfully" });
  } catch (error) {
    console.log(error);
    resp.status(500).json({ error: "Internal Server Error" });
  }
});

//endpoint to get the userDetails to design the chat Room header
//To show Person detail in the header to whome we are chating
app.get("/user/:userId", async (req, resp) => {
  try {
    const { userId } = req.params;

    //fetch the user data from the user ID
    const recepientId = await User.findById(userId);
    resp.json(recepientId);
  } catch (error) {
    console.log(error);
    resp.status(500).json({ error: "Internal Server Error" });
  }
});

//endpoint to fetch the messages between two users in the chatRoom which we have already stored inside the Database of message Collection
app.get("/messages/:senderId/:recepientId", async (req, resp) => {
  try {
    const { senderId, recepientId } = req.params;

    const messages = await Message.find({
      //'sor' operator, which performs a logical OR operation. The query looks for messages where either....(conditions):This way, the query retrieves messages sent by senderId to recepientId and messages sent by recepientId to senderId, effectively getting the entire conversation between the two users.
      $or: [
        { senderId: senderId, recepientId: recepientId },
        { senderId: recepientId, recepientId: senderId },
      ],
    }).populate("senderId", "_id name");

    resp.json(messages);
  } catch (error) {
    console.log(error);
    resp.status(500).json({ error: "Internal Server Error" });
  }
});
