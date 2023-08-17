import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  Pressable,
} from "react-native";
import React from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons, AntDesign } from "@expo/vector-icons";
//LogOut button with functionality
//Big User Profile image
//name
//email
const Profile = () => {
  const route = useRoute();
  const navigation = useNavigation();

  console.log("route data⚡", route.params);
  return (
    <ImageBackground
      source={require("../assets/images/Winter-Nature.png")}
      style={{
        // justifyContent: "center",
        alignItems: "center",
        flex: 1,
        // marginTop: "auto",
        // marginBottom: "auto",
      }}
    >
      <View style={{ position: "relative", left: -140, top: 35 }}>
        {/* <Ionicons name="arrow-back-circle-sharp" size={44} color="black" /> */}
        <Ionicons
          onPress={() => navigation.goBack()}
          name="arrow-back-circle-outline"
          size={44}
          color="black"
        />
      </View>
      <View
        style={{
          padding: 9,
          borderWidth: 5,
          // borderColor: "#FFA500",
          // borderColor: "#FFB7C5",
          borderColor: "#FFD3E1",
          borderRadius: 119,
          marginTop: 80,
        }}
      >
        <Image
          source={{ uri: route.params.image }}
          style={{
            width: 150,
            height: 150,
            borderRadius: 95,
            resizeMode: "cover",
          }}
        />
      </View>

      <Pressable
        style={{
          backgroundColor: "#36454f",
          // backgroundColor: "#415a77",
          // backgroundColor: "#431c53",
          paddingHorizontal: 20,
          paddingVertical: 5,
          marginTop: 20,
          borderRadius: 20,
          borderWidth: 2.7,
          borderColor: "white",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ color: "white", fontSize: 19, fontWeight: 900 }}>
          {route.params.name}
        </Text>
        <Text style={{ color: "white" }}>{route.params.email}</Text>
      </Pressable>

      <View
        style={{
          marginTop: 260,
          marginStart: -200,
          flexDirection: "column",
        }}
      >
        <Pressable
          onPress={() => navigation.navigate("Testing")}
          style={{
            // backgroundColor: "#36454f",
            backgroundColor: "#415a77",
            //backgroundColor: "black",
            paddingHorizontal: 20,
            paddingVertical: 5,
            borderRadius: 20,
            borderWidth: 2.7,
            borderColor: "white",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
            gap: 8,
          }}
        >
          <Text style={{ color: "white" }}>LogOut</Text>
          <AntDesign name="logout" size={24} color="white" />
        </Pressable>
        <Pressable
          onPress={() => navigation.navigate("Testing")}
          style={{
            position: "relative",
            left: "250%",
            // backgroundColor: "#36454f",
            backgroundColor: "#415a77",
            //backgroundColor: "black",
            paddingHorizontal: 20,
            paddingVertical: 5,
            borderRadius: 20,
            borderWidth: 2.7,
            borderColor: "white",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
            gap: 8,
          }}
        >
          <Text style={{ color: "white" }}>OnBoard</Text>
          <AntDesign name="swap" size={24} color="white" />
        </Pressable>
      </View>
    </ImageBackground>
  );
};

export default Profile;

const styles = StyleSheet.create({});
