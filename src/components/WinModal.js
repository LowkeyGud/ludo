import LottieView from 'lottie-react-native';
import React, {useEffect, useState} from 'react';
import {Modal, StyleSheet, Text, View} from 'react-native';
import {useDispatch} from 'react-redux';
import fireworkAnimation from '../assets/animation/firework.json';
import girlAnimation from '../assets/animation/girl.json';
import trophyAnimation from '../assets/animation/trophy.json';
import {resetAndNavigate} from '../helpers/NavigationUtil';
import {colorPlayer} from '../helpers/PlotData';
import {playSound} from '../helpers/SoundUtility';
import {announceWinner, resetGame} from '../redux/reducers/gameSlice';
import GradientButton from './GradientButton';
import Pile from './Pile';

const WinModal = ({winner}) => {
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(!!winner);
  useEffect(() => {
    setVisible(!!winner);
  }, [winner]);

  const handleNewGame = () => {
    dispatch(resetGame());
    dispatch(announceWinner(null));
    playSound('game_start');
  };

  const handleHome = () => {
    dispatch(resetGame());
    resetAndNavigate('HomeScreen');
    dispatch(announceWinner(null));
  };
  return (
    <Modal
      accessibilityLabel="win-modal"
      transparent={true}
      style={styles.modal}
      animationType="fade"
      visible={visible}
      onRequestClose={() => setVisible(false)}>
      <View style={styles.content}>
        <View style={styles.pileContainer}>
          <Pile player={1} color={colorPlayer[winner - 1]} />
        </View>

        <Text style={{color: '#fff', fontSize: 18, fontWeight: 'bold'}}>
          Congratulations! Player {winner}!
        </Text>

        <LottieView
          autoPlay
          hardwareAccelerationAndroid={true}
          source={trophyAnimation}
          style={styles.trophyAnimation}
        />
        <LottieView
          autoPlay
          hardwareAccelerationAndroid={true}
          source={fireworkAnimation}
          style={styles.fireworkAnimation}
        />

        <GradientButton title="New Game" onPress={handleNewGame} />
        <GradientButton title="Home" onPress={handleHome} />
      </View>

      <LottieView
        autoPlay
        hardwareAccelerationAndroid={true}
        source={girlAnimation}
        style={styles.girlAnimation}
        loop={true}
        // They say it doesn't work on android
        // https://www.npmjs.com/package/lottie-react-native#:~:text=NOTE%3A%20This%20feature%20may%20not%20work%20properly%20on%20Android.%20We%20will%20try%20fix%20it%20soon
        colorFilters={[
          {
            keypath: 'hair Outlines', // After Effect Layers
            color: '#FF0000',
          },
        ]}
      />
    </Modal>
  );
};

export default WinModal;

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradientContainer: {
    borderRadius: 20,
    // padding: 20,
    width: '96%',
    borderWidth: 2,
    borderColor: 'gold',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 40,
  },
  pileContainer: {
    width: 90,
    height: 40,
  },

  congratsText: {
    fontSize: 18,
    color: 'white',
    fontFamily: 'Philosopher-Bold',
    marginTop: 10,
  },
  trophyAnimation: {
    height: 200,
    width: 200,
    marginTop: 20,
  },
  fireworkAnimation: {
    height: 200,
    width: 500,
    position: 'absolute',
    zIndex: -1,
    marginTop: 20,
  },
  girlAnimation: {
    height: 500,
    width: 380,
    position: 'absolute',
    bottom: -200,
    right: -120,
    zIndex: 99,
  },
});
