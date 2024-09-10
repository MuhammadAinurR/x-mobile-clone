import { NavigationContainer } from "@react-navigation/native";

import MainStack from "./navigaros/MainStack";
import { ApolloProvider } from "@apollo/client";
import client from "./config/apollo";
import { useEffect, useState } from "react";

import * as SecureStore from "expo-secure-store";
import { Text, View } from "react-native";
import { AuthContext } from "./context/AuthContext";

export default function App() {
    const [isSignIn, setIsSignIn] = useState(false);
    const [loading, setLoading] = useState(true);

    const tokenCheck = async () => {
        const access_token = await SecureStore.getItemAsync("access_token");
        if (access_token) setIsSignIn(true);
        setLoading(false);
    };
    useEffect(() => {
        tokenCheck();
    }, []);

    if (loading) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "black",
                }}
            >
                <Text style={{ color: "white" }}>Loading...</Text>
            </View>
        );
    }
    return (
        <AuthContext.Provider value={{ isSignIn, setIsSignIn }}>
            <ApolloProvider client={client}>
                <NavigationContainer>
                    <MainStack />
                </NavigationContainer>
            </ApolloProvider>
        </AuthContext.Provider>
    );
}
