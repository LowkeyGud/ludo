import {render} from '@testing-library/react-native';
import React from 'react';
import {
  prepareNavigation,
  resetAndNavigate,
} from '../../src/helpers/NavigationUtil';
import SplashScreen from '../../src/screens/SplashScreen';

jest.useFakeTimers();

// Mock the navigation functions
jest.mock('../../src/helpers/NavigationUtil', () => ({
  prepareNavigation: jest.fn(),
  resetAndNavigate: jest.fn(),
}));

describe('SplashScreen', () => {
  it('should render correctly', () => {
    const {getByTestId} = render(<SplashScreen />);
    expect(getByTestId('logo-image')).toBeTruthy();
  });

  it('should call prepareNavigation on mount', () => {
    render(<SplashScreen />);
    expect(prepareNavigation).toHaveBeenCalled();
  });

  it('should navigate to HomeScreen after 1.5 seconds', async () => {
    render(<SplashScreen />);

    // ⏩ Fast-forward the timer
    jest.advanceTimersByTime(1500);

    expect(resetAndNavigate).toHaveBeenCalledWith('HomeScreen');
  });
});
