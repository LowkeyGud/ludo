import {useIsFocused} from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import React, {useCallback, useEffect, useRef} from 'react';
import {Animated, Image, Pressable, StyleSheet, View} from 'react-native';
import SoundPlayer from 'react-native-sound-player';
import {useDispatch, useSelector} from 'react-redux';
import Witch from '../assets/animation/witch.json';
import Logo from '../assets/images/logo.png';
import GradientButton from '../components/GradientButton';
import Wrapper from '../components/Wrapper';
import {deviceHeight, deviceWidth} from '../constants/Scaling';
import {navigate} from '../helpers/NavigationUtil';
import {playSound} from '../helpers/SoundUtility';
import {selectCurrentPositions} from '../redux/reducers/gameSelectore';
import {resetGame} from '../redux/reducers/gameSlice';

const HomeScreen = () => {
  const dispatch = useDispatch();
  const currentPositions = useSelector(selectCurrentPositions);

  const witchAnim = useRef(new Animated.Value(-deviceHeight)).current;
  const scaleAnim = useRef(new Animated.Value(-1)).current;
  const isFocused = useIsFocused();

  useEffect(() => {
    const loopAnimation = () => {
      Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(witchAnim, {
              toValue: deviceWidth * 0.1,
              duration: 6000,
              useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
              toValue: -1,
              duration: 0,
              useNativeDriver: true,
            }),
          ]),
          Animated.delay(1000),
          Animated.parallel([
            Animated.timing(witchAnim, {
              toValue: deviceWidth / 1.5,
              duration: 8000,
              useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
              toValue: -0.7,
              duration: 8000,
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(witchAnim, {
              toValue: -deviceWidth * 0.05,
              duration: 3000,
              useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
              toValue: 1,
              duration: 0,
              useNativeDriver: true,
            }),
          ]),
          Animated.delay(1000),
          Animated.parallel([
            Animated.timing(witchAnim, {
              toValue: -deviceWidth * 2,
              duration: 8000,
              useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
              toValue: 1,
              duration: 0,
              useNativeDriver: true,
            }),
          ]),
        ]),
      ).start();
    };

    const cleanup = () => {
      Animated.timing(witchAnim).stop();
      Animated.timing(scaleAnim).stop();
    };

    loopAnimation();

    return cleanup;
  }, []);

  useEffect(() => {
    if (isFocused) {
      playSound('home');
    }
  }, [isFocused]);

  const renderButton = useCallback((title, onPress) => (
    <GradientButton title={title} onPress={onPress} />
  ));

  const startNewGame = async (isNewGame = false) => {
    SoundPlayer.stop();
    console.log('Pressed');

    if (isNewGame) {
      dispatch(resetGame());
    }
    navigate('LudoBoardScreen');
    playSound('game_start');
    console.log('done');
  };

  const handleNewGamePress = useCallback(() => {
    startNewGame(true);
  }, []);
  const handleResumePress = useCallback(() => {
    startNewGame(false);
  }, []);

  return (
    <Wrapper style={styles.mainContainer}>
      <View style={styles.imgContainer}>
        <Image source={Logo} style={styles.img} />
      </View>
      {/* Ensure conditional rendering works */}
      {!!currentPositions && renderButton('RESUME', handleResumePress)}
      {renderButton('Start New Game', handleNewGamePress)}

      <Animated.View
        style={[
          styles.witchContainer,
          {transform: [{translateX: witchAnim}, {scaleX: scaleAnim}]},
        ]}>
        <Pressable
          onPress={() => {
            const rand = Math.floor(Math.random() * 3) + 1;
            playSound(`girl${rand}`);
          }}>
          <LottieView
            hardwareAccelerationAndroid
            source={Witch}
            autoPlay
            speed={1}
            style={styles.witch}
          />
        </Pressable>
      </Animated.View>
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
  witchContainer: {
    position: 'absolute',
    top: '60%',
    left: '24%',
  },
  witch: {
    height: 250,
    width: 250,
    transform: [{rotate: '25deg'}],
  },
});

export default HomeScreen;
