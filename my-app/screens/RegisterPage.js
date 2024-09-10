import React, { useState, useContext } from "react";
import { StatusBar } from "expo-status-bar";
import {
    Button,
    StyleSheet,
    Text,
    TextInput,
    View,
    Alert,
    Image,
} from "react-native";

import { gql, useMutation } from "@apollo/client";
import * as SecureStore from "expo-secure-store";
import { AuthContext } from "../context/AuthContext";

const LOGIN = gql`
    mutation AddUser(
        $name: String
        $username: String
        $email: String
        $password: String
        $imgUrl: String
    ) {
        addUser(
            name: $name
            username: $username
            email: $email
            password: $password
            imgUrl: $imgUrl
        ) {
            name
        }
    }
`;

const RegisterScreen = ({ navigation }) => {
    const login = () => {
        navigation.navigate("Login");
    };
    const [doRegister, { loading }] = useMutation(LOGIN);

    const { setIsSignIn } = useContext(AuthContext);

    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [imgUrl, setImgUrl] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        if (!email || !password || !name || !username) {
            Alert.alert("Error", "Please fill all field.");
            return;
        }

        try {
            const result = await doRegister({
                variables: {
                    email: email,
                    password: password,
                    name: name,
                    username: username,
                    imgUrl: imgUrl,
                },
            });
            navigation.navigate("Login");
        } catch (error) {
            console.error(error);
            Alert.alert("Service in trouble");
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.middle}>
                <Image
                    style={{ width: 150, height: 150, marginBottom: 30 }}
                    source={{
                        uri: "https://upload.wikimedia.org/wikipedia/commons/5/57/X_logo_2023_%28white%29.png",
                    }}
                />
            </View>
            <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="gray"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Name"
                placeholderTextColor="gray"
                value={name}
                onChangeText={setName}
                keyboardType="text"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Username"
                placeholderTextColor="gray"
                value={username}
                onChangeText={setUsername}
                keyboardType="text"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Image Url"
                placeholderTextColor="gray"
                value={imgUrl}
                onChangeText={setImgUrl}
                keyboardType="text"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="gray"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
            />
            <Text style={{ color: "white", marginBottom: 10 }}>
                already have an account?{" "}
                <Text onPress={login} style={{ color: "skyblue" }}>
                    login here
                </Text>
            </Text>
            <Button
                title={loading ? "Loading..." : "Register"}
                onPress={handleLogin}
            />
            <StatusBar style="auto" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "black",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },
    text: {
        color: "white",
        fontSize: 24,
        marginBottom: 20,
    },
    input: {
        height: 40,
        width: "100%",
        borderColor: "gray",
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 15,
        paddingHorizontal: 10,
        color: "white",
    },
});

export default RegisterScreen;
