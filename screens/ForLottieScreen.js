import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Lottie from "lottie-react-native";

const ForLottieScreen = () => {
  return (
    <>
      <View style={{ flex: 1 }}>
        <Lottie
          //   source={require("../assets/animation/login.json")}
          source={require("../assets/animation/PhoneChat.json")}
          autoPlay
          loop
        />
      </View>
      <Text>testing</Text>
    </>
  );
};

export default ForLottieScreen;

const styles = StyleSheet.create({});
