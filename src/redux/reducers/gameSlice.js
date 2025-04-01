import {createSlice} from '@reduxjs/toolkit';
import {initialState} from './initialState';

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    resetGame: () => initialState,
  },
});

export const {resetGame} = gameSlice.actions;

export default gameSlice.reducer;
