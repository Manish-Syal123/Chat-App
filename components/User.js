import { Pressable, StyleSheet, Text, View, Image } from 'react-native'
import React, { useContext, useState } from 'react'
import { UserType } from '../UserContext';

const User = ({ item }) => {
    const { userId, setUserId } = useContext(UserType);
    const [requestSent, setRequestSent] = useState(false); //for changing the button value from 'Add friend' => 'Request sent'
    const sendFriendRequest = async (currentUserId, selectedUserId) => {
        try {
            const response = await fetch("http://192.168.0.136:8000/friend-request", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ currentUserId, selectedUserId }),
            })

            if (response.ok) {
                setRequestSent(true);
            }
        } catch (error) {
            console.log("error message", error);
        }
    }
    // console.log("friend requests sent", friendRequests);
    // console.log("user friends", userFriends);
    return (
        <Pressable style={{ flexDirection: "row", alignItems: "center", marginVertical: 10, }}>
            <View>
                <Image style={{
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    resizeMode: "cover",
                }}
                    source={{ uri: item.image }} />
            </View>

            <View style={{ marginLeft: 12, flex: 1 }}>
                <Text style={{ fontWeight: "bold" }}>{item.name}</Text>
                <Text style={{ marginTop: 4, color: "gray" }}>{item.email}</Text>
            </View>

            <Pressable
                onPress={() => sendFriendRequest(userId, item._id)} //senders current userId and (selectedUserId)receivers userId
                style={{
                    backgroundColor: "#567189",
                    padding: 10,
                    width: 105,
                    borderRadius: 6,
                }}>
                <Text style={{ textAlign: "center", color: "white" }}>Add Friend</Text>
            </Pressable>
        </Pressable>
    )
}

export default User

const styles = StyleSheet.create({})