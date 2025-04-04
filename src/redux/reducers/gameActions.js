import {
  SafeSpots,
  StarSpots,
  startingPoints,
  turningPoints,
  victoryStart,
} from '../../helpers/PlotData';
import {playSound} from '../../helpers/SoundUtility';
import {selectCurrentPositions, selectDiceNo} from './gameSelector';
import {
  announceWinner,
  disableTouch,
  unfreezeDice,
  updateFireworks,
  updatePlayerChance,
  updatePlayerPieceValue,
} from './gameSlice';

const delay = duration => new Promise(resolve => setTimeout(resolve, duration));

const checkWinningCriteria = pieces => {
  for (let piece of pieces) {
    if (piece.travelCount < 57) {
      return false;
    }
  }
  return true;
};

export const handleForwardThunk = (playerNo, id, pos) => {
  return async (dispatch, getState) => {
    const state = getState();
    const plottedPieces = selectCurrentPositions(state);
    const diceNo = selectDiceNo(state);

    let alpha =
      playerNo === 1 ? 'A' : playerNo === 2 ? 'B' : playerNo === 3 ? 'C' : 'D';

    const peicesAtPosition = plottedPieces.filter(e => e.pos === pos);
    const piece =
      peicesAtPosition[peicesAtPosition.findIndex(e => e.id[0] == alpha)];

    dispatch(disableTouch());

    let finalPath = piece.pos;
    const beforePlayerPiece = state.game[`player${playerNo}`].find(
      e => e.id === id,
    );
    let travelCount = beforePlayerPiece?.travelCount;

    for (let i = 0; i < diceNo; i++) {
      const updatedPosition = getState();
      const playerPiece = updatedPosition.game[`player${playerNo}`].find(
        e => e.id === id,
      );
      let path = playerPiece?.pos + 1;
      if (turningPoints.includes(path) && turningPoints[playerNo - 1] == path) {
        path = victoryStart[playerNo - 1];
      }

      if (path == 53) {
        path = 1;
      }

      finalPath = path;
      travelCount += 1;

      dispatch(
        updatePlayerPieceValue({
          playerNo: `player${playerNo}`,
          pieceId: playerPiece?.id,
          pos: path,
          travelCount: travelCount,
        }),
      );
      playSound('pile_move');
      delay(5400);
    }

    const updatedState = getState();
    const updatedPlottedPieces = selectCurrentPositions(updatedState);
    const finalPlot = updatedPlottedPieces.filter(e => e.pos == finalPath);
    const ids = finalPlot.map(e => e.id[0]);

    const uniqueIDs = new Set(ids);
    const areDifferentIds = uniqueIDs.size > 1;

    logic.log('finalPath', finalPath);
    logic.log('ids', ids);
    logic.log('uniqueIDs', uniqueIDs);
    logic.log('areDifferentIds', areDifferentIds);

    if (SafeSpots.includes(finalPath) || StarSpots.includes(finalPath)) {
      playSound('safe_spot');
    }

    if (
      areDifferentIds &&
      !SafeSpots.includes(finalPath[0].pos) &&
      !StarSpots.includes(finalPath[0].pos)
    ) {
      const enemyPiece = finalPlot.find(p => p.id[0] !== id[0]);
      const enemyId = enemyPiece.id[0];
      let no =
        enemyId === 'A' ? 1 : enemyId === 'B' ? 2 : enemyId === 'C' ? 3 : 4;

      let backwordPath = startingPoints[no - 1];
      let i = enemyPiece.pos;
      playSound('collide');

      while (i !== backwordPath) {
        dispatch(
          updatePlayerPieceValue({
            playerNo: `player${no}`,
            pieceId: enemyPiece.id,
            pos: i,
            travelCount: 0,
          }),
        );

        await delay(0.4);
        i--;
        if (i === 0) {
          i = 52;
        }
      }

      dispatch(
        updatePlayerPieceValue({
          playerNo: `player${no}`,
          pieceId: enemyPiece.id,
          pos: 0,
          travelCount: 0,
        }),
      );

      dispatch(unfreezeDice());
    }

    // smae player gets second chance if he rolls 6 or reaches home
    if (diceNo == 6 || travelCount == 57) {
      dispatch(updatePlayerChance({chancePlayer: playerNo}));

      if (travelCount == 57) {
        playSound('home_win');
        const finalPlayerState = getState();
        const playerAllPieces = finalPlayerState.game[`player${playerNo}`];

        if (checkWinningCriteria(playerAllPieces)) {
          dispatch(announceWinner(playerNo));
          playSound('cheer');
          return;
        }

        dispatch(updateFireworks(true));
        dispatch(unfreezeDice());
        return;
      }
    } else {
      console.log(playerNo, 'chancePlayer');

      let chancePlayer = playerNo + 1;
      if (chancePlayer >= 5) {
        chancePlayer = 1;
      }
      dispatch(updatePlayerChance({chancePlayer}));
    }
  };
};
