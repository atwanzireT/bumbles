import { StatusBar } from "expo-status-bar";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { FlatList, Image, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Button, Input, Text } from "react-native-elements";
import { Card, Avatar, IconButton } from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome";
import { firebase_auth, firebase_db } from "../firebase";
import { collection, addDoc, getDocs, setDoc, doc } from 'firebase/firestore';
import customstyles from "../theme/styles";

export default function AddChatScreen({ navigation }) {
    const [input, setInput] = useState("");
    const [users, setUsers] = useState([]);

    const createChat = async () => {
        const db = collection(firebase_db, "chats");
        const chatRef = await addDoc(db, {
            chatName: input
        }).then(() => {
            navigation.goBack();
        }).catch((err) => {
            console.log(err);
        });
    }

    const newConversation = async (uid, name, photoURL) => {
        try {
            const db = collection(firebase_db, "chats");
            const chatId = uid.slice(0, 9) + firebase_auth.currentUser?.uid.slice(0, 9);
            const chatDocRef = doc(db, chatId);
    
            await setDoc(chatDocRef, {
                id: chatId,
                chatName: name,
                user: firebase_auth.currentUser?.displayName,
                userAvatar: firebase_auth.currentUser?.photoURL,
                photoURL: photoURL,
            });
    
            navigation.goBack();
        } catch (error) {
            console.log("Error creating conversation:", error);
        }
    };
    

    const fetchAllUserData = async () => {
        try {
            const querySnapshot = await getDocs(collection(firebase_db, 'users'));
            const userData = querySnapshot.docs.map((doc) => doc.data());
            setUsers(userData);
            console.log('All user data:', userData);
            return userData;
        } catch (error) {
            console.error('Error fetching user data:', error.message);
            return null;
        }
    };

    useEffect(() => {
        fetchAllUserData();
    }, []);

    useLayoutEffect(() => {
        navigation.setOptions({
            title: "Add New Chat",
            headerBackTitle: "Chats",
        });
    }, [navigation]);

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <Input
                placeholder="Enter Chat Name"
                value={input}
                onChangeText={text => setInput(text)}
                onSubmitEditing={createChat}
                leftIcon={
                    <Icon name="wechat" type="antdesign" size={24} color="black" />
                }
            />
            <Button onPress={createChat} buttonStyle={{backgroundColor:"#991b1b"}} title="Create New Chat" />
            <ScrollView>
                {users.map((result, index) => (
                    <Card style={customstyles.my_5} key={index} onPress={() => { newConversation(result.uid, result.name, result.photoURL) }}>
                        <Card.Title
                            title={result.name}
                            left={(props) => (
                                <Avatar.Image {...props} source={{ uri: result.photoURL }} />
                            )}
                            right={(props) => (
                                <View style={customstyles.grid}>
                                    <IconButton icon="arrow-right-circle"
                                        onPress={() => { newConversation(result.uid, result.name, result.photoURL) }} />
                                </View>
                            )}
                        />
                    </Card>
                ))}
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        padding: 10,
        height: "100%"
    },
    profileImage: {},
    userCard: {
        padding: 16,
        backgroundColor: "#e0e0e0",
        marginBottom: 8,
        borderRadius: 8,
    },
});
