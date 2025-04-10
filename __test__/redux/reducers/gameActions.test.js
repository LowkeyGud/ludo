import {SafeSpots} from '../../../src/helpers/PlotData';
import {playSound} from '../../../src/helpers/SoundUtility';
import {handleForwardThunk} from '../../../src/redux/reducers/gameActions';
import {
  selectCurrentPositions,
  selectDiceNo,
} from '../../../src/redux/reducers/gameSelector';
import {
  announceWinner,
  disableTouch,
  updatePlayerChance,
} from '../../../src/redux/reducers/gameSlice';

jest.mock('../../../src/helpers/SoundUtility', () => ({
  playSound: jest.fn(),
}));

jest.mock('../../../src/helpers/Utils', () => ({
  delay: jest.fn(() => Promise.resolve()),
}));

jest.mock('../../../src/redux/reducers/gameSelector', () => ({
  selectCurrentPositions: jest.fn(),
  selectDiceNo: jest.fn(),
}));

jest.mock('../../../src/redux/reducers/gameSlice', () => ({
  disableTouch: jest.fn(() => ({type: 'disableTouch'})),
  unfreezeDice: jest.fn(() => ({type: 'unfreezeDice'})),
  announceWinner: jest.fn(playerNo => ({
    type: 'announceWinner',
    payload: playerNo,
  })),
  updateFireworks: jest.fn(show => ({type: 'updateFireworks', payload: show})),
  updatePlayerChance: jest.fn(({chancePlayer}) => ({
    type: 'updatePlayerChance',
    payload: {chancePlayer},
  })),
  updatePlayerPieceValue: jest.fn(({playerNo, pieceId, pos, travelCount}) => ({
    type: 'updatePlayerPieceValue',
    payload: {playerNo, pieceId, pos, travelCount},
  })),
}));

describe('handleForwardThunk', () => {
  let dispatch;
  let getState;

  beforeEach(() => {
    dispatch = jest.fn();
    getState = jest.fn();
    jest.clearAllMocks();
  });

  it('moves the piece forward by the dice number', async () => {
    const playerNo = 1;
    const id = 'A1';
    const initialPos = 10;
    const diceNo = 3;

    selectDiceNo.mockReturnValue(diceNo);
    selectCurrentPositions.mockReturnValue([
      {id: 'A1', pos: initialPos, player: 'player1'},
    ]);

    getState.mockImplementation(() => ({
      game: {
        player1: [{id: 'A1', pos: initialPos, travelCount: initialPos}],
        diceNo,
      },
    }));

    const thunk = handleForwardThunk(playerNo, id, initialPos);
    await thunk(dispatch, getState);

    // Check that disableTouch was dispatched
    expect(dispatch).toHaveBeenCalledWith(disableTouch());

    // Check that updatePlayerPieceValue was dispatched 3 times with correct positions
    const updateActions = dispatch.mock.calls
      .map(args => args[0])
      .filter(action => action.type === 'updatePlayerPieceValue');

    expect(updateActions).toHaveLength(3);
    expect(updateActions[0].payload.travelCount).toBe(initialPos + 1);
    expect(updateActions[1].payload.travelCount).toBe(initialPos + 2);
    expect(updateActions[2].payload.travelCount).toBe(initialPos + 3);

    // Check that chance moves to the next player
    expect(dispatch).toHaveBeenCalledWith(
      updatePlayerChance({chancePlayer: 2}),
    );
  });

  it('sends enemy piece back on collision', async () => {
    const playerNo = 1;
    const id = 'A1';
    const initialPos = 20;
    const diceNo = 1;
    const enemyId = 'B1';

    selectDiceNo.mockReturnValue(diceNo);
    selectCurrentPositions
      .mockReturnValue([
        {id: 'A1', pos: initialPos, player: 'player1'},
        {id: enemyId, pos: initialPos, player: 'player2'},
      ])
      .mockReturnValueOnce([
        {id: 'A1', pos: initialPos, player: 'player1'},
        {id: enemyId, pos: initialPos + diceNo, player: 'player2'},
      ])
      .mockReturnValueOnce([
        {id: 'A1', pos: initialPos + diceNo, player: 'player1'},
        {id: enemyId, pos: initialPos + diceNo, player: 'player2'},
      ]);

    getState.mockImplementation(() => ({
      game: {
        player1: [{id: 'A1', pos: initialPos, travelCount: initialPos}],
        player2: [{id: enemyId, pos: initialPos, travelCount: 20}],
        diceNo,
      },
    }));

    const thunk = handleForwardThunk(playerNo, id, initialPos);
    await thunk(dispatch, getState);
    expect(selectCurrentPositions).toHaveBeenCalledTimes(2);
    expect(selectDiceNo).toHaveBeenCalledTimes(1);

    // Check that enemy piece is moved back to starting position (0)
    const enemyUpdates = dispatch.mock.calls
      .map(args => args[0])
      .filter(
        action =>
          action.type === 'updatePlayerPieceValue' &&
          action.payload.playerNo === 'player2',
      );

    expect(enemyUpdates).toContainEqual({
      type: 'updatePlayerPieceValue',
      payload: {
        playerNo: 'player2',
        pieceId: enemyId,
        pos: 0,
        travelCount: 0,
      },
    });

    expect(playSound).toHaveBeenCalledWith('collide');
  });

  it('does not trigger collision on safe spot', async () => {
    const playerNo = 1;
    const id = 'A1';
    const initialPos = SafeSpots[0] - 1; // Position before a safe spot
    const diceNo = 1;

    selectDiceNo.mockReturnValue(diceNo);

    selectCurrentPositions
      .mockReturnValue([
        // fallback, not used since selectCurrentPositions is called only twice, can be removed safely
        {id: 'A1', pos: SafeSpots[0], player: 'player1'},
        {id: 'B1', pos: SafeSpots[0], player: 'player2'},
      ])
      .mockReturnValueOnce([
        {id: 'A1', pos: initialPos, player: 'player1'},
        {id: 'B1', pos: initialPos + diceNo, player: 'player2'},
      ])
      .mockReturnValueOnce([
        {id: 'A1', pos: initialPos + diceNo, player: 'player1'},
        {id: 'B1', pos: initialPos + diceNo, player: 'player2'},
      ]);

    getState.mockImplementation(() => ({
      game: {
        player1: [{id: 'A1', pos: initialPos, travelCount: initialPos}],
        player2: [{id: 'B1', pos: SafeSpots[0], travelCount: 20}],
        diceNo,
      },
    }));

    const thunk = handleForwardThunk(playerNo, id, initialPos);
    await thunk(dispatch, getState);

    // No collision actions should be dispatched
    const enemyUpdates = dispatch.mock.calls
      .map(args => args[0])
      .filter(
        action =>
          action.type === 'updatePlayerPieceValue' &&
          action.payload.playerNo === 'player2',
      );

    expect(enemyUpdates).toHaveLength(0);
    expect(playSound).toHaveBeenCalledWith('safe_spot');
  });

  it('announces winner when all pieces reach 57', async () => {
    const playerNo = 1;
    const id = 'A1';
    const initialPos = 56;
    const diceNo = 1;

    selectDiceNo.mockReturnValue(diceNo);
    selectCurrentPositions
      .mockReturnValue([
        {id: 'A1', pos: initialPos, travelCount: initialPos},
        {id: 'A2', pos: 57, travelCount: 57},
        {id: 'A3', pos: 57, travelCount: 57},
        {id: 'A4', pos: 57, travelCount: 57},
      ])
      .mockReturnValueOnce([
        {id: 'A1', pos: initialPos, travelCount: initialPos},
        {id: 'A2', pos: 57, travelCount: 57},
        {id: 'A3', pos: 57, travelCount: 57},
        {id: 'A4', pos: 57, travelCount: 57},
      ])
      .mockReturnValueOnce([
        {id: 'A1', pos: 57, travelCount: 57},
        {id: 'A2', pos: 57, travelCount: 57},
        {id: 'A3', pos: 57, travelCount: 57},
        {id: 'A4', pos: 57, travelCount: 57},
      ]);

    getState
      .mockReturnValue({
        game: {
          player1: [
            {id: 'A1', pos: 57, travelCount: 57},
            {id: 'A2', pos: 57, travelCount: 57},
            {id: 'A3', pos: 57, travelCount: 57},
            {id: 'A4', pos: 57, travelCount: 57},
          ],
          diceNo,
        },
      })
      .mockReturnValueOnce({
        game: {
          player1: [
            {id: 'A1', pos: initialPos, travelCount: initialPos},
            {id: 'A2', pos: 57, travelCount: 57},
            {id: 'A3', pos: 57, travelCount: 57},
            {id: 'A4', pos: 57, travelCount: 57},
          ],
          diceNo,
        },
      });

    const thunk = handleForwardThunk(playerNo, id, initialPos);
    await thunk(dispatch, getState);

    expect(dispatch).toHaveBeenCalledWith(announceWinner(playerNo));
    expect(playSound).toHaveBeenCalledWith('cheer');
  });

  it('doesnot announce winner when not all pieces reach 57', async () => {
    const playerNo = 1;
    const id = 'A1';
    const initialPos = 56;
    const diceNo = 1;

    selectDiceNo.mockReturnValue(diceNo);
    selectCurrentPositions
      .mockReturnValue([
        {id: 'A1', pos: initialPos, travelCount: initialPos},
        {id: 'A2', pos: 57, travelCount: 56},
        {id: 'A3', pos: 57, travelCount: 57},
        {id: 'A4', pos: 57, travelCount: 57},
      ])
      .mockReturnValueOnce([
        {id: 'A1', pos: initialPos, travelCount: initialPos},
        {id: 'A2', pos: 57, travelCount: 56},
        {id: 'A3', pos: 57, travelCount: 57},
        {id: 'A4', pos: 57, travelCount: 57},
      ])
      .mockReturnValueOnce([
        {id: 'A1', pos: initialPos + diceNo, travelCount: initialPos + diceNo},
        {id: 'A2', pos: 57, travelCount: 56},
        {id: 'A3', pos: 57, travelCount: 57},
        {id: 'A4', pos: 57, travelCount: 57},
      ]);

    getState
      .mockReturnValue({
        game: {
          player1: [
            {
              id: 'A1',
              pos: initialPos + diceNo,
              travelCount: initialPos + diceNo,
            },
            {id: 'A2', pos: 56, travelCount: 56},
            {id: 'A3', pos: 57, travelCount: 57},
            {id: 'A4', pos: 57, travelCount: 57},
          ],
          diceNo,
        },
      })
      .mockReturnValueOnce({
        game: {
          player1: [
            {id: 'A1', pos: initialPos, travelCount: initialPos},
            {id: 'A2', pos: 57, travelCount: 57},
            {id: 'A3', pos: 57, travelCount: 57},
            {id: 'A4', pos: 57, travelCount: 57},
          ],
          diceNo,
        },
      });

    const thunk = handleForwardThunk(playerNo, id, initialPos);
    await thunk(dispatch, getState);

    expect(dispatch).not.toHaveBeenCalledWith(announceWinner(playerNo));
    expect(playSound).not.toHaveBeenCalledWith('cheer');
  });

  it('turns on turning point', async () => {
    const playerNo = 1;
    const id = 'A1';
    const initialPos = 51;
    const diceNo = 1;

    selectDiceNo.mockReturnValue(diceNo);
    selectCurrentPositions
      .mockReturnValue([
        {id: 'A1', pos: initialPos, travelCount: initialPos},
        {id: 'A2', pos: 56, travelCount: 56},
        {id: 'A3', pos: 57, travelCount: 57},
        {id: 'A4', pos: 57, travelCount: 57},
      ])
      .mockReturnValueOnce([
        {id: 'A1', pos: initialPos, travelCount: initialPos},
        {id: 'A2', pos: 56, travelCount: 56},
        {id: 'A3', pos: 57, travelCount: 57},
        {id: 'A4', pos: 57, travelCount: 57},
      ])
      .mockReturnValueOnce([
        {id: 'A1', pos: initialPos + diceNo, travelCount: initialPos + diceNo},
        {id: 'A2', pos: 56, travelCount: 56},
        {id: 'A3', pos: 57, travelCount: 57},
        {id: 'A4', pos: 57, travelCount: 57},
      ]);

    getState.mockReturnValue({
      game: {
        player1: [
          {
            id: 'A1',
            pos: initialPos,
            travelCount: initialPos,
          },
          {id: 'A2', pos: 56, travelCount: 56},
          {id: 'A3', pos: 57, travelCount: 57},
          {id: 'A4', pos: 57, travelCount: 57},
        ],
        diceNo,
      },
    });

    const thunk = handleForwardThunk(playerNo, id, initialPos);
    await thunk(dispatch, getState);
  });
});
