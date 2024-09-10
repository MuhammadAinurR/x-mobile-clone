import React, { useEffect, useState } from "react";
import {
    Image,
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
} from "react-native";
import { gql, useQuery } from "@apollo/client";
// Icons
import PostCard from "../components/PostCard";
const GET_POSTS = gql`
    query ExampleQuery {
        posts {
            content
            tags
            imgUrl
            authorId
            author {
                _id
                name
                username
                email
                imgUrl
            }
            comments {
                content
                username
                updatedAt
                createdAt
            }
            likes {
                username
                createdAt
                updatedAt
            }
            createdAt
            updatedAt
            _id
        }
    }
`;

const HomeScreen = ({ navigation }) => {
    const { data, loading, error, refetch } = useQuery(GET_POSTS);
    if (data) {
        return (
            <>
                <ScrollView style={styles.container}>
                    {data.posts.map((item, i) => {
                        return (
                            <View key={i}>
                                <View style={styles.postContainer}>
                                    <PostCard
                                        styles={styles}
                                        item={item}
                                        navigation={navigation}
                                        refetch={refetch}
                                    />
                                </View>
                                <View
                                    style={{
                                        borderWidth: 1 / 6,
                                        borderBottomColor: "gray",
                                    }}
                                />
                            </View>
                        );
                    })}
                </ScrollView>
                <TouchableOpacity
                    style={{
                        position: "absolute",
                        bottom: 20,
                        right: 20,
                        width: 60,
                        height: 60,
                        borderRadius: 30,
                        backgroundColor: "blue",
                        justifyContent: "center",
                        alignContent: "center",
                        alignItems: "center",
                        opacity: 0.7,
                    }}
                    onPress={() => navigation.navigate("AddPost", { refetch })}
                >
                    <Text style={{ color: "white", fontSize: 30 }}>+</Text>
                </TouchableOpacity>
            </>
        );
    }

    if (loading) {
        return (
            <View>
                <Text style={{ color: "white" }}>Loading...</Text>
            </View>
        );
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "black",
        padding: 10,
    },
    header: {
        color: "white",
        fontSize: 24,
        marginBottom: 10,
    },
    postContainer: {
        flexDirection: "row",
        padding: 10,
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    contentImage: {
        marginVertical: 8,
        // height: 400,
        width: "100%",
        aspectRatio: 16 / 9,
        borderRadius: 12,
        resizeMode: "cover",
    },
    textContainer: {
        flex: 1,
        marginLeft: 10,
        justifyContent: "center",
    },
    name: {
        color: "white",
        fontWeight: "bold",
    },
    username: {
        color: "gray",
    },
    content: {
        color: "white",
    },
    action: {
        color: "gray",
    },
    imageContainer: {
        position: "relative",
    },
    overlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "transparent",
    },
    actionContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignContent: "center",
        gap: 2,
    },
});

export default HomeScreen;
