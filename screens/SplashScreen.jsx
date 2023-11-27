import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
   
    setTimeout(() => {
      navigation.navigate('Home' || "Login"); 
    }, 2000); 
  }, []);

  return (
    <View style={styles.container}>
      <Image source={require('../assets/icon.png')} style={styles.logo} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF', // Background color of the splash screen
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
});

export default SplashScreen;
