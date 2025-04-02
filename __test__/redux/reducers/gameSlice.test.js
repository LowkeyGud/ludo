import {gameSlice, resetGame} from '../../../src/redux/reducers/gameSlice'; // Adjust path
import {initialState} from '../../../src/redux/reducers/initialState';

// Mock the initialState module
jest.mock('../../../src/redux/reducers/initialState', () => {
  return {
    initialState: {
      blah: 'mockedBlah',
      hulala: 'mockedHulala',
    },
  };
});
describe('gameSlice', () => {
  test('has correct name', () => {
    expect(gameSlice.name).toBe('game');
  });

  test('initializes with correct initialState', () => {
    expect(gameSlice.getInitialState()).toEqual(initialState);
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

  test('exports resetGame action creator', () => {
    expect(resetGame).toBeDefined();
    expect(typeof resetGame).toBe('function');
    const action = resetGame();
    expect(action).toEqual({type: 'game/resetGame'});
  });

  test('exports reducer', () => {
    expect(gameSlice.reducer).toBeDefined();
    expect(typeof gameSlice.reducer).toBe('function');
  });
});
