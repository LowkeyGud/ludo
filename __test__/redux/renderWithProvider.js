import {configureStore} from '@reduxjs/toolkit';
import {render} from '@testing-library/react-native';
import {Provider} from 'react-redux';
import rootReducer from '../../src/redux/rootReducer';

export function renderWithProviders(
  ui,
  {
    preloadedState = {},
    store = configureStore({reducer: rootReducer, preloadedState}),
    ...renderOptions
  } = {},
) {
  function Wrapper({children}) {
    return <Provider store={store}>{children}</Provider>;
  }
  return {store, ...render(ui, {wrapper: Wrapper, ...renderOptions})};
}
