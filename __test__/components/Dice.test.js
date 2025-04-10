import {act, render, userEvent} from '@testing-library/react-native';
import React from 'react';
import * as redux from 'react-redux';
import Dice from '../../src/components/Dice';

const user = userEvent.setup();

// Mock the dependent modules
jest.mock('../../src/helpers/SoundUtility', () => ({
  playSound: jest.fn(),
}));

jest.mock('../../src/helpers/Utils', () => ({
  delay: jest.fn(() => Promise.resolve()),
}));

jest.mock('../../src/redux/reducers/gameSelector', () => ({
  selectCurrentPlayerChance: state => state.game.currentPlayerChance,
  selectDiceNo: state => state.game.diceNo,
  selectDiceRolled: state => state.game.isDiceRolled,
}));

jest.mock('../../src/redux/reducers/gameSlice', () => ({
  updateDiceNumber: payload => ({type: 'UPDATE_DICE_NUMBER', payload}),
  enablePileSelection: payload => ({type: 'ENABLE_PILE_SELECTION', payload}),
  enableCellSelection: payload => ({type: 'ENABLE_CELL_SELECTION', payload}),
  updatePlayerChance: payload => ({type: 'UPDATE_PLAYER_CHANCE', payload}),
}));

describe('Dice Component', () => {
  let dispatchMock;
  let useDispatchSpy;
  let useSelectorSpy;
  const dummyData = [{pos: 0}, {pos: 0}, {pos: 0}, {pos: 0}];

  beforeEach(() => {
    // Create a jest mock for dispatch and spy on useDispatch
    dispatchMock = jest.fn();
    useDispatchSpy = jest
      .spyOn(redux, 'useDispatch')
      .mockReturnValue(dispatchMock);

    // Stub useSelector to return some basic state
    useSelectorSpy = jest
      .spyOn(redux, 'useSelector')
      .mockImplementation(selector => {
        const state = {
          game: {
            currentPlayerChance: 1, // current player
            diceNo: 1,
            isDiceRolled: false,
            // For example, player1 pieces
            player1: [
              {pos: 0, travelCount: 0},
              {pos: 0, travelCount: 0},
              {pos: 0, travelCount: 0},
              {pos: 0, travelCount: 0},
            ],
          },
        };
        return selector(state);
      });

    // Use fake timers to control the delays
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  it('should handle dice press correctly when long pressed (cheating move with dice number 6)', async () => {
    // Render the component with required props (color, rotate, player, data)
    const {getByTestId, queryByLabelText} = render(
      <Dice color="red" rotate={false} player={1} data={dummyData} />,
    );

    // Get the dice button (the testID is provided in the TouchableOpacity)
    const diceButton = getByTestId('dice-button');

    // Simulate a long press to call handleDicePress(6)
    //

    await act(async () => {
      user.longPress(diceButton);
    });

    // The playSound function should have been called with 'dice_roll'
    const {playSound} = require('../../src/helpers/SoundUtility');
    expect(playSound).toHaveBeenCalledWith('dice_roll');

    // At this point, the function awaits a 1300ms delay.
    // Use act() together with advancing timers to flush this delay.
    await act(async () => {
      jest.advanceTimersByTime(1300);
    });

    // After the 1300ms delay, updateDiceNumber should be dispatched with dice number 6.
    const {
      updateDiceNumber,
      enablePileSelection,
    } = require('../../src/redux/reducers/gameSlice');
    expect(dispatchMock).toHaveBeenCalledWith(updateDiceNumber({diceNo: 6}));

    // Given that all pieces in dummyData have pos=0, the component should choose the branch:
    // if (isAnyPieceAlive == -1) { if (diceNumber === 6) dispatch(enablePileSelection(...)) }
    expect(dispatchMock).toHaveBeenCalledWith(
      enablePileSelection({playerNo: 1}),
    );

    // Also, after the asynchronous delays, the dice rolling animation should not be rendered.
    // We check by ensuring the LottieView (with accessibilityLabel "dice-animation") is not in the tree.
    expect(queryByLabelText('dice-animation')).toBeNull();
  });

  // When dice is not 6 and no pieces are out (i.e. all pieces are at start), updatePlayerChance should be dispatched.
  it('should update player chance when dice is not 6 and all pieces are at start', async () => {
    // Fix Math.random so that dice number becomes 3 (0.5 * 6 = 3)
    const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.5);

    // All pieces are at start: no piece alive.
    const dummyData = [{pos: 0}, {pos: 0}, {pos: 0}, {pos: 0}];
    // Use the default player pieces (all at start) from useSelector

    const {getByTestId} = render(
      <Dice color="blue" rotate={false} player={1} data={dummyData} />,
    );

    // Simulate a normal press that passes a predice value of 3.
    const diceButton = getByTestId('dice-button');

    await act(async () => {
      user.press(diceButton);
    });

    const {playSound} = require('../../src/helpers/SoundUtility');
    expect(playSound).toHaveBeenCalledWith('dice_roll');

    // Advance the first delay (1300ms) and flush the promise chain.
    await act(async () => {
      jest.advanceTimersByTime(1300);
    });

    const {
      updateDiceNumber,
      updatePlayerChance,
    } = require('../../src/redux/reducers/gameSlice');
    // Should dispatch dice number update with 3.
    expect(dispatchMock).toHaveBeenCalledWith(updateDiceNumber({diceNo: 3}));

    // In the branch where no piece is alive (isAnyPieceAlive returns -1),
    // and dice is not 6, the component awaits an extra delay of 600ms before dispatching updatePlayerChance.
    await act(async () => {
      jest.advanceTimersByTime(600);
    });

    // Given player=1, chancePlayer becomes 2.
    expect(dispatchMock).toHaveBeenCalledWith(
      updatePlayerChance({chancePlayer: 2}),
    );

    // Restore Math.random
    randomSpy.mockRestore();
  });

  // When dice is not 6 and some pieces are out (alive), enableCellSelection should be dispatched.
  it('should enable cell selection when dice is not 6 and some pieces are out of start', async () => {
    // Fix Math.random so that dice number becomes 3 (0.5 * 6 = 3)
    const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.5);

    // dummyData with one piece out (alive) — pos not 0 and not 57.
    const dummyData = [
      {pos: 10}, // alive piece
      {pos: 0},
      {pos: 0},
      {pos: 0},
    ];

    // For this branch, we need playerPieces to have a piece that can move.
    // Ensure one piece is already out of start and has travelCount such that travelCount + dice <= 57.
    const customPlayerPieces = [
      {pos: 10, travelCount: 10}, // This piece can move (10+3=13 <= 57)
      {pos: 0, travelCount: 0},
      {pos: 0, travelCount: 0},
      {pos: 0, travelCount: 0},
    ];

    // Override useSelector for player pieces for this test
    useSelectorSpy.mockImplementation(selector => {
      const state = {
        game: {
          currentPlayerChance: 1,
          diceNo: 1,
          isDiceRolled: false,
          player1: customPlayerPieces,
        },
      };
      return selector(state);
    });

    const {getByTestId} = render(
      <Dice color="green" rotate={false} player={1} data={dummyData} />,
    );

    // Simulate a press with a predice of 3 (not 6)
    const diceButton = getByTestId('dice-button');
    await act(async () => {
      user.press(diceButton);
    });

    const {playSound} = require('../../src/helpers/SoundUtility');
    expect(playSound).toHaveBeenCalledWith('dice_roll');

    // Advance the 1300ms delay
    await act(async () => {
      jest.advanceTimersByTime(1300);
    });

    const {
      updateDiceNumber,
      enableCellSelection,
    } = require('../../src/redux/reducers/gameSlice');
    expect(dispatchMock).toHaveBeenCalledWith(updateDiceNumber({diceNo: 3}));

    // Since there is an alive piece and the piece can move,
    // the condition for updating player chance is skipped.
    // Instead, after checking conditions, enableCellSelection is dispatched.
    expect(dispatchMock).toHaveBeenCalledWith(
      enableCellSelection({playerNo: 1}),
    );

    // Restore Math.random
    randomSpy.mockRestore();
  });

  it('dispatches enablePileSelection and enableCellSelection when dice is 6 and two pieces are out', async () => {
    // dummyData simulates the positions from the backend/state used to check alive pieces.
    // Here, two pieces are out (positions 10 and 20) and two are at the start (0).
    const dummyData = [{pos: 10}, {pos: 20}, {pos: 0}, {pos: 0}];

    // Override playerPieces so that two pieces are already out.
    const customPlayerPieces = [
      {pos: 10, travelCount: 5}, // Out piece that can move (5 + 6 <= 57)
      {pos: 20, travelCount: 10}, // Out piece that can move (10 + 6 <= 57)
      {pos: 0, travelCount: 0},
      {pos: 0, travelCount: 0},
    ];

    // Override useSelector to return our custom player pieces.
    useSelectorSpy.mockImplementation(selector => {
      const state = {
        game: {
          currentPlayerChance: 1,
          diceNo: 1,
          isDiceRolled: false,
          player1: customPlayerPieces,
        },
      };
      return selector(state);
    });

    // Render the component with our dummy data and player prop.
    const {getByTestId} = render(
      <Dice color="purple" rotate={false} player={1} data={dummyData} />,
    );

    // Simulate a long press which calls handleDicePress(6) and forces dice number to be 6.
    const diceButton = getByTestId('dice-button');
    await act(async () => {
      user.longPress(diceButton);
    });

    const {playSound} = require('../../src/helpers/SoundUtility');
    expect(playSound).toHaveBeenCalledWith('dice_roll');

    // Advance the delay of 1300ms.
    await act(async () => {
      jest.advanceTimersByTime(1300);
    });

    const {
      updateDiceNumber,
      enablePileSelection,
      enableCellSelection,
    } = require('../../src/redux/reducers/gameSlice');

    // Expect the dice number to be updated with 6.
    expect(dispatchMock).toHaveBeenCalledWith(updateDiceNumber({diceNo: 6}));

    // Since dummyData shows that there is at least one piece alive,
    // the code follows the "else" branch.
    // For dice value 6, the branch dispatches enablePileSelection and then enableCellSelection.
    expect(dispatchMock).toHaveBeenCalledWith(
      enablePileSelection({playerNo: 1}),
    );
    expect(dispatchMock).toHaveBeenCalledWith(
      enableCellSelection({playerNo: 1}),
    );
  });

  it('should update player chance when some pieces are alive but cannot be moved with this dice number', async () => {
    // Force Math.random so that Math.ceil(Math.random() * 6) returns 3.
    const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.5);

    // dummyData simulates the overall pieces positions (from props.data).
    // Here, one piece is out (alive) and others are at the starting position.
    const dummyData = [
      {pos: 10}, // one piece is out, making isAnyPieceAlive !== -1
      {pos: 0},
      {pos: 0},
      {pos: 0},
    ];

    // customPlayerPieces simulates player pieces from Redux.
    // One piece is already out (pos !== 0) but its travelCount is so high that 55 + 3 exceeds 57.
    // The other pieces are at the start (pos === 0).
    const customPlayerPieces = [
      {pos: 10, travelCount: 55}, // 55 + 3 = 58 > 57 → cannot move
      {pos: 0, travelCount: 0},
      {pos: 0, travelCount: 0},
      {pos: 0, travelCount: 0},
    ];

    // Override useSelector for player pieces to return our custom array.
    useSelectorSpy.mockImplementation(selector => {
      const state = {
        game: {
          currentPlayerChance: 1,
          diceNo: 1,
          isDiceRolled: false,
          player1: customPlayerPieces,
        },
      };
      return selector(state);
    });

    // Render the component with the dummy data and player prop.
    const {getByTestId} = render(
      <Dice color="orange" rotate={false} player={1} data={dummyData} />,
    );

    // Simulate a normal press on the dice button.
    // Since predice is falsy (0), the component will use Math.random to compute dice number.
    const diceButton = getByTestId('dice-button');
    await act(async () => {
      user.press(diceButton);
    });

    const {playSound} = require('../../src/helpers/SoundUtility');
    expect(playSound).toHaveBeenCalledWith('dice_roll');

    // Advance the initial delay of 1300ms.
    await act(async () => {
      jest.advanceTimersByTime(1300);
    });

    const {
      updateDiceNumber,
      updatePlayerChance,
      enableCellSelection,
    } = require('../../src/redux/reducers/gameSlice');

    // Expect the dice number to be updated with 3.
    expect(dispatchMock).toHaveBeenCalledWith(updateDiceNumber({diceNo: 3}));

    // At this point, since one piece is alive (dummyData shows a piece out) but it cannot move (55+3 > 57),
    // the function should take the branch that awaits an extra 600ms and then dispatch updatePlayerChance.
    await act(async () => {
      jest.advanceTimersByTime(600);
    });

    // With player 1, chance should update to 2.
    expect(dispatchMock).toHaveBeenCalledWith(
      updatePlayerChance({chancePlayer: 2}),
    );

    // In this branch the function returns early, so it should NOT dispatch enableCellSelection.
    expect(dispatchMock).not.toHaveBeenCalledWith(
      enableCellSelection({playerNo: 1}),
    );

    randomSpy.mockRestore();
  });
});
