import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import HomeScreen from "./screens/HomeScreen";
import FriendsScreen from "./screens/FriendsScreen";
import ChatsScreen from "./screens/ChatsScreen";
import ChatMessagesScreen from "./screens/ChatMessagesScreen";
import Profile from "./screens/Profile";
import OnboardingScreen from "./screens/OnboardingScreen";
import ForLottieScreen from "./screens/ForLottieScreen";
import ShareScreen from "./screens/ShareScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";

const StackNavigator = () => {
  const Stack = createNativeStackNavigator();

  const [showOnboarding, setShowOnboarding] = useState(null);

  useEffect(() => {
    checkIfAlreadyOnboarded();
  }, []);

  const checkIfAlreadyOnboarded = async () => {
    try {
      let onboarded = await AsyncStorage.getItem("onboarded");
      if (onboarded == 1) {
        // hide onboarding
        setShowOnboarding(false);
      } else {
        // show onboarding
        setShowOnboarding(true);
      }
    } catch (error) {
      console.log("Error retrieving value: ", error);
    }
  };

  if (showOnboarding == null) {
    return null;
  }
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Friends" component={FriendsScreen} />
        <Stack.Screen name="Chats" component={ChatsScreen} />
        <Stack.Screen name="Messages" component={ChatMessagesScreen} />
        <Stack.Screen
          name="CurrentUserProfile"
          component={Profile}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Onboard"
          component={OnboardingScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Share"
          component={ShareScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Testing"
          component={ForLottieScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigator;

const styles = StyleSheet.create({});
