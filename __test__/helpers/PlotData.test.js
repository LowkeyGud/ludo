// gameData.test.js
import {
  ArrowSpot,
  colorPlayer,
  Plot1Data,
  Plot2Data,
  Plot3Data,
  Plot4Data,
  SafeSpots,
  StarSpots,
  startingPoints,
  turningPoints,
  victoryStart,
} from '../../src/helpers/PlotData'; // Adjust path to your file

// Mock the Colors module since we don’t have the actual implementation
jest.mock('../../src/constants/Colors', () => ({
  Colors: {
    red: '#d5151d',
    green: '#00a049',
    yellow: '#ffde17',
    blue: '#28aeff',
  },
}));

describe('Game Data Constants', () => {
  // Test Plot Data Arrays
  describe('Plot Data', () => {
    test('Plot1Data has correct length and values', () => {
      expect(Plot1Data).toEqual([
        13, 14, 15, 16, 17, 18, 12, 221, 222, 223, 224, 225, 11, 10, 9, 8, 7, 6,
      ]);
    });

    test('Plot2Data has correct length and values', () => {
      expect(Plot2Data).toEqual([
        24, 25, 26, 23, 331, 27, 22, 332, 28, 21, 333, 29, 20, 334, 30, 19, 335,
        31,
      ]);
    });

    test('Plot3Data has correct length and values', () => {
      expect(Plot3Data).toEqual([
        32, 33, 34, 35, 36, 37, 445, 444, 443, 442, 441, 38, 44, 43, 42, 41, 40,
        39,
      ]);
    });

    test('Plot4Data has correct length and values', () => {
      expect(Plot4Data).toEqual([
        5, 115, 45, 4, 114, 46, 3, 113, 47, 2, 112, 48, 1, 111, 49, 52, 51, 50,
      ]);
    });
  });

  // Test SafeSpots
  describe('SafeSpots', () => {
    test('SafeSpots has correct length and values', () => {
      expect(SafeSpots).toEqual([
        221, 222, 223, 224, 225, 14, 27, 331, 332, 333, 334, 335, 40, 441, 442,
        443, 444, 445, 1, 111, 112, 113, 114, 115,
      ]);
    });

    test('SafeSpots contains expected values from Plot arrays', () => {
      expect(SafeSpots).toContain(14); // From Plot1Data
      expect(SafeSpots).toContain(27); // From Plot2Data
      expect(SafeSpots).toContain(40); // From Plot3Data
      expect(SafeSpots).toContain(1); // From Plot4Data
    });
  });

  // Test StarSpots
  describe('StarSpots', () => {
    test('StarSpots has correct length and values', () => {
      expect(StarSpots).toHaveLength(4);
      expect(StarSpots).toEqual([9, 22, 35, 48]);
    });
  });

  // Test ArrowSpot
  describe('ArrowSpot', () => {
    test('ArrowSpot has correct length and values', () => {
      expect(ArrowSpot).toHaveLength(4);
      expect(ArrowSpot).toEqual([12, 51, 38, 25]);
    });
  });

  // Test turningPoints
  describe('turningPoints', () => {
    test('turningPoints has correct length and values', () => {
      expect(turningPoints).toHaveLength(4);
      expect(turningPoints).toEqual([52, 13, 26, 39]);
    });
  });

  // Test victoryStart
  describe('victoryStart', () => {
    test('victoryStart has correct length and values', () => {
      const expected = [111, 221, 441, 331];
      expect(victoryStart).toEqual(expect.arrayContaining(expected)); // a subset of b
      expect(expected).toEqual(expect.arrayContaining(victoryStart)); // b subset of a so they have same values
      expect(victoryStart).toHaveLength(expected.length); // same length
    });
  });

  // Test startingPoints
  describe('startingPoints', () => {
    test('startingPoints has correct length and values', () => {
      expect(startingPoints).toHaveLength(4);
      expect(startingPoints).toEqual([1, 14, 27, 40]);
    });
  });

  // Test colorPlayer
  describe('colorPlayer', () => {
    test('colorPlayer has correct length and values', () => {
      expect(colorPlayer).toHaveLength(4);
      expect(colorPlayer).toEqual(
        expect.arrayContaining(['#d5151d', '#00a049', '#ffde17', '#28aeff']), // Global colors
      );
    });

    test('colorPlayer contains valid hex colors', () => {
      expect(colorPlayer[0]).toMatch(/^#[0-9A-F]{6}$/i); // Red
      expect(colorPlayer[1]).toMatch(/^#[0-9A-F]{6}$/i); // Green
      expect(colorPlayer[2]).toMatch(/^#[0-9A-F]{6}$/i); // Yellow
      expect(colorPlayer[3]).toMatch(/^#[0-9A-F]{6}$/i); // Blue
    });
  });
});
