import {combineReducers} from 'redux';
import gameSlice from './reducers/gameSlice';

const rootReducer = combineReducers({
  game: gameSlice,
});

console.log(rootReducer);

export default rootReducer;
