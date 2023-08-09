import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { UserType } from "../UserContext";

const UserChat = ({ item }) => {
  const { userId, setUserId } = useContext(UserType);
  const [messages, setMessages] = useState([]); //contains the whole conversection between both users along with who sent a particular message to whome ie. senderId and receipientId
  const navigation = useNavigation();

  //fetch the messages between two users in the chatRoom
  const fetchMessages = async () => {
    try {
      const response = await fetch(
        `http://192.168.0.136:8000/messages/${userId}/${item._id}`
      );
      const data = await response.json();

      if (response.ok) {
        setMessages(data);
      } else {
        console.log("error showing messags", response.status.message);
      }
    } catch (error) {
      console.log("error fetching messages", error);
    }
  };
  useEffect(() => {
    fetchMessages();
  }, []);
  console.log("🚀", messages);

  //here we are only fetching the last 'text' messages
  const getLastMessage = () => {
    const userMessages = messages.filter(
      (message) => message.messageType === "text"
    );

    const n = userMessages.length;

    return userMessages[n - 1]; // this
  };
  const lastMessage = getLastMessage();
  console.log("LastMessage✍️", lastMessage);

  const formatTime = (time) => {
    const options = { hour: "numeric", minute: "numeric" };
    return new Date(time).toLocaleString("en-US", options);
  };
  return (
    // single Pressable representing the Individual friends profile with whome current user has done chating
    <Pressable
      onPress={() =>
        navigation.navigate("Messages", {
          recepientId: item._id, //Id of my friends
        })
      }
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        backgroundColor: "white",
        borderWidth: 2,
        borderColor: "black",
        borderTopWidth: 2,
        borderLeftWidth: 2,
        borderRightWidth: 2,
        paddingHorizontal: 6,
        paddingVertical: 10,
        borderRadius: 17,
        marginTop: 10,
        marginEnd: 5,
        marginStart: 5,
        flex: 1,
      }}
    >
      <Image
        style={{ width: 50, height: 50, borderRadius: 25, resizeMode: "cover" }}
        source={{ uri: item.image }}
      />

      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 15, fontWeight: "500" }}>{item.name}</Text>
        {lastMessage && (
          <Text style={{ marginTop: 3, color: "gray", fontWeight: "500" }}>
            {lastMessage?.message}
          </Text>
        )}
      </View>

      <Pressable
        style={{
          backgroundColor: "white",
          paddingHorizontal: 4,
          paddingVertical: 1,
          borderWidth: 1.6,
          borderRadius: 10,
          borderColor: "black",
        }}
      >
        <Text style={{ fontSize: 11, fontWeight: "500", color: "black" }}>
          {lastMessage && formatTime(lastMessage?.timeStamp)}
        </Text>
      </Pressable>
    </Pressable>
  );
};

export default UserChat;

const styles = StyleSheet.create({});
