import {useIsFocused} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {Animated, StyleSheet, TouchableOpacity, View} from 'react-native';
import IonIcons from 'react-native-vector-icons/Ionicons';
import {useSelector} from 'react-redux';
import Start from '../assets/images/start.png';
import Dice from '../components/Dice';
import FourTriangle from '../components/FourTriangle';
import HorizontalPath from '../components/HorizontalPath';
import MenuModal from '../components/MenuModal';
import Pocket from '../components/Pocket';
import VerticalPath from '../components/VerticalPath';
import WinModal from '../components/WinModal';
import Wrapper from '../components/Wrapper';
import {Colors} from '../constants/Colors';
import {deviceHeight, deviceWidth} from '../constants/Scaling';
import {Plot1Data, Plot2Data, Plot3Data, Plot4Data} from '../helpers/PlotData';
import {playSound} from '../helpers/SoundUtility';
import {
  selectDiceTouch,
  selectPlayer1,
  selectPlayer2,
  selectPlayer3,
  selectPlayer4,
} from '../redux/reducers/gameSelector';

const LudoBoardScreen = () => {
  const player1 = useSelector(selectPlayer1);
  const player2 = useSelector(selectPlayer2);
  const player3 = useSelector(selectPlayer3);
  const player4 = useSelector(selectPlayer4);
  const isDiceTouch = useSelector(selectDiceTouch);
  const winner = useSelector(state => state.game.winner);

  const isFocused = useIsFocused();
  const opacity = useRef(new Animated.Value(0)).current;
  const [menuVisible, setMenuVisible] = useState(false);
  const [showStartImage, setShowStartImage] = useState(false);

  const handleMenuPress = () => {
    playSound('ui');
    setMenuVisible(true);
  };

  useEffect(() => {
    if (isFocused) {
      setShowStartImage(true);
      const blinkAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(opacity, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
      );
      blinkAnimation.start();

      const timer = setTimeout(() => {
        setShowStartImage(false);
        blinkAnimation.stop();
      }, 2000);
      return () => {
        clearTimeout(timer);
        blinkAnimation.stop();
      };
    }
  }, [isFocused]);
  return (
    <Wrapper>
      <TouchableOpacity style={styles.menuIcon} onPress={handleMenuPress}>
        <IonIcons name="menu-outline" size={30} color="white" />
      </TouchableOpacity>

      <View style={styles.container}>
        <View
          style={styles.flexRow}
          pointerEvents={isDiceTouch ? 'none' : 'auto'}>
          <Dice color={Colors.green} player={2} data={player2} />
          <Dice color={Colors.yellow} rotate player={3} data={player3} />
        </View>

        <View style={styles.ludoBoardContainer}>
          <View style={styles.plotContainer}>
            <Pocket color={Colors.green} player={2} data={player2} />
            <VerticalPath cells={Plot2Data} color={Colors.yellow} player={2} />
            <Pocket color={Colors.yellow} player={3} data={player3} />
          </View>

          <View style={styles.pathContainer}>
            <HorizontalPath cells={Plot1Data} color={Colors.green} player={1} />
            <FourTriangle
              player1={player1}
              player2={player2}
              player3={player3}
              player4={player4}
            />
            <HorizontalPath cells={Plot3Data} color={Colors.blue} player={3} />
          </View>

          <View style={styles.plotContainer}>
            <Pocket color={Colors.red} player={1} data={player1} />
            <VerticalPath cells={Plot4Data} color={Colors.red} player={4} />
            <Pocket color={Colors.blue} player={4} data={player4} />
          </View>
        </View>

        <View
          style={styles.flexRow}
          pointerEvents={isDiceTouch ? 'none' : 'auto'}>
          <Dice color={Colors.red} player={1} data={player1} />
          <Dice color={Colors.blue} rotate player={4} data={player4} />
        </View>
      </View>

      {showStartImage && (
        <Animated.Image
          source={Start}
          style={{
            width: deviceWidth * 0.5,
            height: deviceWidth * 0.2,
            position: 'absolute',
            opacity: opacity,
          }}
        />
      )}
      {menuVisible && (
        <MenuModal
          visible={menuVisible}
          onPressHide={() => setMenuVisible(false)}
        />
      )}

      {winner != null && <WinModal winner={winner} />}
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    justifyContent: 'center',
    height: deviceHeight * 0.5,
    width: deviceWidth,
  },
  flexRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 30,
  },
  ludoBoardContainer: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
  },
  menuIcon: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
  menuIconImage: {
    width: 30,
    height: 30,
  },
  plotContainer: {
    width: '100%',
    height: '40%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#ccc',
  },
  pathContainer: {
    flexDirection: 'row',
    width: '100%',
    height: '20%',
    backgroundColor: '#1E5162',
  },
});

export default LudoBoardScreen;
