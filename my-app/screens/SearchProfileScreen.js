import React from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    Image,
    Button,
    Alert,
} from "react-native";

const defaultProfileImage =
    "https://i.pinimg.com/originals/07/66/d1/0766d183119ff92920403eb7ae566a85.png";
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

const HIT_FOLLOW = gql`
    mutation HitFollow($followingId: ID!) {
        hitFollow(followingId: $followingId) {
            _id
        }
    }
`;

const SearchProfileScreen = ({ route }) => {
    const { userId } = route.params;
    const { data, loading, error, refetch } = useQuery(GET_USER_PROFILE, {
        variables: { userId },
    });

    const [smashFollow, { loading: followLoading, error: followError }] =
        useMutation(HIT_FOLLOW);
    const hitFollow = async (userId) => {
        console.log("hit follow");
        try {
            await smashFollow({
                variables: {
                    followingId: userId,
                },
            });
            refetch();
            Alert.alert("Success Follow");
        } catch (error) {
            console.log(error);
        }
    };
    console.log(data);

    if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
    if (error) return <Text>Error loading profile</Text>;

    const { getUserById } = data;
    return (
        <ScrollView style={styles.container}>
            <View style={styles.profileContainer}>
                <Image
                    style={styles.profileImage}
                    source={{ uri: getUserById.imgUrl || defaultProfileImage }}
                />
                <Text style={styles.name}>{getUserById.name}</Text>
                <Text style={styles.username}>{getUserById.username}</Text>
                <Text style={styles.email}>{getUserById.email}</Text>
                <Button
                    title="Follow"
                    onPress={() => hitFollow(getUserById._id)}
                />
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Followers</Text>
                {getUserById.followerData.length ? (
                    getUserById.followerData.map((follower) => (
                        <View key={follower._id} style={styles.listItem}>
                            <Text style={styles.listItemText}>
                                {follower.username}
                            </Text>
                        </View>
                    ))
                ) : (
                    <Text style={styles.listItemText}>- Empty -</Text>
                )}
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Following</Text>
                {getUserById.followingData.length ? (
                    getUserById.followingData.map((following) => (
                        <View key={following._id} style={styles.listItem}>
                            <Text style={styles.listItemText}>
                                {following.username}
                            </Text>
                        </View>
                    ))
                ) : (
                    <Text style={styles.listItemText}>- Empty -</Text>
                )}
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
        marginBottom: 15,
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

export default SearchProfileScreen;
