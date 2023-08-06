import {
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  Image,
} from "react-native";
import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import { Entypo, MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import EmojiSelector from "react-native-emoji-selector";
import { UserType } from "../UserContext";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const ChatMessagesScreen = () => {
  const [showEmojiSelector, setShowEmojiSelector] = useState(false);
  const [messages, setMessages] = useState([]); //contains the whole conversection between both users
  const [selectedImage, setSelectedImage] = useState("");
  const [recepientData, setRecepientData] = useState(); //stors friend detail to show in header
  const navigation = useNavigation();
  const route = useRoute();
  const { recepientId } = route.params;
  const [message, setMessage] = useState(""); // simple text message typed by the user inside the TextInput field
  const { userId, setUserId } = useContext(UserType); // current userId

  //For toggle between Emoji keyboard
  const handleEmojiPress = () => {
    setShowEmojiSelector(!showEmojiSelector);
  };

  //fetch the messages between two users in the chatRoom
  const fetchMessages = async () => {
    try {
      const response = await fetch(
        `http://192.168.0.136:8000/messages/${userId}/${recepientId}`
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
  //first time -> on refreshing (ie. when we land on this page) we will get all the chats between both the users
  //second time -> whenever the send button is pressed the whole Chats will again gonna rendered on this page again
  useEffect(() => {
    fetchMessages();
  }, []);
  console.log("messages 📝=>", messages);

  //Fetch the friend detail to show in header
  useEffect(() => {
    const fetchRecepientData = async () => {
      try {
        const response = await fetch(
          `http://192.168.0.136:8000/user/${recepientId}`
        );

        const data = await response.json();
        setRecepientData(data);
      } catch (error) {
        console.log("error retrieving details", error);
      }
    };
    fetchRecepientData();
  }, []);
  // console.log("recipientData Header=>", recepientData);

  const handleSend = async (messageType, imageUri) => {
    try {
      const formData = new FormData();
      formData.append("senderId", userId);
      formData.append("recepientId", recepientId);

      //if the message type id image or a normal text
      if (messageType === "image") {
        formData.append("messageType", "image");
        formData.append("imageFile", {
          uri: imageUri,
          name: "image.jpg",
          type: "image/jpeg",
        });
      } else {
        formData.append("messageType", "text");
        formData.append("messageText", message);
      }

      const response = await fetch("http://192.168.0.136:8000/messages", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setMessage("");
        setSelectedImage("");

        //second time -> whenever the send button is pressed the whole Chats will again gonna rendered on this page again
        fetchMessages();
      }
    } catch (error) {
      console.log("error in sending the message", error);
    }
  };

  //To show Person detail in the header to whome we are chating
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerLeft: () => (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          {/* <Ionicons name="arrow-back-circle" size={39} color="black" /> */}
          {/* <Ionicons name="arrow-back-circle-outline" size={39} color="black" /> */}
          <Ionicons
            onPress={() => navigation.goBack()}
            name="arrow-back"
            size={30}
            color="black"
          />

          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image
              style={{
                width: 40,
                height: 40,
                borderRadius: 19,
                resizeMode: "cover",
              }}
              source={{ uri: recepientData?.image }}
            />

            <Text
              style={{
                marginLeft: 10,
                fontSize: 16,
                fontWeight: "bold",
                overflow: "scroll",
              }}
            >
              {recepientData?.name}
            </Text>
          </View>
        </View>
      ),
    });
  }, [recepientData]);

  const formateTime = (time) => {
    const options = { hour: "numeric", minute: "numeric" };
    return new Date(time).toLocaleString("en-US", options);
  };
  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: "#F0F0F0" }}>
      <ScrollView>
        {messages.map((item, index) => {
          if (item.messageType === "text") {
            return (
              <Pressable
                key={index}
                style={[
                  item?.senderId?._id === userId
                    ? {
                        alignSelf: "flex-end",
                        backgroundColor: "#DCF8C6",
                        padding: 8,
                        maxWidth: "60%",
                        borderTopLeftRadius: 9,
                        borderTopRightRadius: 9,
                        borderBottomLeftRadius: 9,
                        margin: 10,
                      }
                    : {
                        alignSelf: "flex-start",
                        backgroundColor: "white",
                        padding: 8,
                        margin: 10,
                        borderTopLeftRadius: 9,
                        borderTopRightRadius: 9,
                        borderBottomLeftRadius: 9,
                        maxWidth: "60%",
                      },
                ]}
              >
                <Text
                  style={{
                    fontSize: 13,
                    textAlign: "left",
                  }}
                >
                  {item?.message}
                </Text>
                <Text
                  style={{
                    textAlign: "right",
                    fontSize: 9,
                    color: "gray",
                    marginTop: 5,
                  }}
                >
                  {formateTime(item.timeStamp)}
                </Text>
              </Pressable>
            );
          }
        })}
      </ScrollView>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 5,
          paddingVertical: 1,
          borderTopWidth: 1,
          borderTopColor: "#dddddd",
          marginBottom: showEmojiSelector ? 0 : 8,
        }}
      >
        <Entypo
          onPress={handleEmojiPress}
          style={{ marginRight: 5 }}
          name="emoji-happy"
          size={24}
          color="gray"
        />
        <TextInput
          value={message}
          onChangeText={(text) => setMessage(text)}
          style={{
            flex: 1,
            height: 40,
            borderWidth: 1.5,
            borderColor: "#dddddd",
            borderRadius: 20,
            paddingHorizontal: 10,
            backgroundColor: "white",
          }}
          placeholder="Type your message..."
        />

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 4,
            paddingVertical: 10,
            borderTopColor: "#dddddd",
            gap: 5,
          }}
        >
          <Entypo name="camera" size={24} color="gray" />
          <Feather name="mic" size={24} color="gray" />
        </View>

        <Pressable onPress={() => handleSend("text")}>
          <MaterialCommunityIcons name="send-circle" size={60} color="green" />
        </Pressable>
      </View>

      {showEmojiSelector && (
        <EmojiSelector
          onEmojiSelected={(emoji) => {
            setMessage((prevMessage) => prevMessage + emoji);
          }}
          //showSearchBar={false}
          style={{ height: 250 }}
        />
      )}
    </KeyboardAvoidingView>
  );
};

export default ChatMessagesScreen;

const styles = StyleSheet.create({});
