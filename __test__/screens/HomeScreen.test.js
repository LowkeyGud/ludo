import {useIsFocused} from '@react-navigation/native';
import {fireEvent} from '@testing-library/react-native';
import SoundPlayer from 'react-native-sound-player';
import {navigate} from '../../src/helpers/NavigationUtil';
import {playSound} from '../../src/helpers/SoundUtility';
import HomeScreen from '../../src/screens/HomeScreen';
import {renderWithProviders} from '../redux/renderWithProvider';

jest.mock('@react-navigation/native', () => ({
  useIsFocused: jest.fn(),
}));

jest.mock('../../src/constants/Scaling', () => ({
  deviceHeight: 800,
  deviceWidth: 400,
}));

jest.mock('../../src/helpers/SoundUtility', () => ({
  playSound: jest.fn(),
}));
jest.mock('../../src/helpers/NavigationUtil', () => ({
  navigate: jest.fn(),
}));
jest.mock('react-native-sound-player', () => ({
  stop: jest.fn(),
}));

describe('HomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useIsFocused.mockReturnValue(true); // Default to focused for most tests
  });
  test('renders correctly with no saved game', () => {
    useIsFocused.mockReturnValue(true);
    const {getByText, queryByText, getByTestId, getByLabelText} =
      renderWithProviders(<HomeScreen />, {
        preloadedState: {
          game: {currentPositions: null},
        },
      });
    expect(getByLabelText('Logo')).toBeTruthy();
    expect(getByText('Start New Game')).toBeTruthy();
    expect(queryByText('RESUME')).toBeNull();
    expect(getByTestId('witch')).toBeTruthy();
    expect(playSound).toHaveBeenCalledWith('home');
  });

  test('renders resume button with saved game', () => {
    useIsFocused.mockReturnValue(true);
    const {getByText} = renderWithProviders(<HomeScreen />, {
      preloadedState: {
        game: {
          currentPositions: {},
        },
      },
    });
    expect(getByText('RESUME')).toBeTruthy();
    expect(getByText('Start New Game')).toBeTruthy();
  });
  test('"start new game" button resets game and navigates', () => {
    useIsFocused.mockReturnValue(true);
    const {getByText, store} = renderWithProviders(<HomeScreen />, {
      preloadedState: {
        game: {
          currentPositions: {},
        },
      },
    });
    const startButton = getByText('Start New Game');
    fireEvent.press(startButton);
    const state = store.getState();
    expect(state.game.currentPositions).toHaveLength(0); // Assuming resetGame sets it to null
    expect(SoundPlayer.stop).toHaveBeenCalled();
    expect(navigate).toHaveBeenCalledWith('LudoBoardScreen');
    expect(playSound).toHaveBeenCalledWith('game_start');
  });
  test('"resume game" button navigates without resetting', () => {
    useIsFocused.mockReturnValue(true);
    const {getByText, store} = renderWithProviders(<HomeScreen />, {
      preloadedState: {
        game: {
          currentPositions: {
            hlala: 'lalala',
          },
        },
      },
    });
    const resumeButton = getByText('RESUME');
    fireEvent.press(resumeButton);
    const state = store.getState();
    expect(state.game.currentPositions).toEqual({
      hlala: 'lalala',
    });
    expect(SoundPlayer.stop).toHaveBeenCalled();
    expect(navigate).toHaveBeenCalledWith('LudoBoardScreen');
    expect(playSound).toHaveBeenCalledWith('game_start');
  });
  test('pressing witch plays random sound', () => {
    useIsFocused.mockReturnValue(true);
    const {getByTestId} = renderWithProviders(<HomeScreen />);
    const witchPressable = getByTestId('witch');
    fireEvent.press(witchPressable);
    expect(playSound).toHaveBeenCalledWith(expect.stringMatching(/girl[1-3]/));
  });
  test('plays sound when focused', () => {
    useIsFocused.mockReturnValue(true);
    renderWithProviders(<HomeScreen />);
    expect(playSound).toHaveBeenCalledWith('home');
  });
});
