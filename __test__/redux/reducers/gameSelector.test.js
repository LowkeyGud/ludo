import {
  selectCellSelectionPlayer,
  selectCurrentPlayerChance,
  selectCurrentPositions,
  selectDiceNo,
  selectDiceRolled,
  selectDiceTouchBlock,
  selectFireworks,
  selectPlayer1,
  selectPlayer2,
  selectPlayer3,
  selectPlayer4,
  selectPocketPileSelectionPlayer,
} from '../../../src/redux/reducers/gameSelector';

describe('Game Selectors', () => {
  // Sample state for testing
  const mockState = {
    game: {
      currentPositions: [1, 2, 3, 4],
      chancePlayer: 2,
      isDiceRolled: true,
      diceNo: 6,
      player1: {id: 1, score: 10},
      player2: {id: 2, score: 20},
      player3: {id: 3, score: 30},
      player4: {id: 4, score: 40},
      pileSelectionPlayer: 1,
      cellSelectionPlayer: 3,
      diceTouchBlock: false,
      fireworks: true,
    },
  };

  describe('selectCurrentPositions', () => {
    test('returns currentPositions from state', () => {
      expect(selectCurrentPositions(mockState)).toEqual([1, 2, 3, 4]);
    });
  });

  describe('selectCurrentPlayerChance', () => {
    test('returns chancePlayer from state', () => {
      expect(selectCurrentPlayerChance(mockState)).toBe(2);
    });
  });

  describe('selectDiceRolled', () => {
    test('returns isDiceRolled from state', () => {
      expect(selectDiceRolled(mockState)).toBe(true);
    });
  });

  describe('selectDiceNo', () => {
    test('returns diceNo from state', () => {
      expect(selectDiceNo(mockState)).toBe(6);
    });
  });

  describe('selectPlayer1', () => {
    test('returns player1 from state', () => {
      expect(selectPlayer1(mockState)).toEqual({id: 1, score: 10});
    });
  });

  describe('selectPlayer2', () => {
    test('returns player2 from state', () => {
      expect(selectPlayer2(mockState)).toEqual({id: 2, score: 20});
    });
  });

  describe('selectPlayer3', () => {
    test('returns player3 from state', () => {
      expect(selectPlayer3(mockState)).toEqual({id: 3, score: 30});
    });
  });

  describe('selectPlayer4', () => {
    test('returns player4 from state', () => {
      expect(selectPlayer4(mockState)).toEqual({id: 4, score: 40});
    });
  });

  describe('selectPocketPileSelectionPlayer', () => {
    test('returns pileSelectionPlayer from state', () => {
      expect(selectPocketPileSelectionPlayer(mockState)).toBe(1);
    });
  });

  describe('selectCellSelectionPlayer', () => {
    test('returns cellSelectionPlayer from state', () => {
      expect(selectCellSelectionPlayer(mockState)).toBe(3);
    });
  });

  describe('selectDiceTouchBlock', () => {
    test('returns diceTouchBlock from state', () => {
      expect(selectDiceTouchBlock(mockState)).toBe(false);
    });
  });

  describe('selectFireworks', () => {
    test('returns fireworks from state', () => {
      expect(selectFireworks(mockState)).toBe(true);
    });
  });

  // Edge case: Missing game state
  describe('with missing game state', () => {
    const emptyState = {};

    test('selectors return undefined when game is missing', () => {
      expect(selectCurrentPositions(emptyState)).toBeUndefined();
      expect(selectCurrentPlayerChance(emptyState)).toBeUndefined();
      expect(selectDiceRolled(emptyState)).toBeUndefined();
      expect(selectDiceNo(emptyState)).toBeUndefined();
      expect(selectPlayer1(emptyState)).toBeUndefined();
      expect(selectPlayer2(emptyState)).toBeUndefined();
      expect(selectPlayer3(emptyState)).toBeUndefined();
      expect(selectPlayer4(emptyState)).toBeUndefined();
      expect(selectPocketPileSelectionPlayer(emptyState)).toBeUndefined();
      expect(selectCellSelectionPlayer(emptyState)).toBeUndefined();
      expect(selectDiceTouchBlock(emptyState)).toBeUndefined();
      expect(selectFireworks(emptyState)).toBeUndefined();
    });
  });
});
