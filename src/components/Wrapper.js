import {BlurView} from '@react-native-community/blur';
import React from 'react';
import {ImageBackground, SafeAreaView, StyleSheet} from 'react-native';
import BG from '../assets/images/bg.jpeg';
import {deviceHeight, deviceWidth} from '../constants/Scaling';

const Wrapper = ({children, style}) => {
  return (
    <ImageBackground
      source={BG}
      resizeMode="cover"
      style={StyleSheet.container}>
      <BlurView
        style={styles.blurView}
        blurType="dark" // Options: 'light', 'dark', 'xlight', etc.
        blurAmount={1} // Adjust blur intensity (0-100, default is 10)
      />
      <SafeAreaView style={[styles.safeAreaView, style]}>
        {children}
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  safeAreaView: {
    height: deviceHeight,
    width: deviceWidth,
    justifyContent: 'center',
    alignItems: 'center',
  },
  blurView: {
    ...StyleSheet.absoluteFill, // Cover the entire screen
  },
});
export default Wrapper;
