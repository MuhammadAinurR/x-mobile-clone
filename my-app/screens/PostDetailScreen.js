import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    ScrollView,
    TextInput,
    Button,
    ActivityIndicator,
    Alert,
} from "react-native";
import { gql, useMutation } from "@apollo/client";

const ADD_COMMENT = gql`
    mutation Comment($postId: ID!, $content: String!) {
        comment(postId: $postId, content: $content) {
            message
        }
    }
`;

const PostDetailScreen = ({ route }) => {
    const { post } = route.params;
    const [newComment, setNewComment] = useState("");
    const [comments, setComments] = useState(post.comments || []);
    const [addComment, { loading: isLoading, error }] =
        useMutation(ADD_COMMENT);

    if (!post) {
        return <Text>Error: No post data found</Text>;
    }

    const { author, content, imgUrl, createdAt, _id: postId } = post;

    const handleAddComment = async () => {
        if (newComment.trim() === "") return;

        try {
            const { data } = await addComment({
                variables: {
                    postId: postId,
                    content: newComment,
                },
            });

            // Handle success
            if (data) {
                setComments([
                    ...comments,
                    {
                        username: "You",
                        content: newComment,
                        createdAt: new Date().toISOString(),
                    },
                ]);
                setNewComment("");
                route.params.refetch();
                Alert.alert("Comment added successfully!");
            }
        } catch (error) {
            // Log and handle error
            console.error("Error adding comment:", error);
            Alert.alert("Error", "Failed to add comment. Please try again.");
        }
    };

    if (error) {
        console.error("ApolloError:", error);
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.postHeader}>
                <Image
                    source={{ uri: author.imgUrl }}
                    style={styles.authorImage}
                />
                <View style={styles.authorInfo}>
                    <Text style={styles.authorName}>{author.name}</Text>
                    <Text style={styles.authorUsername}>{author.username}</Text>
                </View>
            </View>
            <View style={styles.postContent}>
                <Text style={styles.contentText}>{content}</Text>
                {imgUrl && (
                    <Image source={{ uri: imgUrl }} style={styles.postImage} />
                )}
            </View>
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    gap: 50,
                }}
            >
                <Text style={{ color: "gray" }}>Like {post.likes.length}</Text>
                <Text style={styles.timestamp}>
                    Posted At {new Date(createdAt).toLocaleDateString()}{" "}
                    {new Date(createdAt).toLocaleTimeString()}
                </Text>
            </View>
            <View style={styles.commentSection}>
                <Text style={styles.sectionTitle}>Comments</Text>
                {isLoading ? (
                    <ActivityIndicator size="small" color="#0000ff" />
                ) : (
                    <ScrollView contentContainerStyle={styles.commentsList}>
                        {comments.length === 0 ? (
                            <Text style={styles.noComments}>
                                No comments yet
                            </Text>
                        ) : (
                            comments.map((item, i) => (
                                <View key={i} style={styles.commentContainer}>
                                    <Text style={styles.commentUsername}>
                                        {item.username}
                                    </Text>
                                    <Text style={styles.commentText}>
                                        {item.content}
                                    </Text>
                                    <Text style={styles.commentTimestamp}>
                                        {new Date(
                                            item.createdAt
                                        ).toLocaleDateString()}{" "}
                                        {new Date(
                                            item.createdAt
                                        ).toLocaleTimeString()}
                                    </Text>
                                </View>
                            ))
                        )}
                    </ScrollView>
                )}
                <View style={styles.addCommentContainer}>
                    <TextInput
                        style={styles.commentInput}
                        placeholder="Add a comment..."
                        placeholderTextColor="gray"
                        value={newComment}
                        onChangeText={setNewComment}
                    />
                    <Button
                        title="Submit"
                        onPress={handleAddComment}
                        disabled={isLoading}
                    />
                </View>
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
    postHeader: {
        flexDirection: "row",
        marginBottom: 15,
    },
    authorImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    authorInfo: {
        justifyContent: "center",
    },
    authorName: {
        color: "white",
        fontWeight: "bold",
        fontSize: 16,
    },
    authorUsername: {
        color: "gray",
        fontSize: 14,
    },
    postContent: {
        marginBottom: 15,
    },
    contentText: {
        color: "white",
        fontSize: 16,
        marginBottom: 10,
    },
    postImage: {
        width: "100%",
        height: 200,
        borderRadius: 10,
        resizeMode: "cover",
    },
    timestamp: {
        color: "gray",
        fontSize: 12,
        textAlign: "center",
    },
    commentSection: {
        marginTop: 20,
    },
    commentsList: {
        flexDirection: "column",
        gap: 20,
    },
    sectionTitle: {
        fontSize: 18,
        color: "white",
        marginBottom: 10,
        fontWeight: "bold",
    },
    commentContainer: {
        marginBottom: 15,
    },
    commentUsername: {
        color: "white",
        fontWeight: "bold",
    },
    commentText: {
        color: "white",
        fontSize: 14,
    },
    commentTimestamp: {
        color: "gray",
        fontSize: 12,
    },
    commentInput: {
        height: 40,
        backgroundColor: "white",
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 10,
        color: "black",
    },
    addCommentContainer: {
        marginTop: 10,
        marginBottom: 20,
    },
    noComments: {
        color: "gray",
        textAlign: "center",
        fontSize: 16,
    },
});

export default PostDetailScreen;
