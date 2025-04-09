import LottieView from 'lottie-react-native';
import React, {memo, useCallback, useEffect, useMemo, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Polygon, Svg} from 'react-native-svg';
import {useDispatch, useSelector} from 'react-redux';
import Firework from '../assets/animation/firework.json';
import {Colors} from '../constants/Colors';
import {deviceHeight, deviceWidth} from '../constants/Scaling';
import {selectFireworks} from '../redux/reducers/gameSelector';
import {updateFireworks} from '../redux/reducers/gameSlice';
import Pile from './Pile';

const SIZE = 300;

const PlayerPieces = memo(({player, style, pieceColor, translate}) => {
  return (
    <View style={[styles.mainContainer, style]}>
      {player.map((piece, index) => {
        return (
          <View
            pointerEvents={'none'}
            key={piece.id}
            style={{
              top: 0,
              zIndex: 99,
              position: 'absolute',
              bottom: 0,
              transform: [
                {scale: 0.5},
                translate === 'translateX'
                  ? {translateX: 14 * index}
                  : {translateY: 14 * index},
              ],
            }}>
            <Pile
              cell={true}
              player={player}
              onPress={() => null}
              pieceId={piece.id}
              color={pieceColor}
            />
          </View>
        );
      })}
    </View>
  );
});

const FourTriangle = ({player1, player2, player3, player4}) => {
  const [showFirework, setShowFirework] = useState(false);
  const isFirework = useSelector(selectFireworks);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isFirework) {
      setShowFirework(true);

      const timer = setTimeout(() => {
        setShowFirework(false);
        dispatch(updateFireworks(false));
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isFirework]);

  const playersData = useMemo(
    () => [
      {
        player: player1,
        top: 55,
        left: 18,
        pieceColor: Colors.red,
        translate: 'translateX',
      },
      {
        player: player3,
        bottom: 52,
        left: 18,
        pieceColor: Colors.yellow,
        translate: 'translateX',
      },
      {
        player: player2,
        top: 27,
        left: -2,
        pieceColor: Colors.green,
        translate: 'translateY',
      },
      {
        player: player4,
        top: 27,
        right: -2,
        pieceColor: Colors.blue,
        translate: 'translateY',
      },
    ],
    [player1, player2, player3, player4],
  );

  const renderPlayerPieces = useCallback(
    (data, index) => {
      return (
        <PlayerPieces
          key={index}
          player={data.player.filter(e => e.travelCount === 57)}
          style={{
            top: data.top,
            bottom: data.bottom,
            left: data.left,
            right: data.right,
            zIndex: 100,
          }}
          pieceColor={data.pieceColor}
          translate={data.pieceColor}
        />
      );
    },
    [playersData],
  );

  return (
    <View style={styles.container}>
      {showFirework && (
        <LottieView
          source={Firework}
          speed={1}
          style={styles.lottieView}
          autoPlay
          loop
          hardwareAccelerationAndroid
        />
      )}
      <Svg height={SIZE} width={SIZE - 5}>
        <Polygon
          points={`0,0,${SIZE / 2},${SIZE / 2},${SIZE},0`}
          fill={Colors.yellow}
        />
        <Polygon
          points={`${SIZE},0 ${SIZE},${SIZE} ${SIZE / 2},${SIZE / 2}`}
          fill={Colors.blue}
        />
        <Polygon
          points={`0,${SIZE} ${SIZE / 2},${SIZE / 2} ${SIZE}, ${SIZE}`}
          fill={Colors.red}
        />
        <Polygon
          points={`0,0 ${SIZE / 2},${SIZE / 2} 0,${SIZE}`}
          fill={Colors.green}
        />
      </Svg>
      {playersData.map(renderPlayerPieces)}
    </View>
  );
};

export default memo(FourTriangle);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '20%',
    height: '100%',
    borderWidth: 0.8,
    overflow: 'hidden',
    backgroundColor: Colors.white,
    borderColor: Colors.borderColor,
  },
  lottieView: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: 2,
  },
  mainContainer: {
    width: deviceHeight * 0.063,
    height: deviceWidth * 0.032,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  },
});
