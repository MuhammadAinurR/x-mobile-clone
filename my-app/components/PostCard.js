import EvilIcons from "@expo/vector-icons/EvilIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { useEffect, useState } from "react";
import { gql, useMutation } from "@apollo/client";

const LIKE_HIT = gql`
    mutation Like($postId: ID!) {
        like(postId: $postId) {
            content
        }
    }
`;

const PostCard = ({ navigation, styles, item, refetch, userId }) => {
    const [imgRatio, setImageRatio] = useState(0);
    const [likeHit, { loading, error }] = useMutation(LIKE_HIT);

    if (item.imgUrl) {
        try {
            Image.getSize(item.imgUrl, (width, height) => {
                setImageRatio(width / height);
            });
        } catch (error) {
            console.log("keluaran error", error);
        }
    }
    const likeHandle = async (postId) => {
        await likeHit({
            variables: {
                postId: postId,
            },
        });
        refetch();
    };

    return (
        <>
            <View style={styles.imageContainer}>
                <Image
                    style={styles.image}
                    source={{ uri: item.author.imgUrl }}
                />
                <TouchableOpacity
                    style={styles.overlay}
                    onPress={() => {
                        navigation.navigate("ProfileSearch", {
                            userId: item.author._id,
                        });
                    }}
                />
            </View>
            <View style={styles.textContainer}>
                <View style={{ flexDirection: "row", gap: 5 }}>
                    <Text style={styles.name}>{item.author.name}</Text>
                    <Text style={styles.username}>{item.author.username}</Text>
                </View>

                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate("PostDetail", {
                            post: item,
                            refetch,
                        });
                    }}
                >
                    <Text style={styles.content}>{item.content}</Text>
                    {item.imgUrl ? (
                        <Image
                            style={{
                                marginVertical: 8,
                                width: "100%",
                                aspectRatio: imgRatio,
                                borderRadius: 12,
                            }}
                            source={{ uri: item.imgUrl }}
                        />
                    ) : (
                        ""
                    )}
                </TouchableOpacity>

                <View style={styles.actionContainer}>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate("PostDetail", {
                                post: item,
                                refetch,
                            });
                        }}
                    >
                        <View style={styles.actionContainer}>
                            <EvilIcons name="comment" size={20} color="gray" />
                            <Text style={styles.action}>
                                {item.comments.length}
                            </Text>
                        </View>
                    </TouchableOpacity>

                    <View style={styles.actionContainer}>
                        <EvilIcons name="retweet" size={20} color="gray" />
                        <Text style={styles.action}>0</Text>
                    </View>

                    <TouchableOpacity onPress={() => likeHandle(item._id)}>
                        <View style={styles.actionContainer}>
                            <AntDesign name="hearto" size={18} color="gray" />
                            <Text style={styles.action}>
                                {item.likes.length}
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <View style={styles.actionContainer}>
                        <Feather name="bookmark" size={18} color="gray" />
                        <AntDesign name="sharealt" size={18} color="gray" />
                    </View>
                </View>
            </View>
        </>
    );
};

export default PostCard;
