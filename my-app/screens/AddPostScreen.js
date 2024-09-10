import React, { useState } from "react";
import {
    View,
    TextInput,
    Button,
    StyleSheet,
    Text,
    Image,
    Alert,
} from "react-native";
import { gql, useMutation } from "@apollo/client";

const ADD_POST = gql`
    mutation AddPost($content: String!, $imgUrl: String!) {
        addPost(content: $content, imgUrl: $imgUrl) {
            content
        }
    }
`;

const AddPostScreen = ({ route, navigation }) => {
    const [content, setContent] = useState("");
    const [imgUrl, setImgUrl] = useState("");
    const [addPost, { loading, error }] = useMutation(ADD_POST);

    const handleSubmit = async () => {
        if (!content) {
            Alert.alert("Please provide content");
            return;
        }

        try {
            await addPost({ variables: { content, imgUrl } });
            Alert.alert("Success", "Post added successfully!");
            setContent("");
            setImgUrl("");
            route.params.refetch();
            navigation.navigate("Home");
        } catch (e) {
            console.error(e);
            Alert.alert("Error", "Failed to add post.");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Create a Post</Text>
            <TextInput
                style={styles.input}
                placeholder="What's on your mind?"
                placeholderTextColor="gray"
                value={content}
                onChangeText={setContent}
                multiline
            />
            <TextInput
                style={styles.input}
                placeholder="Image URL (Optional)"
                placeholderTextColor="gray"
                value={imgUrl}
                onChangeText={setImgUrl}
            />
            {imgUrl ? (
                <Image source={{ uri: imgUrl }} style={styles.image} />
            ) : null}
            <Button
                title={loading ? "Submitting..." : "Submit Post"}
                onPress={handleSubmit}
                disabled={loading}
            />
            {error ? <Text style={styles.error}>{error.message}</Text> : null}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "black",
        padding: 20,
    },
    header: {
        color: "white",
        fontSize: 24,
        marginBottom: 20,
    },
    input: {
        height: 100,
        backgroundColor: "white",
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 15,
        color: "black",
    },
    image: {
        width: "100%",
        height: 200,
        resizeMode: "cover",
        borderRadius: 5,
        marginVertical: 15,
    },
    error: {
        color: "red",
        marginTop: 10,
    },
});

export default AddPostScreen;
