import React, {useEffect, useRef} from 'react';
import {Animated, Image, StyleSheet} from 'react-native';
import Logo from '../assets/images/logo.png';
import Wrapper from '../components/Wrapper';
import {deviceHeight, deviceWidth} from '../constants/Scaling';
import {prepareNavigation, resetAndNavigate} from '../helpers/NavigationUtil';

const SplashScreen = () => {
  const scale = useRef(new Animated.Value(1)).current;
  const animation = useRef(null);

  useEffect(() => {
    prepareNavigation();

    const timeout = setTimeout(() => {
      resetAndNavigate('HomeScreen');
    }, 1500);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    animation.current = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.2,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
    );

    animation.current.start();

    return () => {
      animation.current?.stop();
    };
  }, []);
  return (
    <Wrapper>
      <Animated.View style={{transform: [{scale}]}}>
        <Image testID="logo-image" source={Logo} style={styles.imgContainer} />
      </Animated.View>
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  imgContainer: {
    width: deviceWidth * 0.7,
    height: deviceHeight * 0.6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  img: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});

export default SplashScreen;
