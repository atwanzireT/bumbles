import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Alert, View } from "react-native";
import { Button, Image, Input, Text } from "react-native-elements";
import { StyleSheet } from "react-native";
import { KeyboardAvoidingView } from "react-native";
import { firebase_app, firebase_auth } from "../firebase";
import {signInWithEmailAndPassword} from "firebase/auth";
import { ActivityIndicator } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    const signIn = async () => {
       if (!email || !password) {
            Alert.alert('Please enter both email and password.');
            return;
        }
        try {
            const userCredential = await signInWithEmailAndPassword(firebase_auth, email, password);
            const user = userCredential.user;
            setIsLoggingIn(true);

            await AsyncStorage.setItem('userLoggedIn', 'true');
            await AsyncStorage.setItem('uid', user.uid);
            await AsyncStorage.setItem('email', user.email);
            await AsyncStorage.setItem('password', password);

            navigation.replace('Home');
        } catch (error) {
            const errorMessage = error.message;
            setIsLoggingIn(false);
            Alert.alert(`Login failed: ${errorMessage}`);
        }
    };

    useEffect(() => {
        const unsubcribe = firebase_auth.onAuthStateChanged((authUser) => {
            if (authUser) {
                console.log("Current User: ", authUser);
                navigation.replace("Home");
            }
        })
        return unsubcribe();
    }, [])

    return (
        <KeyboardAvoidingView style={styles.container}>
            <StatusBar style="dark" />
            <Image source={require("../assets/icon.png")} style={{ width: 60, height: 60 }} />
            <Text style={{ color: "#991b1b", fontSize: 22, fontWeight: "800" }}>Bumbles</Text>
            <Text style={{ color: "#6b7280", fontSize: 12, fontWeight: "800" }}>YEDA</Text>
            <View style={styles.inputContainer}>
                <Input placeholder="Email"
                    autoFocus
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
            </View>
            {isLoggingIn ? <ActivityIndicator color="#991b1b" size="small" /> :
                <>
                    <Button title="LOGIN"
                        onPress={signIn}
                        buttonStyle={{ backgroundColor: "#991b1b" }}
                        containerStyle={styles.button} />
                    <Button title="Register"
                        onPress={() => navigation.navigate("Register")}
                        buttonStyle={{ borderColor: "#991b1b" }}
                        titleStyle={{ color: "#991b1b" }}
                        type="outline" containerStyle={styles.button} />
                    <View style={{ height: 5 }} />
                </>
            }

        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 30,
    },
    inputContainer: {
        width: "100%",
    },
    button: {
        width: "100%",
        marginTop: 5,
    },
})