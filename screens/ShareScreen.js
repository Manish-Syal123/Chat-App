import {
  View,
  Text,
  Button,
  Share,
  Dimensions,
  StyleSheet,
  Pressable,
} from "react-native";
import React from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
// import Share from "react-native-share";
import Lottie from "lottie-react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
const { width, height } = Dimensions.get("window");

const ShareScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { shareText } = route.params;

  let sendingtext = "";
  shareText.forEach((element) => {
    sendingtext = sendingtext + element + ", ";
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
    <View style={{ flex: 1, padding: 10, backgroundColor: "white" }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          //gap: 70,
          alignItems: "center",
          marginTop: 20,
          backgroundColor: "#444654s",
          // backgroundColor: "black",
          borderRadius: 20,
          padding: 10,
        }}
      >
        <Ionicons
          onPress={() => navigation.goBack()}
          name="arrow-back-circle-sharp"
          size={44}
          color="white"
        />
        <Pressable
          style={{
            borderWidth: 2.5,
            borderColor: "white",
            borderRadius: 20,
            paddingHorizontal: 10,
          }}
        >
          <Text style={styles.glowText}>Share on Socials</Text>
        </Pressable>
      </View>
      <View
        style={{
          marginTop: 20, // Adjusted the value to make the animation touch the header
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Lottie
          // source={require("../assets/animation/shareWithFriends.json")}
          source={require("../assets/animation/share-tree.json")}
          autoPlay
          loop
          style={{
            //backgroundColor: "black",
            // width: width * 0.9,
            // height: width,
            width: 450,
            height: 450,
          }}
        />
      </View>
      <Pressable
        style={
          (({ pressed }) => [
            {
              opacity: pressed ? 0.5 : 1,
            },
          ],
          {
            justifyContent: "center",
            alignItems: "center",
            marginHorizontal: 40,
            marginTop: 40,
            backgroundColor: "#FCD34D",
            borderWidth: 2,
            borderRadius: 20,
          })
        }
        onPress={shareContent}
      >
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>
          Share {<FontAwesome name="share-alt" size={24} color="black" />}
        </Text>
      </Pressable>
    </View>
  );
};

export default ShareScreen;

const styles = StyleSheet.create({
  glowText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#00ff00", // Text color
    textShadowColor: "#00ff00", // Glow color
    textShadowOffset: { width: -5, height: -1 },
    textShadowRadius: 22,
  },
});
