import {createSlice} from '@reduxjs/toolkit';
import {initialState} from './initialState';

export const gameSlice = createSlice({
  name: 'game',
  initialState: initialState,
  reducers: {
    resetGame: () => initialState,
    updateDiceNumber: (state, action) => {
      state.diceNo = action.payload.diceNo;
      state.isDiceRolled = false;
    },
    enablePileSelection: (state, action) => {
      state.diceTouchBlock = true;
      state.pileSelectionPlayer = action.payload.playerNo;
    },
    enableCellSelection: (state, action) => {
      state.diceTouchBlock = true;
      state.cellSelectionPlayer = action.payload.playerNo;
    },
    disableTouch: state => {
      state.diceTouchBlock = true;
      state.pileSelectionPlayer = -1;
      state.cellSelectionPlayer = -1;
    },
    unfreezeDice: state => {
      state.diceTouchBlock = false;
      state.isDiceRolled = false;
    },
    updateFireworks: (state, action) => {
      state.fireworks = action.payload;
    },
    announceWinner: (state, action) => {
      state.winner = action.payload;
    },
    updatePlayerChance: (state, action) => {
      state.chancePlayer = action.payload.chancePlayer;
      state.diceTouchBlock = false;
      state.isDiceRolled = false;
    },
    updatePlayerPieceValue: (state, action) => {
      // Destructure the action payload to extract the necessary data
      const {playerNo, pieceId, pos, travelCount} = action.payload;

      // Access the pieces of the specific player using playerNo
      const playerPieces = state[playerNo];

      // Find the specific piece that matches the given pieceId
      const piece = playerPieces.find(p => p.id === pieceId);

      // Reset pile selection player to -1, indicating no pile is being selected
      state.pileSelectionPlayer = -1;

      // Check if the piece was found (i.e., it exists for that player)
      if (piece) {
        // Update the position and travelCount of the piece
        piece.pos = pos;
        piece.travelCount = travelCount;

        // Find the index of the piece in the currentPositions array
        const currentPositionIdx = state.currentPositions.findIndex(
          p => p.id === pieceId,
        );

        // If the new position is 0 (i.e., the piece is off the board or reset)
        if (pos === 0) {
          // If the piece exists in currentPositions, remove it
          if (currentPositionIdx !== -1) {
            state.currentPositions.splice(currentPositionIdx, 1);
          }
        } else {
          // If the new position is not 0
          if (currentPositionIdx !== -1) {
            // If the piece exists in currentPositions, update its position
            state.currentPositions[currentPositionIdx] = {id: pieceId, pos};
          } else {
            // If the piece is not in currentPositions, add it with the new position
            state.currentPositions.push({id: pieceId, pos});
          }
        }
      }
    },
  },
});

export const {
  resetGame,
  updateDiceNumber,
  enablePileSelection,
  enableCellSelection,
  disableTouch,
  unfreezeDice,
  updateFireworks,
  announceWinner,
  updatePlayerChance,
  updatePlayerPieceValue,
} = gameSlice.actions;

export default gameSlice.reducer;
