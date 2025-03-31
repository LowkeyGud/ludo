import React, {useCallback} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import Logo from '../assets/images/logo.png';
import GradientButton from '../components/GradientButton';
import Wrapper from '../components/Wrapper';
import {deviceHeight, deviceWidth} from '../constants/Scaling';

const HomeScreen = () => {
  const renderButton = useCallback((title, onPress) => (
    <GradientButton title={title} onPress={onPress} />
  ));

  const handleNewGamePress = useCallback(() => {
    // Add your navigation logic here
    console.log('New Game Pressed');
  }, []);

  return (
    <Wrapper style={styles.mainContainer}>
      <View style={styles.imgContainer}>
        <Image source={Logo} style={styles.img} />
      </View>
      {renderButton('Start New Game', handleNewGamePress)}
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    justifyContent: 'flex-start',
  },
  imgContainer: {
    width: deviceWidth * 0.8,
    height: deviceHeight * 0.4,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    alignSelf: 'center',
  },
  img: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});

export default HomeScreen;
