import { StyleSheet, Text, View, Dimensions } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Onboarding from "react-native-onboarding-swiper";
import Lottie from "lottie-react-native";

const { width, height } = Dimensions.get("window");

const OnboardingScreen = () => {
  return (
    <View style={styles.container}>
      <Onboarding
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
            backgroundColor: "#66cdaa", // green
            image: (
              <View style={styles.lottie}>
                <Lottie
                  source={require("../assets/animation/IconsPopping.json")}
                  autoPlay
                  loop
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
