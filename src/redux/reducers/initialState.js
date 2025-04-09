const player1InitialState = [
  // {id: 'A1', pos: 226, travelCount: 57},
  {id: 'A1', pos: 0, travelCount: 0},
  {id: 'A2', pos: 0, travelCount: 0},
  {id: 'A3', pos: 0, travelCount: 0},
  {id: 'A4', pos: 0, travelCount: 0},
];

const player2InitialState = [
  // {id: 'B1', pos: 336, travelCount: 57},
  {id: 'B1', pos: 0, travelCount: 0},
  {id: 'B2', pos: 0, travelCount: 0},
  {id: 'B3', pos: 0, travelCount: 0},
  {id: 'B4', pos: 0, travelCount: 0},
];

const player3InitialState = [
  // {id: 'C1', pos: 446, travelCount: 57},
  {id: 'C1', pos: 0, travelCount: 0},
  {id: 'C2', pos: 0, travelCount: 0},
  {id: 'C3', pos: 0, travelCount: 0},
  {id: 'C4', pos: 0, travelCount: 0},
];

const player4InitialState = [
  // {id: 'D1', pos: 116, travelCount: 57},
  {id: 'D1', pos: 0, travelCount: 0},
  {id: 'D2', pos: 0, travelCount: 0},
  {id: 'D3', pos: 0, travelCount: 0},
  {id: 'D4', pos: 0, travelCount: 0},
];

const testCurrentPositionsOneHome = [
  {id: 'A1', pos: 226},
  {id: 'B1', pos: 336},
  {id: 'C1', pos: 446},
  {id: 'D1', pos: 116},
];

export const initialState = {
  player1: player1InitialState,
  player2: player2InitialState,
  player3: player3InitialState,
  player4: player4InitialState,
  chancePlayer: 1,
  diceNo: 1,
  isDiceRolled: false,
  pileSelectionPlayer: -1, // no player selected
  cellSelectionPlayer: -1,
  diceTouchBlock: false,
  currentPositions: [],
  // currentPositions: testCurrentPositionsOneHome,
  fireworks: false,
  winner: null,
};
