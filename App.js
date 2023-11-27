import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import AddChatScreen from './screens/AddChatScreen';
import ChatScreen from './screens/ChatScreen';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import { useEffect, useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth'; // Import signInWithEmailAndPassword from firebase_auth
import { firebase_auth } from './firebase';
import SplashScreen from './screens/SplashScreen';

const Stack = createStackNavigator();

const globalScreenOptions = {
  headerStyle: { backgroundColor: "#991b1b" },
  headerTitleStyle: { color: "white" },
  headerTintColor: "white",
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const autoLogin = async () => {
      try {
        const useremail = await AsyncStorage.getItem('email');
        const userpassword = await AsyncStorage.getItem('password');

        if (useremail && userpassword) {
          await signInWithEmailAndPassword(firebase_auth, useremail, userpassword);
          console.log(useremail, " ", userpassword);
          console.log("User logged in successfully.");
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
          console.log("Email or password not found.");
        }
      } catch (error) {
        console.error(`Auto Login Failed: ${error.message}`);
      }
    };

    autoLogin();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={globalScreenOptions}>
        {isLoggedIn ? (
          <>
            <Stack.Screen name='Splash' component={SplashScreen}  options={{ headerShown: false }} />
            <Stack.Screen name='Home' component={HomeScreen} />
            <Stack.Screen name='AddChat' component={AddChatScreen} />
            <Stack.Screen name='Chat' component={ChatScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name='Splash' component={SplashScreen}  options={{ headerShown: false }}/>
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name='Register' component={RegisterScreen} />
            <Stack.Screen name='Home' component={HomeScreen} />
            <Stack.Screen name='AddChat' component={AddChatScreen} />
            <Stack.Screen name='Chat' component={ChatScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
