import {useIsFocused} from '@react-navigation/native';
import {act, fireEvent, screen} from '@testing-library/react-native';
import {BackHandler} from 'react-native';
import {playSound} from '../../src/helpers/SoundUtility';
import {initialState} from '../../src/redux/reducers/initialState';
import LudoBoardScreen from '../../src/screens/LudoBoardScreen';
import {renderWithProviders} from '../redux/renderWithProvider';

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useIsFocused: jest.fn(),
}));
jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');
jest.mock('../../src/helpers/SoundUtility', () => ({
  playSound: jest.fn(),
}));
jest.mock('../assets/images/start.png', () => 'mock-image');

describe('LudoBoardScreen', () => {
  beforeEach(() => {
    useIsFocused.mockReturnValue(true);
  });
  afterEach(() => {
    jest.clearAllTimers();
  });

  it('renders correctly with initial state', () => {
    renderWithProviders(<LudoBoardScreen />, {
      preloadedState: {
        game: initialState,
      },
    });
    expect(screen.getByLabelText('ludo-board-container')).toBeTruthy();
    expect(screen.getByLabelText('menu-icon')).toBeTruthy();
  });

  it('shows WinModal when winner is set', () => {
    renderWithProviders(<LudoBoardScreen />, {
      preloadedState: {
        game: {...initialState, winner: 'Player 1'},
      },
    });
    expect(screen.getByLabelText('win-modal')).toBeTruthy();
  });

  it('toggles menu visibility on menu press', async () => {
    renderWithProviders(<LudoBoardScreen />, {
      preloadedState: {
        game: {...initialState},
      },
    });
    await act(async () => {
      const menuIcon = screen.getByLabelText('menu-icon');
      fireEvent.press(menuIcon);
    });
    expect(screen.getByLabelText('menu-modal')).toBeTruthy();
    expect(playSound).toHaveBeenCalledWith('ui');
  });

  it('closes menu modal on close button or back button press', async () => {
    const backSpy = jest.spyOn(BackHandler, 'addEventListener');
    renderWithProviders(<LudoBoardScreen />, {
      preloadedState: {
        game: {...initialState},
      },
    });
    const menuIcon = screen.getByLabelText('menu-icon');
    await act(async () => {
      fireEvent.press(menuIcon);
    });
    const menuModal = screen.getByLabelText('menu-modal');
    expect(menuModal).toBeTruthy();
    await act(async () => {
      await menuModal.props.onRequestClose();
    });
    expect(screen.queryByLabelText('menu-modal')).toBeNull();
  });

  it('shows start image on focus and hides after 2 seconds', async () => {
    jest.useFakeTimers();
    useIsFocused.mockReturnValue(true);
    renderWithProviders(<LudoBoardScreen />, {
      preloadedState: {
        game: {...initialState},
      },
    });
    expect(screen.getByLabelText('start-image')).toBeTruthy();
    await act(async () => {
      await jest.advanceTimersByTimeAsync(2000);
    });
    // https:testing-library.com/docs/queries/about#:~:text=queryBy...-,Return%20null,-Return%20element
    expect(screen.queryByLabelText('start-image')).toBeNull();
  });

  it('does not show start image when not focused', () => {
    useIsFocused.mockReturnValue(false);
    renderWithProviders(<LudoBoardScreen />, {
      preloadedState: {
        game: {...initialState},
      },
    });
    expect(screen.queryByLabelText('start-image')).toBeNull();
  });

  it('blocks touch event after the dice is touched', () => {
    renderWithProviders(<LudoBoardScreen />, {
      preloadedState: {
        game: {...initialState, diceTouchBlock: true},
      },
    });
    const diceContainer1 = screen.getByLabelText('dice-container-1');
    const diceContainer2 = screen.getByLabelText('dice-container-2');
    expect(diceContainer1.props.pointerEvents).toBe('none');
    expect(diceContainer2.props.pointerEvents).toBe('none');
  });

  it('does not show WinModal when no winner', () => {
    renderWithProviders(<LudoBoardScreen />, {
      preloadedState: {
        game: {...initialState, winner: null},
      },
    });
    expect(screen.queryByLabelText('win-modal')).toBeNull();
  });
});
