import { useContext } from "react";
import { View, Image, Text, StyleSheet } from "react-native";
import * as SecureStore from "expo-secure-store";
import { AuthContext } from "../context/AuthContext";

function LogoTitle() {
    const { setIsSignIn } = useContext(AuthContext);
    return (
        <View style={styles.container}>
            <View style={styles.left}></View>
            <View style={styles.middle}>
                <Image
                    style={styles.imageLarge}
                    source={{
                        uri: "https://upload.wikimedia.org/wikipedia/commons/5/57/X_logo_2023_%28white%29.png",
                    }}
                />
            </View>
            <View style={styles.right}>
                <Text
                    style={styles.text}
                    onPress={async () => {
                        await SecureStore.deleteItemAsync("access_token");
                        setIsSignIn(false);
                    }}
                >
                    Logout
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "90%",
    },
    left: {
        flex: 1,
    },
    middle: {
        flex: 1,
        alignItems: "center",
    },
    right: {
        flex: 1,
        alignItems: "flex-end",
    },
    imageSmall: {
        height: 20,
        width: 20,
        borderRadius: 20,
    },
    imageLarge: {
        width: 25,
        height: 25,
    },
    text: {
        color: "red",
    },
});

export default LogoTitle;
