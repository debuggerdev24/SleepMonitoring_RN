// import React, { useEffect } from 'react';
// import { View, StyleSheet, StatusBar, Image } from 'react-native';

// const SplashScreen = () => {
//     return (
//         <View style={styles.container}>
//             <Image style={styles.animation} source={require('../assest/images/baby.gif')} />
//             <StatusBar hidden />          
//         </View>
//     );
// };

// export default SplashScreen;

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#4A90E2',
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     animation: {
//         width: 250,
//         height: 250,
//     },
// });

import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  Image,
  Text,
  Animated,
} from 'react-native';

const SplashScreen = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current; // opacity
  const translateY = useRef(new Animated.Value(20)).current; // slide up

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();

    Animated.timing(translateY, {
      toValue: 0,
      duration: 1500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim, translateY]);

  return (
    <View style={styles.container}>
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY }],
            alignItems: 'center',
          }}
        >
      <Image
        style={styles.animation}
        source={require('../assest/images/baby.gif')}
      />

        {/* <Text style={styles.title}>Sweet Dreams</Text> */}
        <Text style={styles.subtitle}>Sleep Monitoring for Kids</Text>
      </Animated.View>

      <StatusBar hidden />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  animation: {
    width: 250,
    height: 250,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 34,
    color: '#f0f0f0',
  },
});
