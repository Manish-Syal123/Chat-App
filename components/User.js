import { Pressable, StyleSheet, Text, View, Image } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { UserType } from "../UserContext";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
//All Users are shown on home page(swift chat) those who are using(loggedIn to) this app
const User = ({ item }) => {
  const { userId, setUserId } = useContext(UserType);
  const [requestSent, setRequestSent] = useState(false); //for changing the button value from 'Add friend' => 'Request sent'
  const [friendRequests, setFriendRequests] = useState([]); // to whome we have sent friend requests and they haven't accept yet
  const [userFriends, setUserFriends] = useState([]); // All the friends of current user

  useEffect(() => {
    const fetchFriendRequests = async () => {
      try {
        const response = await fetch(
          `http://192.168.0.136:8000/friend-requests/sent/${userId}`
        );

        const data = await response.json();

        if (response.ok) {
          setFriendRequests(data);
        } else {
          console.log("error", response.status);
        }
      } catch (err) {
        console.log("error", err);
      }
    };

    fetchFriendRequests();
  }, []);

  useEffect(() => {
    const fetchUserFriends = async () => {
      try {
        const response = await fetch(
          `http://192.168.0.136:8000/friends/${userId}`
        );
        const data = await response.json();

        if (response.ok) {
          setUserFriends(data);
        } else {
          console.log("error retrieving user friends", response.status);
        }
      } catch (err) {
        console.log("Error message", err);
      }
    };

    fetchUserFriends();
  }, []);

  const sendFriendRequest = async (currentUserId, selectedUserId) => {
    try {
      const response = await fetch("http://192.168.0.136:8000/friend-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ currentUserId, selectedUserId }),
      });

      if (response.ok) {
        setRequestSent(true);
      }
    } catch (error) {
      console.log("error message", error);
    }
  };
  console.log("friend requests sent ☠️", friendRequests);
  console.log("user friends 🦾", userFriends);
  return (
    <Pressable
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 10,
      }}
    >
      <View
      // style={{
      //   padding: 3,
      //   borderWidth: 5,
      //   borderColor: "black",
      //   borderRadius: 37,
      // }}
      >
        <Image
          style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            resizeMode: "cover",
          }}
          source={{ uri: item.image }}
        />
      </View>

      <View style={{ marginLeft: 12, flex: 1 }}>
        <Text style={{ fontWeight: "bold" }}>{item.name}</Text>
        <Text style={{ marginTop: 4, color: "gray" }}>{item.email}</Text>
      </View>

      {/* toggle Button to "Add Friend", "Friend" & "Request Sent"*/}
      {userFriends.includes(item._id) ? (
        <Pressable
          style={{
            backgroundColor: "#ffc107",
            // padding: 10,
            // width: 105,
            padding: 10,
            width: 50,
            borderRadius: 25,
            alignItems: "center",
          }}
        >
          {/* <Text style={{ textAlign: "center", color: "white" }}>Friends</Text> */}
          <FontAwesome5 name="user-check" size={24} color="black" />
        </Pressable>
      ) : requestSent ||
        friendRequests.some((friend) => friend._id === item._id) ? (
        <Pressable
          style={{
            backgroundColor: "#0dd18f",
            padding: 10,
            width: 105,
            borderRadius: 12,
            alignItems: "center",
          }}
        >
          <Text style={{ textAlign: "center", color: "white", fontSize: 13 }}>
            Request Sent
          </Text>
        </Pressable>
      ) : (
        <Pressable
          onPress={() => sendFriendRequest(userId, item._id)}
          style={{
            // backgroundColor: "#82CD47",
            backgroundColor: "#095869",
            padding: 5,
            borderRadius: 12,
            width: 105,
            alignItems: "center",
          }}
        >
          {/* <Text style={{ textAlign: "center", color: "black", fontSize: 13 }}>
            Add Friend
          </Text> */}
          <Ionicons name="person-add" size={24} color="white" />
        </Pressable>
      )}
    </Pressable>
  );
};

export default User;

const styles = StyleSheet.create({});
