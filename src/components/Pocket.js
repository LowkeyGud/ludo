import React, {memo, useCallback} from 'react';
import {StyleSheet, View} from 'react-native';
import {useDispatch} from 'react-redux';
import {Colors} from '../constants/Colors';
import {startingPoints} from '../helpers/PlotData';
import {
  unfreezeDice,
  updatePlayerPieceValue,
} from '../redux/reducers/gameSlice';
import Pile from './Pile';

const Pocket = ({color, player, data}) => {
  const dispatch = useDispatch();

  const handlePress = useCallback(value => {
    let playerNo = value.id.at(0);
    switch (playerNo) {
      case 'A':
        playerNo = 'player1';
        break;
      case 'B':
        playerNo = 'player2';
        break;
      case 'C':
        playerNo = 'player3';
        break;
      case 'D':
        playerNo = 'player4';
        break;
    }

    dispatch(
      updatePlayerPieceValue({
        playerNo,
        pieceId: value.id,
        pos: startingPoints[parseInt(playerNo.match(/\d+/)[0], 10) - 1],
        travelCount: 1,
      }),
    );

    dispatch(unfreezeDice());
  }, []);

  return (
    <View style={[styles.container, {backgroundColor: color}]}>
      <View style={styles.childFrame}>
        <View style={styles.flexRow}>
          <Plot
            pieceNo={0}
            player={player}
            color={color}
            data={data}
            onPress={handlePress}
          />
          <Plot
            pieceNo={1}
            player={player}
            color={color}
            data={data}
            onPress={handlePress}
          />
        </View>
        <View style={styles.flexRow}>
          <Plot
            pieceNo={2}
            player={player}
            color={color}
            data={data}
            onPress={handlePress}
          />
          <Plot
            pieceNo={3}
            player={player}
            color={color}
            data={data}
            onPress={handlePress}
          />
        </View>
      </View>
    </View>
  );
};

const Plot = ({color, player, pieceNo, data, onPress}) => {
  return (
    <View style={[styles.plot, {backgroundColor: color}]}>
      {data && data[pieceNo]?.pos === 0 && (
        <Pile
          color={color}
          player={player}
          cell={false}
          pieceId={data[pieceNo].id}
          onPress={() => onPress(data[pieceNo])}
        />
      )}
    </View>
  );
};

export default memo(Pocket);

const styles = StyleSheet.create({
  container: {
    width: '40%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.4,
  },
  childFrame: {
    backgroundColor: '#fff',
    width: '70%',
    height: '70%',
    borderColor: Colors.borderColor,
    padding: 15,
    borderWidth: 0.5,
    gap: 20,
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: '40%',
  },
  plot: {
    height: '80%',
    width: '36%',
    borderRadius: 100,
  },
});
