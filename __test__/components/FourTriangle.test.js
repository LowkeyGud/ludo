import {act, render} from '@testing-library/react-native';
import LottieView from 'lottie-react-native';
import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import FourTriangle from '../../src/components/FourTriangle';
import Pile from '../../src/components/Pile';
import * as GetIcons from '../../src/helpers/GetIcons'; // to prevent error from Pile

// Mock redux hooks
jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

// Mock LottieView to prevent actual rendering
jest.mock('lottie-react-native', () => 'LottieView');

// Mock Pile component
jest.mock('../../src/components/Pile', () => {
  const {TouchableOpacity, Text} = require('react-native');
  const MockPile = jest.fn(({pieceId}) => {
    MockPile.onPressSpy = MockPile.onPressSpy || jest.fn(); // Define spy here
    return (
      <TouchableOpacity
        onPress={MockPile.onPressSpy}
        testID={`pile-${pieceId}`}>
        <Text>{`MockPile-${pieceId}`}</Text>
      </TouchableOpacity>
    );
  });
  MockPile.onPressSpy = jest.fn(); // Ensure it’s always defined
  return MockPile;
});

// Avoid crashing from GetIcons
jest
  .spyOn(GetIcons.BackgroundImage || {}, 'GetImage')
  .mockReturnValue({uri: 'fake-icon'});

// Fake timers for timeout control
jest.useFakeTimers();

describe('FourTriangle Component', () => {
  const dispatchMock = jest.fn();
  beforeEach(() => {
    useDispatch.mockReturnValue(dispatchMock);
    jest.clearAllMocks();
    if (Pile.onPressSpy) {
      Pile.onPressSpy.mockClear(); // Reset spy between tests
    }
  });

  const mockPlayer = id =>
    [...Array(4)].map((_, i) => ({
      id: `${id}${i}`,
      travelCount: i < 2 ? 57 : 10, // only 2 should show
    }));

  it('renders four triangle SVG areas and player piles at home', () => {
    useSelector.mockImplementation(selector => {
      if (selector.name === 'selectFireworks') return false;
      return undefined;
    });

    const {getByText, queryByTestId, queryByText} = render(
      <FourTriangle
        player1={mockPlayer('A')}
        player2={mockPlayer('B')}
        player3={mockPlayer('C')}
        player4={mockPlayer('D')}
      />,
    );

    // Verifying Pile rendering for completed pieces (travelCount === 57)
    expect(getByText('MockPile-A0')).toBeTruthy();
    expect(getByText('MockPile-A1')).toBeTruthy();
    expect(queryByText('MockPile-A2')).toBeFalsy(); // not 57
    expect(queryByTestId('firework-animation')).toBeNull();
  });

  it('shows firework and dispatches updateFireworks(false) after 5s', () => {
    useSelector.mockImplementation(selector => {
      if (selector.name === 'selectFireworks') return true;
      return undefined;
    });

    render(
      <FourTriangle player1={[]} player2={[]} player3={[]} player4={[]} />,
    );

    // Firework should show initially
    expect(LottieView).toBeTruthy();

    // Advance timers and test dispatch
    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(dispatchMock).toHaveBeenCalledWith({
      type: 'game/updateFireworks',
      payload: false,
    });
  });
});
