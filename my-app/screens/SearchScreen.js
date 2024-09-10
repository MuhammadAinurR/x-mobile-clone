import React, { useState } from "react";
import {
    View,
    TextInput,
    Text,
    FlatList,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    StyleSheet,
} from "react-native";
import { useQuery, gql } from "@apollo/client";

const GET_USER_BY_USERNAME_ORNAME = gql`
    query GetUserByNameOrUsername($nameOrUsername: String) {
        getUserByNameOrUsername(nameOrUsername: $nameOrUsername) {
            username
            name
            _id
            imgUrl
        }
    }
`;

const SearchScreen = ({ navigation }) => {
    const [searchInput, setSearchInput] = useState("");
    const { data, loading, error } = useQuery(GET_USER_BY_USERNAME_ORNAME, {
        variables: { nameOrUsername: searchInput },
        skip: !searchInput,
    });

    const handleSearchChange = (text) => {
        setSearchInput(text);
    };

    const handleUserPress = (userId) => {
        navigation.navigate("ProfileSearch", { userId: userId });
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                value={searchInput}
                onChangeText={handleSearchChange}
                placeholderTextColor="gray"
                placeholder="Search by name or username"
            />
            {loading && <ActivityIndicator size="large" color="#0000ff" />}
            {error && <Text>Error: {error.message}</Text>}
            <FlatList
                data={data?.getUserByNameOrUsername}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.item}
                        onPress={() => handleUserPress(item._id)}
                    >
                        {item.imgUrl ? (
                            <Image
                                source={{ uri: item.imgUrl }}
                                style={styles.image}
                            />
                        ) : (
                            <View style={styles.image} />
                        )}
                        <View style={styles.info}>
                            <Text style={styles.username}>{item.username}</Text>
                            <Text style={styles.name}>{item.name}</Text>
                        </View>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={searchInput && <Text>No users found</Text>}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "black",
    },
    input: {
        height: 40,
        borderColor: "#ccc",
        borderRadius: 10,
        borderWidth: 1,
        paddingHorizontal: 8,
        marginBottom: 16,
        color: "white",
    },
    item: {
        flexDirection: "row",
        padding: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: "#ccc",
        marginRight: 8,
    },
    info: {
        justifyContent: "center",
    },
    username: {
        fontWeight: "bold",
        color: "gray",
    },
    name: {
        fontWeight: "bold",
        color: "white",
    },
});

export default SearchScreen;
