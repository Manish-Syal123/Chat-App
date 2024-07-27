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
import React, {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Entypo, MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import EmojiSelector from "react-native-emoji-selector";
import { UserType } from "../UserContext";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  Ionicons,
  MaterialIcons,
  FontAwesome,
  FontAwesome5,
} from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as Clipboard from "expo-clipboard";

const ChatMessagesScreen = () => {
  const [showEmojiSelector, setShowEmojiSelector] = useState(false);
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [messages, setMessages] = useState([]); //contains the whole conversection between both users
  const [selectedImage, setSelectedImage] = useState("");
  const [recepientData, setRecepientData] = useState(); //stors friend detail to show in header
  const [clipboardText, setClipboardText] = useState([]); //-
  const navigation = useNavigation();
  const route = useRoute();
  const { recepientId } = route.params;
  const [message, setMessage] = useState(""); // simple text message typed by the user inside the TextInput field
  const { userId, setUserId } = useContext(UserType); // current userId

  const scrollViewRef = useRef(null);
  useEffect(() => {
    scrollToBottom();
  }, []);
  const scrollToBottom = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: false });
    }
  };
  const handleContentSizeChange = () => {
    scrollToBottom();
  };
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
          {selectedMessages.length > 0 ? (
            <View
              style={{
                borderWidth: 3,
                borderRadius: 10,
                padding: 5,
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: "500" }}>
                {selectedMessages.length}
              </Text>
            </View>
          ) : (
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
          )}
        </View>
      ),

      headerRight: () =>
        selectedMessages.length > 0 ? (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 25 }}>
            <Ionicons
              onPress={undoAll}
              name="md-arrow-undo"
              size={24}
              color="black"
            />
            <FontAwesome5
              onPress={() =>
                navigation.navigate("Share", {
                  shareText: clipboardText,
                })
              }
              name="share-alt"
              size={24}
              color="black"
            />
            <Ionicons
              onPress={() => handelClipboardText(clipboardText)}
              name="ios-copy"
              size={24}
              color="black"
            />
            <MaterialIcons
              onPress={() => deleteMessages(selectedMessages)} //passing Array which contains all of the selected Id
              name="delete"
              size={24}
              color="black"
            />
          </View>
        ) : null,
    });
  }, [recepientData, selectedMessages]);

  //handeling clipboard text
  console.log("clipboardtext ⚡⚡", clipboardText);
  const handelClipboardText = (textArray) => {
    console.log("TextArray 🟰⚡", textArray);
    const str = textArray.join("");
    Clipboard.setStringAsync(str);
  };

  //undo all
  const undoAll = () => {
    setSelectedMessages([]);
    setClipboardText([]);
  };

  const deleteMessages = async (messageIds) => {
    try {
      const response = await fetch("http://192.168.0.136:8000/deleteMessages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: messageIds }),
      });

      if (response.ok) {
        //as now we have deleted the messages from the backend so then empty the selectedMessages array
        setSelectedMessages((prevSelectedMessages) =>
          prevSelectedMessages.filter((id) => !messageIds.includes(id))
        );
        //load all the messages again as we deleted some messages
        fetchMessages();
      } else {
        console.log("error deleting messages", response.status);
      }
    } catch (error) {
      console.log("error deleting messages", error);
    }
  };

  const formatTime = (time) => {
    const options = { hour: "numeric", minute: "numeric" };
    return new Date(time).toLocaleString("en-US", options);
  };

  //onPress camera icon
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      handleSend("image", result.uri);
    }
  };

  const handleSelectMessage = (message) => {
    //check if the message is already selected
    const isSelected = selectedMessages.includes(message._id);

    if (isSelected) {
      //if we again longpress on already selected message it will be remove from the selectedMessages
      setSelectedMessages((previousMessages) =>
        previousMessages.filter((id) => id !== message._id)
      );
      setClipboardText((prevtext) =>
        prevtext.filter((txt) => txt !== message.message)
      );
    } else {
      //if its the first time we are selecting the message then add it to the SelectedMessages array and add it'smessage text in setClipboardText array
      setSelectedMessages((previousMessages) => {
        const updatedSelectedMessages = [...previousMessages, message._id];
        setClipboardText((prevtext) => [...prevtext, message.message]);
        return updatedSelectedMessages;
      });
    }
  };
  console.log("SelectedMessages ✅ ", selectedMessages);
  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: "#F0F0F0" }}>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={{ flexGrow: 1 }}
        onContentSizeChange={handleContentSizeChange}
      >
        {messages.map((item, index) => {
          const isSelected = selectedMessages.includes(item._id);
          if (item.messageType === "text") {
            return (
              <Pressable
                onLongPress={() => handleSelectMessage(item)}
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

                  isSelected && {
                    width: "100%",
                    backgroundColor: "#F0FFFF",
                  },
                ]}
              >
                <Text
                  style={{
                    fontSize: 13,
                    textAlign: isSelected ? "right" : "left",
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
                  {formatTime(item.timeStamp)}
                </Text>
              </Pressable>
            );
          }

          //(ISSUE)=> Images are not rendering
          if (item.messageType === "image") {
            // const baseUrl =
            //   "/Users/HP/OneDrive/Desktop/Work-Dir/Chat-App/api/files/";
            const imageUrl = item.imageUrl;
            const filename = imageUrl.split("/").pop(); //typeOf(filename)==>string
            const newFilename = filename.split("\\").pop();
            //const imageSource = require("../api/files/1691419138621-901713347-image.jpg");
            const finalname = "../api/files/" + newFilename;
            console.log("NEW_FILE_NAME====>", finalname);
            const imageSource = { uri: `../api/files/${newFilename}` };
            return (
              <Pressable
                onLongPress={() => handleSelectMessage(item)}
                key={index}
                style={[
                  item?.senderId?._id === userId
                    ? {
                        alignSelf: "flex-end",
                        backgroundColor: "#DCF8C6",
                        padding: 8,
                        maxWidth: "60%",
                        borderRadius: 7,
                        margin: 10,
                      }
                    : {
                        alignSelf: "flex-start",
                        backgroundColor: "white",
                        padding: 8,
                        margin: 10,
                        borderRadius: 7,
                        maxWidth: "60%",
                      },
                  isSelected && { width: "100%", backgroundColor: "#F0FFFF" },
                ]}
              >
                <View>
                  <Image
                    // source={imageSource}
                    source={{ uri: `${finalname}` }}
                    // source={{ uri: `../api/files/${newFilename}` }}
                    style={{ width: 200, height: 200, borderRadius: 7 }}
                  />
                  <Text
                    style={{
                      textAlign: "right",
                      fontSize: 9,
                      position: "absolute",
                      right: 10,
                      bottom: 7,
                      color: "gray",
                      marginTop: 5,
                    }}
                  >
                    {formatTime(item?.timeStamp)}
                  </Text>
                </View>
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
          <Entypo onPress={pickImage} name="camera" size={24} color="gray" />
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
