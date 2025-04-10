import {fireEvent, render, screen} from '@testing-library/react-native';
import React from 'react';
import {useDispatch} from 'react-redux';
import configureStore from 'redux-mock-store';
import Pocket from '../../src/components/Pocket';
import {startingPoints} from '../../src/helpers/PlotData';
import {
  unfreezeDice,
  updatePlayerPieceValue,
} from '../../src/redux/reducers/gameSlice';

// Mock dependencies
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
}));

jest.mock('../../src/components/Pile', () => {
  const {TouchableOpacity} = require('react-native');
  return ({onPress, ...props}) => (
    <TouchableOpacity
      onPress={onPress}
      testID="mock-pile"
      {...props}></TouchableOpacity>
  );
}); // Mock child component

const mockStore = configureStore([]);
const mockDispatch = jest.fn();

describe('Pocket Component', () => {
  const sampleData = [
    {id: 'A1', pos: 0, travelCount: 0},
    {id: 'A2', pos: 5, travelCount: 5},
    {id: 'A3', pos: 0, travelCount: 0},
    {id: 'A4', pos: 10, travelCount: 10},
  ];

  beforeEach(() => {
    useDispatch.mockReturnValue(mockDispatch);
    jest.clearAllMocks();
  });

  it('renders correctly with four Plot components', () => {
    render(<Pocket color="red" player={1} data={sampleData} />);

    const plots = screen.getAllByLabelText('Plot');
    expect(plots.length).toBe(4);
  });

  it('renders Piles only for pieces with pos 0', () => {
    render(<Pocket color="blue" player={1} data={sampleData} />);

    const piles = screen.getAllByTestId('mock-pile');
    expect(piles.length).toBe(2); // Two pieces with pos 0
  });

  it('handles pile press correctly', () => {
    const {getAllByTestId} = render(
      <Pocket color="green" player={1} data={sampleData} />,
    );

    const firstPile = getAllByTestId('mock-pile')[0];
    fireEvent.press(firstPile);

    expect(mockDispatch).toHaveBeenCalledWith(
      updatePlayerPieceValue({
        playerNo: 'player1',
        pieceId: 'A1',
        pos: startingPoints[0],
        travelCount: 1,
      }),
    );

    expect(mockDispatch).toHaveBeenCalledWith(unfreezeDice());
  });

  it('converts piece IDs to correct player numbers', () => {
    const testData = [
      {id: 'B3', pos: 0},
      {id: 'C2', pos: 0},
      {id: 'D4', pos: 0},
    ];

    render(<Pocket color="yellow" player={4} data={testData} />);

    const piles = screen.getAllByTestId('mock-pile');

    fireEvent.press(piles[0]);
    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'game/updatePlayerPieceValue',
        payload: expect.objectContaining({
          playerNo: 'player2',
        }),
      }),
    );

    fireEvent.press(piles[1]);
    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'game/updatePlayerPieceValue',
        payload: expect.objectContaining({
          playerNo: 'player3',
        }),
      }),
    );

    fireEvent.press(piles[2]);
    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'game/updatePlayerPieceValue',
        payload: expect.objectContaining({
          playerNo: 'player4',
        }),
      }),
    );
  });

  it('applies correct styling from props', () => {
    render(<Pocket color="#ff0000" player={1} data={[]} />);
    const container = screen.getByLabelText('Pocket');
    expect(container.props.style[1].backgroundColor).toBe('#ff0000');
  });
});

describe('Plot Component', () => {
  it('renders Pile when pos is 0', () => {
    render(<Pocket color="red" player={1} data={[{id: 'A1', pos: 0}]} />);

    expect(screen.getByTestId('mock-pile')).toBeTruthy();
  });

  it('does not render Pile when pos is not 0', () => {
    const {queryByTestId} = render(
      <Pocket color="red" player={1} data={[{id: 'A1', pos: 5}]} />,
    );

    expect(queryByTestId('mock-pile')).toBeNull();
  });
});
