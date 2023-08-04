import {
    KeyboardAvoidingView,
    ScrollView,
    StyleSheet,
    Text,
    View,
    TextInput,
    Pressable,
} from "react-native";
import React from "react";
import { Entypo, MaterialCommunityIcons, Feather } from "@expo/vector-icons";
const ChatMessagesScreen = () => {
    return (
        <KeyboardAvoidingView style={{ flex: 1, backgroundColor: "#F0F0F0" }}>
            <ScrollView>{/* All the chat messages go over here */}</ScrollView>

            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingHorizontal: 5,
                    paddingVertical: 1,
                    borderTopWidth: 1,
                    borderTopColor: "#dddddd",
                    marginBottom: 8,
                }}
            >
                <Entypo
                    style={{ marginRight: 5 }}
                    name="emoji-happy"
                    size={24}
                    color="gray"
                />
                <TextInput
                    style={{
                        flex: 1,
                        height: 40,
                        borderWidth: 1.5,
                        borderColor: "#dddddd",
                        borderRadius: 20,
                        paddingHorizontal: 10,
                        backgroundColor: "white",
                    }}
                    placeholder="Type your message..."
                />

                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        paddingHorizontal: 4,
                        paddingVertical: 10,
                        //borderTopWidth: 1,
                        borderTopColor: "#dddddd",
                        gap: 5,
                    }}
                >
                    <Entypo name="camera" size={24} color="gray" />
                    <Feather name="mic" size={24} color="gray" />
                </View>

                <Pressable>
                    <MaterialCommunityIcons name="send-circle" size={60} color="green" />
                </Pressable>
            </View>
        </KeyboardAvoidingView>
    );
};

export default ChatMessagesScreen;

const styles = StyleSheet.create({});
