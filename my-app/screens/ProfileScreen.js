import React, { useEffect, useState } from "react";
import { gql, useQuery } from "@apollo/client";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    Image,
    Button,
} from "react-native";

import * as SecureStore from "expo-secure-store";

const GET_USER_PROFILE = gql`
    query GetUserProfile($userId: String!) {
        getUserById(userId: $userId) {
            _id
            name
            username
            email
            imgUrl
            followerData {
                _id
                name
                username
            }
            followingData {
                _id
                name
                username
            }
        }
    }
`;

const ProfileScreen = () => {
    const [userId, setUserId] = useState({});
    useEffect(() => {
        const getCurrentUser = async () => {
            setUserId(await SecureStore.getItemAsync("userId"));
        };
        getCurrentUser();
    }, []);

    const { data, loading, error, refetch } = useQuery(GET_USER_PROFILE, {
        variables: { userId },
    });
    if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
    if (error) return <Text>Error loading profile</Text>;

    const { getUserById } = data;

    return (
        <ScrollView style={styles.container}>
            <View style={styles.profileContainer}>
                <Image
                    style={styles.profileImage}
                    source={{ uri: getUserById.imgUrl }}
                />
                <Text style={styles.name}>{getUserById.name}</Text>
                <Text style={styles.username}>{getUserById.username}</Text>
                <Text style={styles.email}>{getUserById.email}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Followers</Text>
                {getUserById.followerData &&
                    getUserById.followerData.map((follower) => (
                        <View key={follower._id} style={styles.listItem}>
                            <Text style={styles.listItemText}>
                                {follower.username}
                            </Text>
                        </View>
                    ))}
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Following</Text>
                {getUserById.followingData &&
                    getUserById.followingData.map((following) => (
                        <View key={following._id} style={styles.listItem}>
                            <Text style={styles.listItemText}>
                                {following.username}
                            </Text>
                        </View>
                    ))}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "black",
        padding: 15,
    },
    profileContainer: {
        marginBottom: 20,
        alignItems: "center",
    },
    profileImage: {
        height: 200,
        width: 200,
        borderRadius: 10,
    },
    name: {
        fontSize: 24,
        color: "white",
        fontWeight: "bold",
    },
    username: {
        fontSize: 18,
        color: "gray",
    },
    email: {
        fontSize: 16,
        color: "white",
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        color: "white",
        marginBottom: 10,
        fontWeight: "bold",
    },
    listItem: {
        paddingVertical: 10,
        borderBottomColor: "gray",
        borderBottomWidth: 1,
    },
    listItemText: {
        color: "white",
    },
});

export default ProfileScreen;
