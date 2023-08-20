import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import React from "react";
import Onboarding from "react-native-onboarding-swiper";
import Lottie from "lottie-react-native";
import { useNavigation } from "@react-navigation/native";
import { AntDesign, Feather, FontAwesome5, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("window");

const OnboardingScreen = () => {
  const navigation = useNavigation();

  const handleDone = async () => {
    navigation.navigate("Login");
    try {
      await AsyncStorage.setItem("onboarded", "1");
    } catch (error) {
      console.log("Error storing value: ", error);
    }
  };

  const doneButton = ({ ...props }) => {
    return (
      <TouchableOpacity style={styles.nextButton} {...props}>
        <Text style={{ color: "white", fontSize: 17 }}>Done</Text>
        <Ionicons
          name="ios-checkmark-done-circle-sharp"
          size={29}
          color="white"
        />
      </TouchableOpacity>
    );
  };
  const nextButton = ({ ...props }) => {
    return (
      <TouchableOpacity style={styles.nextButton} {...props}>
        <Text style={{ color: "white", fontSize: 17 }}>Next</Text>
        {/* <AntDesign name="arrowright" size={24} color="white" /> */}
        {/* <Feather name="arrow-right-circle" size={24} color="white" /> */}
        <FontAwesome5 name="arrow-circle-right" size={24} color="white" />
      </TouchableOpacity>
    );
  };
  return (
    <View style={styles.container}>
      <Onboarding
        onDone={handleDone}
        onSkip={handleDone}
        DoneButtonComponent={doneButton}
        //SkipButtonComponent={skipButton}
        NextButtonComponent={nextButton}
        bottomBarHighlight={false}
        containerStyles={{ paddingHorizontal: 15 }}
        pages={[
          {
            //backgroundColor: "#a78bfa",
            // backgroundColor: "#35363A", //light black
            backgroundColor: "#444654", //light black + lavender

            image: (
              <View style={styles.lottie}>
                <Lottie
                  //source={require("../assets/animation/boost.json")}
                  source={require("../assets/animation/DataPrivacy.json")}
                  autoPlay
                  loop
                />
              </View>
            ),
            title: "Laundry in Devices",
            subtitle:
              "Now you can access laundry service Under your fingure tip ",
          },
          {
            // backgroundColor: "#fef3c7",
            // backgroundColor: "#E6E6FA", // light lavender
            backgroundColor: "white",
            image: (
              <View style={styles.lottie}>
                <Lottie
                  source={require("../assets/animation/IconsPopping.json")}
                  autoPlay
                  loop
                  style={{ backgroundColor: "white" }}
                />
              </View>
            ),
            title: "Highly advanced machines available",
            subtitle: "Large number of machines with self drying cloths in it",
          },
          {
            backgroundColor: "#E6E6FA",
            image: (
              <View style={styles.lottie}>
                <Lottie
                  source={require("../assets/animation/PhoneChat.json")}
                  autoPlay
                  loop
                />
              </View>
            ),
            title: "Ironing Cloths",
            subtitle:
              "Your cloths are ironed just before arriving for delevery.",
          },
          {
            backgroundColor: "#ded7c1",
            image: (
              <View style={styles.lottie}>
                <Lottie
                  source={require("../assets/animation/sendingMessages.json")}
                  autoPlay
                  loop
                />
              </View>
            ),
            title: "Home Cleaning",
            subtitle: "Sooner we will add Home cleaning service as well......",
          },
        ]}
      />
    </View>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  lottie: {
    width: width * 0.9,
    height: width,
  },
  doneButton: {
    padding: 20,
    backgroundColor: "white",
    borderTopLeftRadius: 100,
    borderBottomLeftRadius: 100,
  },
  nextButton: {
    backgroundColor: "#121212",
    padding: 11,
    width: 113,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    marginRight: 5,
    borderWidth: 2,
    borderColor: "white",
  },
});
