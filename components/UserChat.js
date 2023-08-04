import { Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";

const UserChat = ({ item }) => {
    const navigation = useNavigation();

    return (
        <Pressable
            onPress={() =>
                navigation.navigate("Messages", {
                    recepientId: item._id, //Id of my friends
                })
            }
            style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                borderWidth: 2,
                borderColor: "black",
                borderTopWidth: 2,
                borderLeftWidth: 2,
                borderRightWidth: 2,
                paddingHorizontal: 6,
                paddingVertical: 10,
                borderRadius: 17,
                marginTop: 10,
                marginEnd: 5,
                marginStart: 5,
                flex: 1,
            }}
        >
            <Image
                style={{ width: 50, height: 50, borderRadius: 25, resizeMode: "cover" }}
                source={{ uri: item.image }}
            />

            <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 15, fontWeight: "500" }}>{item.name}</Text>
                <Text style={{ marginTop: 3, color: "gray", fontWeight: "500" }}>Last message comes here</Text>
            </View>

            <Pressable style={{ backgroundColor: "white", paddingHorizontal: 4, paddingVertical: 1, borderWidth: 1.6, borderRadius: 10, borderColor: "black" }}>
                <Text style={{ fontSize: 11, fontWeight: "500", color: "black" }}>3:00 PM</Text>
            </Pressable>
        </Pressable>
    );
};

export default UserChat;

const styles = StyleSheet.create({});
