import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useRoute } from "@react-navigation/native";

//LogOut button with functionality
//Big User Profile image
//name
//email
const Profile = () => {
  const route = useRoute();

  console.log("route data⚡", route.params);
  return (
    <View>
      <Text>{route.params.name}</Text>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({});
