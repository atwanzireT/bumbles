import React, { useLayoutEffect, useState, useEffect } from "react";
import { TouchableOpacity, View, SafeAreaView, KeyboardAvoidingView, Platform, StyleSheet, ScrollView, Text } from "react-native";
import { Avatar } from "react-native-elements";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { launchImageLibraryAsync } from 'expo-image-picker';
import { GiftedChat } from 'react-native-gifted-chat';
import { collection, addDoc, query, orderBy, getDocs, where } from 'firebase/firestore';
import { firebase_auth, firebase_db } from "../firebase";
import { StatusBar } from "expo-status-bar";

export default function ChatScreen({ navigation, route }) {
    const [messages, setMessages] = useState([]);

    useLayoutEffect(() => {
        navigation.setOptions({
            title: "Chat",
            headerTitleAlign: "left",
            headerTitle: () => (
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                    <Avatar
                        rounded
                        source={{ uri: 'https://2.bp.blogspot.com/-UpC5KUoUGM0/V7InSApZquI/AAAAAAAAAOA/7GwJUqTplMM7JdY6nCAnvXIi8BD6NnjPQCK4B/s1600/albert_einstein_by_zuzahin-d5pcbug.jpg' }}
                    />
                    <Text style={{ fontSize: 20, color: "white", marginLeft: 10 }}>{route.params.chatName}</Text>
                </View>
            ),
            headerRight: () => (
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        width: 80,
                        marginRight: 20
                    }}>
                    <TouchableOpacity>
                        <FontAwesome name="video-camera" size={20} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Ionicons name="call" size={20} color="white" />
                    </TouchableOpacity>
                </View>
            )
        });
    }, []);

    console.log("Chat Id: ", route.params.id);

    useEffect(() => {
        const loadMessages = async () => {
            const messagesCollectionRef = collection(firebase_db, 'messages');
            const messagesQuery = query(
                messagesCollectionRef,
                where('roomId', '==', route.params.id),
                orderBy('createdAt', 'desc')
            );

            try {
                const querySnapshot = await getDocs(messagesQuery);
                const loadedMessages = querySnapshot.docs.map(doc => {
                    const data = doc.data();
                    // Convert createdAt to a Date object
                    return { ...data, createdAt: data.createdAt.toDate() };
                });
                // Transform loadedMessages if needed (e.g., format dates)
                setMessages(loadedMessages);
            } catch (error) {
                console.error('Error loading messages from Firestore:', error);
            }
        };

        loadMessages();
    }, []);




    const onSend = async (newMessages = []) => {
        const messagesCollectionRef = collection(firebase_db, 'messages');

        newMessages.forEach(async message => {
            try {
                await addDoc(messagesCollectionRef, {
                    _id: messages.length + 1,
                    text: message.text || '',
                    image: message.image || '',
                    createdAt: new Date(),
                    user: {
                        _id: firebase_auth.currentUser?.uid,
                        name: firebase_auth.currentUser?.displayName,
                    },
                    roomId: route.params.id,
                });
            } catch (error) {
                console.error('Error adding message to Firestore:', error);
            }
        });

        setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages.map(m => ({
            ...m,
            user: {
                _id: firebase_auth.currentUser?.uid,
                name: firebase_auth.currentUser?.displayName,
            },
        }))));
    };



    const handleImagePress = async () => {
        try {
            const result = await launchImageLibraryAsync({
                mediaTypes: 'Images',
                allowsEditing: true,
                aspect: [7, 9],
                quality: 1,
            });

            if (!result.canceled) {
                const imageMessage = {
                    _id: result.creationTime, // Use a unique identifier (timestamp in this case)
                    image: result.assets[0].uri,
                    createdAt: new Date(result.creationTime),
                    user: {
                        _id: firebase_auth.currentUser?.uid
                    },
                };

                onSend([imageMessage]);
            }
        } catch (error) {
            console.error('Error picking image:', error);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
            <StatusBar style="light"/>
            <GiftedChat
                messages={messages}
                onSend={newMessages => onSend(newMessages)}
                user={{
                    _id: 1, // User's ID
                }}
                renderActions={() => (
                    <View style={styles.actionContainer}>
                        <TouchableOpacity onPress={handleImagePress}>
                            <FontAwesome name="camera" size={26} color="black" />
                        </TouchableOpacity>
                    </View>
                )}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    actionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: 50,
        marginBottom: 5,
        marginLeft: 10
    },
    footer: {},
});
