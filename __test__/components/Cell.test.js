// Cell.test.js
import {fireEvent, render, screen} from '@testing-library/react-native';
import React from 'react';

import * as redux from 'react-redux';
import Cell from '../../src/components/Cell';
import {handleForwardThunk} from '../../src/redux/reducers/gameActions';

// --- Mock External Dependencies ---

// Mock Ionicons so it doesn’t try to load actual icons.
// We simply return a dummy component that renders the icon name.
jest.mock('react-native-vector-icons/Ionicons', () => {
  const {Text} = require('react-native');
  return ({name, size, color, style}) => {
    return (
      // Render the name and other props in a Text element (or string) for testing.
      <Text>{`Ionicon: ${name}`}</Text>
    );
  };
});

// Mock Pile to return a simple component that we can interact with in tests.
// We add a testID using the pieceId so that we can query for it.
jest.mock('../../src/components/Pile', () => {
  return ({onPress, pieceId}) => {
    return (
      <div
        // In react-native testing-library, you can use testID on any element.
        testID={`pile-${pieceId}`}
        // Using onClick here to simulate a press event in our dummy component.
        onClick={onPress}>
        Pile: {pieceId}
      </div>
    );
  };
});

// Mock handleForwardThunk so that it returns a plain object.
// This allows us to compare objects rather than anonymous functions.
jest.mock('../../src/redux/reducers/gameActions', () => ({
  handleForwardThunk: jest.fn((playerNo, pieceId, cellId) => ({
    type: 'HANDLE_FORWARD',
    playerNo,
    pieceId,
    cellId,
  })),
}));

// --- Spy on Redux hooks ---
// We want to control the values returned by useSelector and capture dispatch calls.
const useDispatchMock = jest.spyOn(redux, 'useDispatch');
const useSelectorMock = jest.spyOn(redux, 'useSelector');

describe('Cell Component', () => {
  const dispatchMock = jest.fn();

  beforeEach(() => {
    // Whenever useDispatch is called in Cell, return our mock dispatch.
    useDispatchMock.mockReturnValue(dispatchMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders container with safe spot background when the id is in SafeSpots', () => {
    // For this test, we want to check that the container background color
    // is the provided color when the cell id is a safe spot.
    // We assume that SafeSpots is imported from ../helpers/PlotData.
    // For testing purposes, we can temporarily add an id to SafeSpots.
    const safeId = 100;
    // Save the original array so we can restore it after the test.
    const originalSafeSpots = [
      ...require('../../src/helpers/PlotData').SafeSpots,
    ];
    require('../../src/helpers/PlotData').SafeSpots.push(safeId);

    // For this test, we don’t need any pieces, so return an empty array.
    useSelectorMock.mockReturnValue([]);
    // Render the Cell with id equal to safeId.
    const {toJSON} = render(<Cell id={safeId} color="red" />);
    const tree = toJSON();

    // The container should have a background color of "red" because it is a safe spot.
    // (The component uses: backgroundColor: isSafeSpot ? color : Colors.white)
    // You can inspect the tree and assert on the style.
    expect(tree).toMatchSnapshot();

    // Restore SafeSpots array.
    require('../../src/helpers/PlotData').SafeSpots = originalSafeSpots;
  });

  it('renders a star icon when id is in StarSpots', () => {
    // Similar to the safe spot test, we add an id to StarSpots.
    const starId = 200;
    const originalStarSpots = [
      ...require('../../src/helpers/PlotData').StarSpots,
    ];
    require('../../src/helpers/PlotData').StarSpots.push(starId);

    useSelectorMock.mockReturnValue([]);
    render(<Cell id={starId} color="blue" />);

    // Our Ionicons mock renders text starting with "Ionicon:".
    // The Cell component conditionally renders a star icon when isStarSpot is true.
    expect(screen.queryByText('Ionicon: star-outline')).toBeTruthy();

    // Restore StarSpots.
    require('../../src/helpers/PlotData').StarSpots = originalStarSpots;
  });

  it('renders piles for pieces at the given cell and dispatches handleForwardThunk on press', () => {
    // Test scenario: a piece is positioned at this cell.
    const cellId = 5;
    // Dummy piece data that our selector returns. The Cell component filters
    // plotedPieces for items where item.pos == id.
    // For piece id, we use a string that starts with "A" so that playerNo is 1.
    const dummyPieces = [
      {id: 'A1', pos: cellId},
      {id: 'B2', pos: cellId},
      {id: 'C3', pos: cellId},
      {id: 'D4', pos: cellId},
    ];

    useSelectorMock.mockReturnValue(dummyPieces);
    const {getByTestId} = render(<Cell id={cellId} color="green" />);

    // Our mocked Pile should render an element with testID `pile-A1`.
    const pileElement = getByTestId('pile-A1');
    expect(pileElement).toBeTruthy();

    // Simulate a press on the Pile element.
    fireEvent.press(pileElement);

    // Verify that handleForwardThunk was called with the correct arguments.
    expect(handleForwardThunk).toHaveBeenCalledWith(1, 'A1', cellId);

    // Because we mocked handleForwardThunk to return a plain object, we can now compare that object.
    const expectedAction = {
      type: 'HANDLE_FORWARD',
      playerNo: 1,
      pieceId: 'A1',
      cellId,
    };
    expect(dispatchMock).toHaveBeenCalledWith(expectedAction);
  });
});
