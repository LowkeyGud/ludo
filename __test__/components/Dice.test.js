import {fireEvent, render} from '@testing-library/react-native';
import LottieView from 'lottie-react-native';
import React from 'react';
import {Provider, useSelector} from 'react-redux';
import configureStore from 'redux-mock-store';
import Dice from '../../src/components/Dice';

const mockDispatch = jest.fn();
// Mock external dependencies
jest.mock('lottie-react-native', () => 'LottieView');
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
  useSelector: jest.fn(),
}));
jest.mock('../../src/helpers/SoundUtility', () => ({
  playSound: jest.fn(),
}));
jest.mock('../../src/helpers/GetIcons', () => ({
  BackgroundImage: {
    GetImage: jest.fn(() => 'mocked-image-source'),
  },
}));

const mockStore = configureStore([]);

describe('Dice Component', () => {
  const initialState = {
    game: {
      player1: [],
      diceNo: 1,
      diceRolled: false,
      currentPlayerChance: 1,
    },
  };

  let store;
  let component;

  beforeEach(() => {
    store = mockStore(initialState);
    jest.clearAllMocks();

    useSelector.mockImplementation(selector => {
      if (selector.name === 'selectCurrentPlayerChance') return 1;
      if (selector.name === 'selectDiceRolled') return false;
      if (selector.name === 'selectDiceNo') return 1;
      return null;
    });

    component = render(
      <Provider store={store}>
        <Dice
          color="red"
          rotate={false}
          player={1}
          data={[{pos: 0, travelCount: 0}]}
        />
      </Provider>,
    );
  });

  it('renders correctly', () => {
    expect(component.getByTestId('dice-container')).toBeTruthy();
    expect(component.queryByText('dice-animation')).not.toBeTruthy(); // No rolling animation initially
  });

  it('shows arrow animation when active player and not rolled', () => {
    expect(component.getByTestId('dice-button')).toBeTruthy();
    expect(component.getAllByLabelText('arrow').length).toBe(1);
  });

  it('handles normal dice roll', async () => {
    const diceButton = component.getByTestId('dice-button');

    fireEvent.press(diceButton);

    expect(
      require('../../src/helpers/SoundUtility').playSound,
    ).toHaveBeenCalledWith('dice_roll');
    expect(mockDispatch).toHaveBeenCalled();
  });

  it('handles long-press cheat roll', () => {
    const diceButton = component.getByTestId('dice-button');

    fireEvent(diceButton, 'longPress');

    expect(store.getActions()).toContainEqual(
      expect.objectContaining({
        type: 'game/updateDiceNumber',
        payload: {diceNo: 6},
      }),
    );
  });

  it('disables button when dice is rolling', () => {
    useSelector.mockImplementation(selector => {
      if (selector.name === 'selectDiceRolled') return true;
      return false;
    });

    const {queryByTestId} = render(
      <Provider store={store}>
        <Dice color="red" rotate={false} player={1} data={[]} />
      </Provider>,
    );

    expect(queryByTestId('dice-button')).toBeNull();
  });

  it('shows rolling animation during dice roll', () => {
    const {UNSAFE_getByType} = render(
      <Provider store={store}>
        <Dice color="red" rotate={false} player={1} data={[]} />
      </Provider>,
    );

    // Simulate rolling state
    fireEvent.press(component.getByTestId('dice-button'));
    expect(UNSAFE_getByType(LottieView)).toBeTruthy();
  });

  it('handles turn switching when no valid moves', async () => {
    // Mock Math.random to return 3
    const mockMath = Object.create(global.Math);
    mockMath.random = () => 0.5;
    global.Math = mockMath;

    const {getByTestId} = render(
      <Provider store={store}>
        <Dice
          color="red"
          rotate={false}
          player={1}
          data={[{pos: 0, travelCount: 0}]}
        />
      </Provider>,
    );

    fireEvent.press(getByTestId('dice-button'));

    await new Promise(resolve => setTimeout(resolve, 100));
    expect(store.getActions()).toContainEqual(
      expect.objectContaining({
        type: 'game/updatePlayerChance',
        payload: {chancePlayer: 2},
      }),
    );
  });

  it('enables pile selection when rolling 6 with no active pieces', async () => {
    // Mock dice roll to 6
    const mockMath = Object.create(global.Math);
    mockMath.random = () => 0.99;
    global.Math = mockMath;

    const {getByTestId} = render(
      <Provider store={store}>
        <Dice
          color="red"
          rotate={false}
          player={1}
          data={[{pos: 0, travelCount: 0}]}
        />
      </Provider>,
    );

    fireEvent.press(getByTestId('dice-button'));

    await new Promise(resolve => setTimeout(resolve, 100));
    expect(store.getActions()).toContainEqual(
      expect.objectContaining({
        type: 'game/enablePileSelection',
        payload: {playerNo: 1},
      }),
    );
  });
});
