import {
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

const RegisterScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const navigation = useNavigation();

  const handleRegister = () => {
    const user = {
      name: name,
      email: email,
      password: password,
      image: image,
    };

    // send a Post 'request' to the backentd API to register the user
    axios
      .post("http://192.168.0.136:8000/regester", user)
      .then((response) => {
        console.log(response);
        Alert.alert(
          "Registeration successfull",
          "You have been registered successfully"
        );
        //set all the fields to empty
        setName("");
        setEmail("");
        setPassword("");
        setImage("");
      })
      .catch((err) => {
        Alert.alert(
          "Registeration Error",
          "An error occurred while registering"
        );
        console.log("registeration failed", err);
      });
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "white",
        padding: 10,
        alignItems: "center",
      }}
    >
      <KeyboardAvoidingView>
        <View
          style={{
            marginTop: 100,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#4A55A2", fontSize: 17, fontWeight: "600" }}>
            Register
          </Text>

          <Text style={{ fontSize: 17, fontWeight: "600", marginTop: 15 }}>
            Register to Your Account
          </Text>
        </View>

        <View style={{ marginTop: 50 }}>
          {/* Name View */}
          <View>
            <Text style={{ fontSize: 18, fontWeight: "600", color: "gray" }}>
              Name
            </Text>
            <TextInput
              value={name}
              onChangeText={(text) => setName(text)}
              style={{
                fontSize: name ? 18 : 15,
                borderBottomColor: "gray",
                borderBottomWidth: 1,
                marginVertical: 10,
                width: 300,
              }}
              placeholderTextColor={"black"}
              placeholder="Enter Your Name"
            />
          </View>

          {/* Email View */}
          <View>
            <Text style={{ fontSize: 18, fontWeight: "600", color: "gray" }}>
              Email
            </Text>
            <TextInput
              value={email}
              onChangeText={(text) => setEmail(text)}
              style={{
                fontSize: email ? 18 : 15,
                borderBottomColor: "gray",
                borderBottomWidth: 1,
                marginVertical: 10,
                width: 300,
              }}
              placeholderTextColor={"black"}
              placeholder="Enter Your Email"
            />
          </View>

          {/* Password View */}
          <View style={{ marginTop: 10 }}>
            <Text style={{ fontSize: 18, fontWeight: "600", color: "gray" }}>
              Password
            </Text>
            <TextInput
              value={password}
              onChangeText={(text) => setPassword(text)}
              secureTextEntry={true}
              style={{
                fontSize: email ? 18 : 15,
                borderBottomColor: "gray",
                borderBottomWidth: 1,
                marginVertical: 10,
                width: 300,
              }}
              placeholderTextColor={"black"}
              placeholder="Enter Your Password"
            />
          </View>

          {/* Image */}
          <View style={{ marginTop: 10 }}>
            <Text style={{ fontSize: 18, fontWeight: "600", color: "gray" }}>
              Image
            </Text>
            <TextInput
              value={image}
              onChangeText={(text) => setImage(text)}
              style={{
                fontSize: image ? 18 : 15,
                borderBottomColor: "gray",
                borderBottomWidth: 1,
                marginVertical: 10,
                width: 300,
              }}
              placeholderTextColor={"black"}
              placeholder="Image"
            />
          </View>

          {/* Sign Up Button */}
          <Pressable
            onPress={handleRegister}
            style={{
              width: 200,
              backgroundColor: "#4A55A2",
              padding: 15,
              marginTop: 50,
              marginLeft: "auto",
              marginRight: "auto",
              borderRadius: 6,
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: 16,
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Register
            </Text>
          </Pressable>

          {/* Dont have account */}
          <Pressable
            onPress={() => navigation.goBack()}
            style={{ marginTop: 15 }}
          >
            <Text style={{ textAlign: "center", color: "gray", fontSize: 16 }}>
              Already have an account? Sign In
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({});
