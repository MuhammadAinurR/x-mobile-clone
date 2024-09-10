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
    mutation Login($email: String, $password: String) {
        login(email: $email, password: $password) {
            access_token
            _id
        }
    }
`;

const LoginScreen = ({ navigation }) => {
    const register = () => {
        navigation.navigate("Register");
    };
    const [doLogin, { loading }] = useMutation(LOGIN);

    const { setIsSignIn } = useContext(AuthContext);

    const [email, setEmail] = useState("rofiq@mail.com");
    const [password, setPassword] = useState("rofiq1234");

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Please enter both email and password.");
            return;
        }

        try {
            const result = await doLogin({
                variables: { email: email, password: password },
            });
            await SecureStore.setItemAsync(
                "access_token",
                result.data.login.access_token
            );
            await SecureStore.setItemAsync("userId", result.data.login._id);
            setIsSignIn(true);
        } catch (error) {
            console.error("error now", error);
            Alert.alert("email or password is not valid");
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
                placeholder="Password"
                placeholderTextColor="gray"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
            />
            <Text style={{ color: "white", marginBottom: 10 }}>
                Dont have account?{" "}
                <Text onPress={register} style={{ color: "skyblue" }}>
                    register here
                </Text>
            </Text>
            <Button
                title={loading ? "Loading..." : "Login"}
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

export default LoginScreen;
