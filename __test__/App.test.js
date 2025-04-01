import {render} from '@testing-library/react-native';
import React from 'react';
import App from '../App';

jest.useFakeTimers();

// Mock redux-persist
jest.mock('redux-persist', () => {
  const real = jest.requireActual('redux-persist');
  return {
    ...real,
    persistReducer: jest
      .fn()
      .mockImplementation((_config, reducers) => reducers),
    // Mock other exports if needed
  };
});

test('The Main App Renders Correctly', () => {
  const {toJSON} = render(<App />);
  expect(toJSON()).toMatchSnapshot();
});
