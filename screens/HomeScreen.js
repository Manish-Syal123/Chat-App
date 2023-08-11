import { StyleSheet, Text, View, Pressable, Image } from "react-native";
import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
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

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerLeft: () => (
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>Swift Chat</Text>
      ),
      headerRight: () => (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 18 }}>
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
        </View>
      ),
    });
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      const token = await AsyncStorage.getItem("authToken");
      const decodedToken = jwt_decode(token);
      const userId = decodedToken.userId;
      setUserId(userId); //storing the decoded UserId of Current loggedInUser ie. '_id' in terms of Database of "User" collection

      axios
        .get(`http://192.168.0.136:8000/users/${userId}`)
        .then((response) => {
          setUsers(response.data);
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

  return (
    <View>
      {/* /Showing th current User profile */}
      <View style={{ padding: 10 }}>
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

          <View
            style={{
              padding: 3,
              borderWidth: 5,
              borderColor: "green",
              borderRadius: 37,
            }}
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
          </View>
        </Pressable>
      </View>

      <View style={{ padding: 10 }}>
        {users.map((item, index) => (
          <User key={index} item={item} />
        ))}
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
