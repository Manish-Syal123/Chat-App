import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Image,
  TextInput,
  ImageBackground,
} from "react-native";
import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Ionicons, MaterialIcons, Feather } from "@expo/vector-icons";
import { UserType } from "../UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt_decode from "jwt-decode";
import axios from "axios";
import User from "../components/User";

const HomeScreen = () => {
  const navigation = useNavigation();
  const { userId, setUserId } = useContext(UserType);
  const [users, setUsers] = useState([]); //storing data of all users from database except the current loggedInUser
  const [currentUser, setCurrentUser] = useState({}); //Current user Data //-
  const [searchtext, setSearchText] = useState("");

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerLeft: () => (
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            color: "#fff",
            fontFamily: "monospace",
            // fontFamily: "serif",
          }}
        >
          Xplore-Talk
        </Text>
      ),
      headerRight: () => (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 18,
          }}
        >
          <Ionicons
            onPress={() => navigation.navigate("Chats")}
            name="chatbox-ellipses-outline"
            size={29}
            color="black"
          />
          <MaterialIcons
            onPress={() => navigation.navigate("Friends")}
            name="people-outline"
            size={29}
            color="black"
          />
          {/* /Showing th current User profile */}
          <Pressable
            style={{
              padding: 3,
              borderWidth: 5,
              borderColor: "green",
              borderRadius: 37,
            }}
            //passed currentuser detail such as image,name & email
            onPress={() =>
              navigation.navigate("CurrentUserProfile", {
                image: currentUser.image,
                name: currentUser.name,
                email: currentUser.email,
              })
            }
          >
            <Image
              style={{
                width: 40,
                height: 40,
                borderRadius: 25,
                // resizeMode: "cover",
              }}
              source={{ uri: currentUser.image }}
            />
          </Pressable>
        </View>
      ),
      headerBackground: () => (
        <ImageBackground
          source={require("../assets/images/Cool-wallpaper.jpg")} // Provide the correct image path
          style={{ flex: 1 }}
        />
      ),
    });
  }, [currentUser]);

  useEffect(() => {
    const fetchUsers = async () => {
      const token = await AsyncStorage.getItem("authToken");
      const decodedToken = jwt_decode(token);
      const userId = decodedToken.userId;
      setUserId(userId); //storing the decoded UserId of Current loggedInUser ie. '_id' in terms of Database of "User" collection

      axios
        .get(`http://192.168.0.136:8000/users/${userId}`)
        .then((response) => {
          setUsers(response.data); //storing all the users from database except currentuser
        })
        .catch((error) => {
          console.log("error retrieving users", error);
        });

      //to get the current user data
      axios
        .get(`http://192.168.0.136:8000/currentuser/${userId}`)
        .then((response) => {
          setCurrentUser(response.data);
        })
        .catch((error) => {
          console.log("error retrieving users", error);
        });
    };

    fetchUsers();
  }, []);

  console.log("users", users);
  console.log("currentUser-Data🔥", currentUser); //-

  //Implemented the Search Functionality
  const [filterdUsers, setFilterdUsers] = useState([]);
  useEffect(() => {
    const SearchedUsers = users.filter((user) =>
      user.name.toLowerCase().includes(searchtext.toLowerCase())
    );
    setFilterdUsers(SearchedUsers);
  }, [searchtext]);

  return (
    <View>
      {/* /Showing th current User profile */}
      {/* <View style={{ padding: 10 }}>
        <Pressable
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginVertical: 10,
          }}
        >
          <View style={{ marginLeft: 12, flex: 1 }}>
            <Text style={{ fontWeight: "bold", fontSize: 20 }}>
              Welcome: {currentUser.name}
            </Text>
            <Text style={{ marginTop: 4, color: "green" }}>
              {currentUser.email}
            </Text>
          </View>

          <Pressable
            style={{
              padding: 3,
              borderWidth: 5,
              borderColor: "green",
              borderRadius: 37,
            }}
            //passed currentuser detail such as image,name & email
            onPress={() =>
              navigation.navigate("CurrentUserProfile", {
                image: currentUser.image,
                name: currentUser.name,
                email: currentUser.email,
              })
            }
          >
            <Image
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                resizeMode: "cover",
              }}
              source={{ uri: currentUser.image }}
            />
          </Pressable>
        </Pressable>
      </View> */}

      {/* Search Bar */}
      <View
        style={{
          padding: 7,
          margin: 10,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          // borderWidth: 1,
          // borderColor: "#e82a9c",
          borderRadius: 30,
          backgroundColor: "#897FFF",

          shadowColor: "#000",
          shadowOffset: { width: 8, height: 8 },
          shadowOpacity: 1,
          shadowRadius: 6,
          elevation: 10, // For Android
        }}
      >
        {/* <Feather name="search" size={24} color="black" /> */}
        <TextInput
          onChangeText={setSearchText}
          placeholder="Search for Items...."
          placeholderTextColor={"white"}
          style={{ padding: 1 }}
        />
        <Pressable
          onPress={() => navigation.navigate("Onboard")}
          style={{
            backgroundColor: "white",
            paddingHorizontal: 20,
            paddingVertical: 5,
            borderRadius: 20,
            // borderWidth: 2.7,
            // borderColor: "black",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
            gap: 8,

            shadowColor: "#000",
            shadowOffset: { width: 8, height: 8 },
            shadowOpacity: 1,
            shadowRadius: 6,
            elevation: 10, // For Android
          }}
        >
          <Text
            style={{
              fontWeight: "bold",
              color: "#897FFF",
            }}
          >
            Search
          </Text>
        </Pressable>
      </View>
      {/* Rest of the users */}
      {searchtext.length <= 0 ? (
        <View style={{ padding: 10 }}>
          {users.map((item, index) => (
            <User key={index} item={item} />
          ))}
        </View>
      ) : (
        <View style={{ padding: 10 }}>
          {filterdUsers.map((item, index) => (
            <User key={index} item={item} />
          ))}
        </View>
      )}
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
