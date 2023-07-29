const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
  },
  image: {
    type: String,
    require: true,
  },
  freindRequests: [
    {
      type: mongoose.Schema.Types.ObjectId, // All the freindRequests , Therefore it is in Array [{},{},{}......nth freindRequests]
      ref: "User", // There could be multiple collections in the DataBase so only refere(choose) ObjectID from the "User" collection
    },
  ],
  friends: [
    {
      type: mongoose.Schema.Types.ObjectId, // All the friends=>ObjectID of current user, Therefore it is in Array [{},{},{}......nth friends]
      ref: "User",
    },
  ],
  sentFriendRequests: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
