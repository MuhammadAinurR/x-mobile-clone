import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Image, Text, View } from "react-native";
import HomeScreen from "../screens/HomeScreen";
import LoginScreen from "../screens/LoginScreen";
import ProfileScreen from "../screens/ProfileScreen";
import AddPostScreen from "../screens/AddPostScreen";
import LogoTitle from "../components/Header";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Ionicons } from "@expo/vector-icons"; // Import Expo icons
import SearchScreen from "../screens/SearchScreen";
import SearchProfileScreen from "../screens/SearchProfileScreen";
import PostDetailScreen from "../screens/PostDetailScreen";
import RegisterScreen from "../screens/RegisterPage";
const Stack = createNativeStackNavigator();

const Tab = createBottomTabNavigator();
function MainScreen() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                    let iconName;

                    if (route.name === "Profile") {
                        iconName = "person-circle";
                    } else if (route.name === "Home") {
                        iconName = "home";
                    } else if (route.name === "Search") {
                        iconName = "search";
                    }

                    return (
                        <Ionicons name={iconName} size={size} color={color} />
                    );
                },
                tabBarActiveTintColor: "white",
                tabBarInactiveTintColor: "gray",
                tabBarStyle: { backgroundColor: "black" },
                headerShown: false,
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Search" component={SearchScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    );
}

const MainStack = () => {
    const { isSignIn } = useContext(AuthContext);
    return (
        <>
            <Stack.Navigator
                screenOptions={{
                    headerStyle: {
                        backgroundColor: "black",
                    },
                    headerTintColor: "white",
                    headerTitleAlign: "center",
                    headerTitleStyle: {
                        fontWeight: "bold",
                    },
                }}
            >
                {isSignIn ? (
                    <>
                        <Stack.Screen
                            name="Main"
                            component={MainScreen}
                            options={{
                                headerTitle: (props) => <LogoTitle />,
                            }}
                        />

                        <Stack.Screen
                            name="Profile"
                            component={ProfileScreen}
                            options={({ route }) => ({
                                title: route.params.name,
                                headerRight: (props) => <LogoTitle />,
                                headerTitleAlign: "left",
                            })}
                        />
                        <Stack.Screen
                            name="ProfileSearch"
                            component={SearchProfileScreen}
                            options={({ route }) => ({
                                title: route.params.name,
                                headerRight: (props) => <LogoTitle />,
                                headerTitleAlign: "left",
                            })}
                        />
                        <Stack.Screen
                            name="PostDetail"
                            component={PostDetailScreen}
                            options={({ route }) => ({
                                title: route.params.name,
                                headerRight: (props) => <LogoTitle />,
                                headerTitleAlign: "left",
                            })}
                        />

                        <Stack.Screen
                            name="AddPost"
                            component={AddPostScreen}
                        />
                    </>
                ) : (
                    <>
                        <Stack.Screen name="Login" component={LoginScreen} />
                        <Stack.Screen
                            name="Register"
                            component={RegisterScreen}
                        />
                    </>
                )}
            </Stack.Navigator>
        </>
    );
};

export default MainStack;
