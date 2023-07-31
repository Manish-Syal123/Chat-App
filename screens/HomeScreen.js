import { StyleSheet, Text, View } from "react-native";
import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { UserType } from "../UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt_decode from "jwt-decode";
import axios from "axios";

const HomeScreen = () => {
  const navigation = useNavigation();
  const { userId, setUserId } = useContext(UserType);
  const [users, setUsers] = useState([]); //storing data of all users from database except the current loggedInUser
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerLeft: () => (
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>Swift Chat</Text>
      ),
      headerRight: () => (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 18 }}>
          <Ionicons onPress={() => navigation.navigate("Chats")} name="chatbox-ellipses-outline" size={29} color="black" />
          <MaterialIcons
            onPress={() => navigation.navigate("Friends")}
            name="people-outline"
            size={29}
            color="black"
          />
        </View>
      ),
    })
  }, [])

  useEffect(() => {
    const fetchusers = async () => {
      const token = await AsyncStorage.getItem("authToken"); //token of current loggedInUser
      const decodedToken = jwt_decode(token);
      const userId = decodedToken.userId;
      setUserId(userId); //Storing the decoded UserId of Current loggedInUser ie. '_id' in terms of Database of "User" collection

      axios
        .get(`http://192.168.0.136:8000/users/${userId}`)
        .then((response) => {
          setUsers(response.data);
        }).catch((err) => {
          console.log("error retrieving users", err);
        });
    }

    fetchusers();
  }, [])

  console.log("users", users);
  return (
    <View>
      <Text>HomeScreen</Text>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
