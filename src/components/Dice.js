import LottieView from 'lottie-react-native';
import React, {memo, useEffect, useRef, useState} from 'react';
import {
  Animated,
  Easing,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Diceroll from '../assets/animation/diceroll.json';
import Arrow from '../assets/images/arrow.png';
import {BackgroundImage} from '../helpers/GetIcons';
import {playSound} from '../helpers/SoundUtility';
import {
  selectCurrentPlayerChance,
  selectDiceNo,
  selectDiceRolled,
} from '../redux/reducers/gameSelector';
import {
  enableCellSelection,
  enablePileSelection,
  updateDiceNumber,
  updatePlayerChance,
} from '../redux/reducers/gameSlice';

const Dice = ({color, rotate, player, data}) => {
  const dispatch = useDispatch();
  const currentPlayerChance = useSelector(selectCurrentPlayerChance);
  const isDiceRolled = useSelector(selectDiceRolled);
  const diceNo = useSelector(selectDiceNo);
  const playerPieces = useSelector(
    state => state.game[`player${currentPlayerChance}`],
  );

  const pileIcon = BackgroundImage.GetImage(color);
  const diceIcon = BackgroundImage.GetImage(diceNo);

  const arrowAnimation = useRef(new Animated.Value(0)).current;

  const [diceRolling, setDiceRolling] = useState(false);

  useEffect(() => {
    function animateArrow() {
      Animated.loop(
        Animated.sequence([
          Animated.timing(arrowAnimation, {
            toValue: 10,
            duration: 600,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(arrowAnimation, {
            toValue: -10,
            duration: 600,
            easing: Easing.in(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ).start();
    }

    animateArrow();
  }, [currentPlayerChance, isDiceRolled]);

  const delay = duration =>
    new Promise(resolve => setTimeout(resolve, duration));

  const handleDicePress = async predice => {
    const diceNumber = predice || Math.ceil(Math.random() * 6);
    // const diceNumber = 3;
    playSound('dice_roll');
    setDiceRolling(true);
    await delay(1300);
    dispatch(updateDiceNumber({diceNo: diceNumber}));
    setDiceRolling(false);
    const isAnyPieceAlive = data?.findIndex(e => e.pos !== 0 && e.pos !== 57);
    const isAnyPieceLocked = data?.findIndex(e => e.pos !== 0);

    if (isAnyPieceAlive == -1) {
      if (diceNumber === 6) {
        dispatch(enablePileSelection({playerNo: player}));
      } else {
        let chancePlayer = player + 1;
        if (chancePlayer > 4) {
          chancePlayer = 1;
        }
        await delay(600);
        dispatch(updatePlayerChance({chancePlayer}));
      }
    } else {
      const canMove = playerPieces.some(
        pile => pile.travelCount + diceNumber <= 57 && pile.pos !== 0,
      );

      if (
        (!canMove && diceNumber === 6 && isAnyPieceLocked == -1) ||
        (!canMove && diceNumber !== 6 && isAnyPieceLocked != -1) ||
        (!canMove && diceNumber !== 6 && isAnyPieceLocked == -1)
      ) {
        let chancePlayer = player + 1;
        if (chancePlayer > 4) {
          chancePlayer = 1;
        }
        await delay(600);
        dispatch(updatePlayerChance({chancePlayer}));
        return;
      }

      if (diceNumber === 6) {
        dispatch(enablePileSelection({playerNo: player}));
      }
      dispatch(enableCellSelection({playerNo: player}));
    }
  };

  return (
    <View style={[styles.flexRow, {transform: [{scaleX: rotate ? -1 : 1}]}]}>
      <View style={[styles.border1, {backgroundColor: color}]}>
        <View style={styles.pileContainer}>
          <Image source={pileIcon} style={styles.pileIcon} />
        </View>
      </View>

      <View style={styles.border2}>
        <View style={styles.diceContainer}>
          {currentPlayerChance === player && !diceRolling && (
            <TouchableOpacity
              disabled={isDiceRolled || diceRolling}
              activeOpacity={0.5}
              onPress={() => handleDicePress(0)}
              //  Cheating move😂
              onLongPress={() => handleDicePress(6)}>
              <Image source={diceIcon} style={styles.diceIcon} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {diceRolling && (
        <LottieView
          source={Diceroll}
          loop={false}
          autoPlay={true}
          style={styles.rollingDice}
          cacheComposition={true}
          hardwareAccelerationAndroid={true}
        />
      )}

      {currentPlayerChance === player && !isDiceRolled && (
        <Animated.View style={{transform: [{translateX: arrowAnimation}]}}>
          <Image source={Arrow} style={{width: 50, height: 30}} />
        </Animated.View>
      )}
    </View>
  );
};

export default memo(Dice);

const styles = StyleSheet.create({
  flexRow: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  border1: {
    padding: 1,
    borderWidth: 3,
    borderRightWidth: 0,
    borderColor: '#fff',
  },
  border2: {
    borderWidth: 3,
    padding: 1,
    borderRadius: 10,
    borderLeftWidth: 3,
  },
  pileIcon: {
    width: 30,
    height: 30,
  },
  pileContainer: {
    paddingHorizontal: 3,
    width: 35,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  diceContainer: {
    backgroundColor: '#d0d0d0',
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 5,
    width: 55,
    height: 55,
    paddingVertical: 4,
    paddingHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  diceGradient: {
    borderWidth: 3,
    borderLeftWidth: 3,
    borderColor: '#f0ce2c',
    justifyContent: 'center',
    alignItems: 'center',
  },
  diceIcon: {
    height: 45,
    width: 45,
    zIndex: 100,
  },
  rollingDice: {
    height: 80,
    width: 80,
    zIndex: 99,
    top: -19,
    left: 38,
    position: 'absolute',
  },
});
