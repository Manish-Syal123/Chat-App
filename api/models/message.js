const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId, //object ID of Sender (the 'current user' who have already registered in this application) which is Already present in the database
    ref: "User", // There could be multiple collections in the DataBase so only refere(choose) ObjectID from  to the "User" collection
  },
  recepientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  messageType: {
    type: String, // we have only two choice either type:"text" or type:"image"
    enum: ["text", "image"], //this is just the condition that can be appilicable on the above type:"...."
  },
  message: String, //The actual message is gonna store here in String formate
  imageUrl: String, //The actual image URL is gonna store here in String formate
  timeStamp: {
    type: Date,
    default: Date.now,
  },
});

const Message = mongoose.model("Message", messageSchema); //think of this a Pair class you create in Java and it's new objet is created as const data=new User({name:"xyz",......})

module.exports = Message;
