import { StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios';
import { UserType } from '../UserContext';
import FriendRequest from '../components/FriendRequest';

const FriendsScreen = () => {
    const { userId, setUserId } = useContext(UserType);
    const [friendRequests, setFriendRequests] = useState([]);
    useEffect(() => {
        fetchFriendRequests();
    }, []);


    const fetchFriendRequests = async () => {
        try {
            const response = await axios.get(
                `http://192.168.0.136:8000/friend-request/${userId}`
            );
            if (response.status === 200) {
                const friendRequestsData = response.data.map((friendRequest) => ({
                    _id: friendRequest._id,  // id of users who send's me(us) the friend request
                    name: friendRequest.name,
                    email: friendRequest.email,
                    image: friendRequest.image,
                }));

                setFriendRequests(friendRequestsData);
            }
        } catch (err) {
            console.log("error message", err);
        }
    };

    console.log(friendRequests);

    return (
        <View style={{ padding: 10, marginHorizontal: 12 }}>
            {friendRequests.length > 0 && <Text>Your Friend Requests!</Text>}
            {friendRequests.map((item, index) => (
                <FriendRequest
                    key={index}
                    item={item} // individual friend is maping from 'friendRequests array' and sending to the component 
                    friendRequest={friendRequests} // the array of friendRequests // useState
                    setFriendRequests={setFriendRequests} // and its set state //useState
                />
            ))}
        </View>
    )
}

export default FriendsScreen

const styles = StyleSheet.create({})