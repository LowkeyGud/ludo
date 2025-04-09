import {memo, useCallback, useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useDispatch, useSelector} from 'react-redux';
import {Colors} from '../constants/Colors';
import {ArrowSpot, SafeSpots, StarSpots} from '../helpers/PlotData';
import {handleForwardThunk} from '../redux/reducers/gameActions';
import {selectCurrentPositions} from '../redux/reducers/gameSelector';
import Pile from './Pile';

const Cell = ({id, color}) => {
  const dispatch = useDispatch();
  const plotedPieces = useSelector(selectCurrentPositions);

  const isSafeSpot = useMemo(() => SafeSpots.includes(id), [id]);
  const isStarSpot = useMemo(() => StarSpots.includes(id), [id]);
  const isArrowSpot = useMemo(() => ArrowSpot.includes(id), [id]);

  const arrowValue =
    id === 38 ? '180deg' : id === 25 ? '90deg' : id === 12 ? '0deg' : '-90deg';

  const peicesAtPosition = useMemo(
    () => plotedPieces.filter(item => item.pos == id),
    [plotedPieces, id],
  );

  const handlePress = useCallback(
    (playerNo, pieceId) => {
      dispatch(handleForwardThunk(playerNo, pieceId, id));
    },
    [dispatch, id],
  );

  return (
    <View
      style={[
        styles.container,
        {backgroundColor: isSafeSpot ? color : Colors.white},
      ]}>
      {isStarSpot && (
        <Ionicons name="star-outline" size={20} color={Colors.grey} />
      )}
      {isArrowSpot && (
        <Ionicons
          name="arrow-forward-outline"
          size={RFValue(12)}
          color={Colors.grey}
          style={{transform: [{rotate: arrowValue}]}}
        />
      )}
      {peicesAtPosition.map((piece, index) => {
        const playerNo =
          piece.id[0] === 'A'
            ? 1
            : piece.id[0] === 'B'
            ? 2
            : piece.id[0] === 'C'
            ? 3
            : 4;
        const pieceColor =
          piece.id[0] === 'A'
            ? Colors.red
            : piece.id[0] === 'B'
            ? Colors.green
            : piece.id[0] === 'C'
            ? Colors.yellow
            : Colors.blue;

        return (
          <View
            key={piece.id}
            style={[
              styles.pieceContainer,
              {
                transform: [
                  {
                    scale: peicesAtPosition.length === 1 ? 1 : 0.7,
                  },
                  {
                    translateX:
                      peicesAtPosition.length === 1
                        ? 0
                        : index % 2 === 0
                        ? -6
                        : 6,
                  },
                  {
                    translateY:
                      peicesAtPosition.length === 1 ? 0 : index < 2 ? -6 : 6,
                  },
                ],
              },
            ]}>
            <Pile
              color={pieceColor}
              player={playerNo}
              cell={true}
              pieceId={piece.id}
              onPress={() => handlePress(playerNo, piece.id)}
            />
          </View>
        );
      })}
    </View>
  );
};

export default memo(Cell);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'grey',
    // zIndex: -109,
  },
  pieceContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
  },
});
