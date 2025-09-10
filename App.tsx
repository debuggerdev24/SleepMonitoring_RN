import React, { useEffect, useState } from 'react';
import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import SplashScreen from './src/Custom/spalshScreen';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      {showSplash ? <SplashScreen /> : <AppNavigator />}
      {/* <SplashScreen />  */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
