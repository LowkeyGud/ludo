import reducer, {
  announceWinner,
  disableTouch,
  enableCellSelection,
  enablePileSelection,
  gameSlice,
  resetGame,
  unfreezeDice,
  updateDiceNumber,
  updateFireworks,
  updatePlayerChance,
  updatePlayerPieceValue,
} from '../../../src/redux/reducers/gameSlice'; // Adjust path
import {initialState} from '../../../src/redux/reducers/initialState';

describe('gameSlice', () => {
  test('has correct name', () => {
    expect(gameSlice.name).toBe('game');
  });

  test('initializes with correct initialState', () => {
    expect(gameSlice.getInitialState()).toEqual(initialState);
  });

  test('checks all actions in gameSlice', () => {
    const actions = Object.keys(gameSlice.actions);
    expect(actions).toEqual(
      expect.arrayContaining([
        'resetGame',
        'updateDiceNumber',
        'enablePileSelection',
        'enableCellSelection',
        'disableTouch',
        'unfreezeDice',
        'updateFireworks',
        'announceWinner',
        'updatePlayerChance',
        'updatePlayerPieceValue',
      ]),
    );
  });

  describe('resetGame', () => {
    test('resets state to initialState', () => {
      // Define a modified state
      const modifiedState = {
        score: 100,
        players: ['Player1', 'Player2'],
        isGameOver: true,
      };

      // Apply the resetGame action using the reducer
      const newState = gameSlice.reducer(modifiedState, resetGame());
      expect(newState).toEqual(initialState);
    });

    test('returns initialState when state is undefined', () => {
      // Test with undefined state (initial reducer call)
      const newState = gameSlice.reducer(undefined, resetGame());
      expect(newState).toEqual(initialState);
    });
  });

  // Test: updateDiceNumber action
  it('should handle updateDiceNumber action', () => {
    const newState = reducer(initialState, updateDiceNumber({diceNo: 5}));
    expect(newState.diceNo).toBe(5);
    expect(newState.isDiceRolled).toBe(false);
  });

  // Test: enablePileSelection action
  it('should handle enablePileSelection action', () => {
    const state = reducer(initialState, enablePileSelection({playerNo: 1}));
    expect(state.diceTouchBlock).toBe(true);
    expect(state.pileSelectionPlayer).toBe(1);
  });

  // Test: enableCellSelection action
  it('should handle enableCellSelection action', () => {
    const state = reducer(initialState, enableCellSelection({playerNo: 2}));
    expect(state.diceTouchBlock).toBe(true);
    expect(state.cellSelectionPlayer).toBe(2);
  });

  // Test: disableTouch action
  it('should handle disableTouch action', () => {
    const state = reducer(initialState, disableTouch());
    expect(state.diceTouchBlock).toBe(true);
    expect(state.pileSelectionPlayer).toBe(-1);
    expect(state.cellSelectionPlayer).toBe(-1);
  });

  // Test: unfreezeDice action
  it('should handle unfreezeDice action', () => {
    const state = reducer(initialState, unfreezeDice());
    expect(state.diceTouchBlock).toBe(false);
    expect(state.isDiceRolled).toBe(false);
  });

  // Test: updateFireworks action
  it('should handle updateFireworks action', () => {
    const fireworks = {fireworkType: 'sparkler'};
    const state = reducer(initialState, updateFireworks(fireworks));
    expect(state.fireworks).toEqual(fireworks);
  });

  // Test: announceWinner action
  it('should handle announceWinner action', () => {
    const winner = {player: 1, score: 100};
    const state = reducer(initialState, announceWinner(winner));
    expect(state.winner).toEqual(winner);
  });

  // Test: updatePlayerChance action
  it('should handle updatePlayerChance action', () => {
    const chancePlayer = {chancePlayer: 3};
    const state = reducer(initialState, updatePlayerChance(chancePlayer));
    expect(state.chancePlayer).toEqual(chancePlayer.chancePlayer);
    expect(state.diceTouchBlock).toBe(false);
    expect(state.isDiceRolled).toBe(false);
  });

  // Test: updatePlayerPieceValue action
  describe('updatePlayerPieceValue reducer', () => {
    it('should update position and travel count of an existing piece and update currentPositions', () => {
      const initialPieces = [
        {id: 1, pos: 0, travelCount: 0},
        {id: 2, pos: 5, travelCount: 2},
      ];

      const newPieceData = {
        playerNo: 1,
        pieceId: 1,
        pos: 10,
        travelCount: 3,
      };

      const stateWithPieces = {
        ...initialState,
        1: initialPieces,
        currentPositions: [{id: 2, pos: 5}],
      };

      const state = reducer(
        stateWithPieces,
        updatePlayerPieceValue(newPieceData),
      );

      const updatedPiece = state[1].find(piece => piece.id === 1);

      // Check if the piece's position and travel count are updated correctly
      expect(updatedPiece.pos).toBe(10);
      expect(updatedPiece.travelCount).toBe(3);

      // Check if currentPositions is updated correctly
      expect(state.currentPositions).toEqual([
        {id: 2, pos: 5},
        {id: 1, pos: 10},
      ]);
    });

    it('should remove the piece from currentPositions if position is set to 0', () => {
      const initialPieces = [{id: 1, pos: 5, travelCount: 2}];

      const newPieceData = {
        playerNo: 1,
        pieceId: 1,
        pos: 0, // The key part here: we set the position to 0
        travelCount: 3,
      };

      // Set the state where the piece is already in currentPositions
      const stateWithPieces = {
        ...initialState,
        1: initialPieces,
        currentPositions: [{id: 1, pos: 5}], // This ensures the piece exists in currentPositions
      };

      // Dispatch the action
      const state = reducer(
        stateWithPieces,
        updatePlayerPieceValue(newPieceData),
      );

      // Check if the piece is removed from currentPositions
      expect(state.currentPositions).toEqual([]); // After setting pos to 0, it should be removed
    });
    it('should add the piece to currentPositions if the piece does not exist in currentPositions', () => {
      const initialPieces = [{id: 1, pos: 0, travelCount: 0}];

      const newPieceData = {
        playerNo: 1,
        pieceId: 2, // New piece, not in initial state
        pos: 5,
        travelCount: 1,
      };

      const stateWithPieces = {
        ...initialState,
        1: initialPieces,
        currentPositions: [{id: 1, pos: 0}],
      };

      const state = reducer(
        stateWithPieces,
        updatePlayerPieceValue(newPieceData),
      );

      // Check if the new piece is added to currentPositions
      expect(state.currentPositions).toEqual([
        {id: 1, pos: 0},
        {id: 2, pos: 5},
      ]);

      // Check if the new piece is added to player 1's pieces
      expect(state[1]).toEqual([
        {id: 1, pos: 0, travelCount: 0},
        {id: 2, pos: 5, travelCount: 1},
      ]);
    });

    it('should update the position in currentPositions if the piece already exists', () => {
      const initialPieces = [{id: 1, pos: 5, travelCount: 2}];

      const newPieceData = {
        playerNo: 1,
        pieceId: 1,
        pos: 7, // Updating the piece's position
        travelCount: 3,
      };

      const stateWithPieces = {
        ...initialState,
        1: initialPieces,
        currentPositions: [{id: 1, pos: 5}],
      };

      const state = reducer(
        stateWithPieces,
        updatePlayerPieceValue(newPieceData),
      );

      // Check if the piece's position is updated
      expect(state[1][0].pos).toBe(7);

      // Check if currentPositions is updated correctly
      expect(state.currentPositions).toEqual([{id: 1, pos: 7}]);
    });
  });
  test('exports reducer', () => {
    expect(gameSlice.reducer).toBeDefined();
    expect(typeof gameSlice.reducer).toBe('function');
  });
});
