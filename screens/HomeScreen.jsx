import React, { useEffect, useLayoutEffect, useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Touchable, TouchableOpacity, View } from "react-native";
import { Avatar, Text } from "react-native-elements";
import CustomListItem from "../component/customListItems";
import { StatusBar } from "expo-status-bar";
import { firebase_auth, firebase_db } from "../firebase";
import { signOut } from "firebase/auth";
import { AntDesign, SimpleLineIcons } from "@expo/vector-icons";
import { collection, doc, onSnapshot, getDoc, getDocs } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HomeScreen({ navigation }) {
    const [chats, setChats] = useState([]);
    console.log("User Name: ", firebase_auth.currentUser?.displayName)

    const signOutUser = async () => {
        try {
            await signOut(firebase_auth);
            await AsyncStorage.removeItem('uid', null);
            await AsyncStorage.removeItem('email', null);
            await AsyncStorage.removeItem('password', null);

            navigation.navigate("Login");
            console.log('User signed out successfully');
        } catch (error) {
            console.error('Error signing out:', error.message);
        }
    }

    useEffect(() => {
        const chatRef = collection(firebase_db, 'chats');
        const unsubscribe = onSnapshot(chatRef, (querySnapshot) => {
            const updatedChats = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                data: doc.data()
            }));
            setChats(updatedChats);
        });

        // Cleanup function to unsubscribe when the component unmounts or when the dependency array changes.
        return () => {
            unsubscribe();
        };
    }, []);



    const enterChat = (id, name) => {
        navigation.navigate('Chat', {
            id: id,
            chatName: name,
        })
    }
    useLayoutEffect(() => {
        navigation.setOptions({
            title: "Bumbles",
            headerStyle: { backgroundColor: "#fff" },
            headerTitleStyle: { color: "black" },
            headerTintColor: "black",
            headerLeft: () => (
                <View style={{ marginLeft: 15 }}>
                    <TouchableOpacity>
                        <Avatar
                            onPress={signOutUser}
                            enterChat={enterChat}
                            rounded source={{ uri: firebase_auth.currentUser?.photoURL }} />
                    </TouchableOpacity>
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
                        <AntDesign name="camera" size={24} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { navigation.navigate("AddChat") }}>
                        <SimpleLineIcons name="pencil" color="black" size={24} />
                    </TouchableOpacity>
                </View>
            ),
        });
    }, [navigation])
    return (
        <SafeAreaView>
            <StatusBar style="dark" />
            <ScrollView style={styles.container}>
                {chats.map(({ id, data: { chatName, user } }) => {
                    if (chatName === firebase_auth.currentUser?.displayName) {
                        return <CustomListItem key={id} id={id} chatName={user} enterChat={() => enterChat(id, user)} />;
                    }
                    return <CustomListItem key={id} id={id} chatName={chatName} enterChat={() => enterChat(id, chatName)} />;
                })}
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        height: "100%",
        marginTop: 2,
    }
})