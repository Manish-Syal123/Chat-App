import { View, Text, Button, Share, Dimensions } from "react-native";
import React from "react";
import { useRoute } from "@react-navigation/native";
// import Share from "react-native-share";
import Lottie from "lottie-react-native";

const { width, height } = Dimensions.get("window");

const ShareScreen = () => {
  const route = useRoute();
  const { shareText } = route.params;

  let sendingtext = "";
  shareText.forEach((element) => {
    sendingtext = sendingtext + element + " ";
  });
  //console.log("sending text 💪", sendingtext);

  const shareContent = async () => {
    try {
      const result = await Share.share({
        message: sendingtext,
        url: "https://www.example.com",
        title: "Awesome App",
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // on with platform or app I Shared
          console.log(`Shared via ${result.activityType}`);
        } else {
          // Shared
          console.log("Shared");
        }
      } else if (result.action === Share.dismissedAction) {
        // Dismissed
        console.log("Dismissed");
      }
    } catch (error) {
      console.error("Error sharing content:", error.message);
    }
  };
  console.log("🎉🎉🎉", shareText);
  return (
    <View style={{ flex: 1, padding: 10 }}>
      <View
        style={{
          marginTop: 0, // Adjusted the value to make the animation touch the header
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Lottie
          source={require("../assets/animation/shareWithFriends.json")}
          autoPlay
          loop
          style={{
            backgroundColor: "black",
            // width: width * 0.9,
            // height: width,
            width: 500,
            height: 550,
          }}
        />
      </View>
      <View style={{ marginHorizontal: 40, marginTop: 40 }}>
        <Button title="Share" onPress={shareContent} />
      </View>
    </View>
  );
};

export default ShareScreen;
