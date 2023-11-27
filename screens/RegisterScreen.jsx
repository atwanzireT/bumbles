import React, { useLayoutEffect, useState } from "react";
import { KeyboardAvoidingView, StyleSheet } from "react-native";
import { Input, Button, Text } from "react-native-elements";
import { firebase_auth, firebase_db } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { addDoc, collection } from "firebase/firestore";
import { ActivityIndicator } from "react-native-paper";


export default function RegisterScreen({ navigation }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [loading, setLoading] = useState(false);

    useLayoutEffect(() => {
        navigation.setOptions({
            title: "Back To Login",
        });
    }, [navigation]);

    const register = async () => {
        setLoading(true);
        try {
            // Create user in Firebase Authentication
            const authUser = await createUserWithEmailAndPassword(firebase_auth, email, password);

            // Update user display name and photo URL
            await updateProfile(authUser.user, {
                displayName: name,
                photoURL:
                    imageUrl ||
                    'https://2.bp.blogspot.com/-UpC5KUoUGM0/V7InSApZquI/AAAAAAAAAOA/7GwJUqTplMM7JdY6nCAnvXIi8BD6NnjPQCK4B/s1600/albert_einstein_by_zuzahin-d5pcbug.jpg',
            });

            // Save user data to Firestore
            const userDocRef = await addDoc(collection(firebase_db, 'users'), {
                uid: authUser.user.uid,
                email: authUser.user.email,
                name: name,
                photoURL: authUser.user.photoURL || '',
                // Add any other user data you want to save to Firestore
            });
            setLoading(true);
            console.log('User registered successfully:', authUser.user);
            console.log('User data saved to Firestore with ID:', userDocRef.id);
        } catch (error) {
            // Handle registration errors
            setLoading(true);
            console.error('Error during registration:', error.message);
        }
    };


    return (
        <KeyboardAvoidingView style={styles.container}>
            <StatusBar style="light" />
            <View style={styles.inputContainer}>
                <Text h3 style={{ marginTop: 30 }}>
                    Create A Bubble Account
                </Text>
                <Input placeholder="Full Name"
                    autoFocus
                    type="text"
                    value={name}
                    onChangeText={text => setName(text)}
                />
                <Input placeholder="Email"
                    type="email"
                    value={email}
                    onChangeText={text => setEmail(text)}
                />
                <Input placeholder="Pasword"
                    secureTextEntry
                    type="password"
                    value={password}
                    onChangeText={text => setPassword(text)}
                />
                <Input placeholder="Profile Picture Uri [Optional]"
                    type="text"
                    value={imageUrl}
                    onChangeText={text => setImageUrl(text)}
                />
            </View>
            {loading ? <ActivityIndicator color="#991b1b" size="small"/> :
                <Button title="Register"
                    containerStyle={styles.button}
                    onPress={() => register()}
                    buttonStyle={{ backgroundColor: "#991b1b" }} />

            }
            <View style={{ height: 5 }} />
        </KeyboardAvoidingView>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 35,
        backgroundColor: "white",
    },
    inputContainer: {
        width: "100%",
    },
    button: {
        width: "100%",
        marginTop: 5,

    },
})