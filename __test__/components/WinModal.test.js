import {act, fireEvent, render} from '@testing-library/react-native';
import React from 'react';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';
import WinModal from '../../src/components/WinModal';

const mockStore = configureStore([]);
const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

describe('WinModal Component', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      game: {
        currentPositions: null,
      },
    });
    jest.clearAllMocks();
  });

  it('should render correctly when winner is provided', () => {
    const {getByText, getAllByLabelText} = render(
      <Provider store={store}>
        <WinModal winner={1} />
      </Provider>,
    );

    expect(getByText('Congratulations! Player 1!')).toBeTruthy();
    expect(getAllByLabelText('win-modal')).toBeTruthy();
  });

  it('should call dispatch when "New Game" button is pressed', () => {
    const {getByText} = render(
      <Provider store={store}>
        <WinModal winner={1} />
      </Provider>,
    );

    const newGameButton = getByText('New Game');
    fireEvent.press(newGameButton);

    expect(mockDispatch).toHaveBeenCalledTimes(2); // resetGame and announceWinner
  });

  it('should call dispatch when "Home" button is pressed', () => {
    const {getByText} = render(
      <Provider store={store}>
        <WinModal winner={1} />
      </Provider>,
    );

    const homeButton = getByText('Home');
    fireEvent.press(homeButton);

    expect(mockDispatch).toHaveBeenCalledTimes(2); // resetGame and announceWinner
  });

  it('should not render when winner is null', () => {
    const {queryByText} = render(
      <Provider store={store}>
        <WinModal winner={null} />
      </Provider>,
    );

    expect(queryByText('Congratulations! Player')).toBeNull();
  });

  it('closes modal when back button is pressed', async () => {
    const {getByLabelText, queryByText} = render(
      <Provider store={store}>
        <WinModal winner={1} />
      </Provider>,
    );

    // Verify modal is initially visible
    expect(getByLabelText('win-modal')).toBeTruthy();
    expect(queryByText('Congratulations! Player 1!')).toBeTruthy();

    // Simulate back button press
    const modal = getByLabelText('win-modal');
    fireEvent(modal, 'onRequestClose');

    // Since setVisible(false) should hide the modal content,
    // we need to wait for the state update to reflect
    // Using act() to ensure state updates are processed
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0)); // Wait for state update
    });

    // Check if content is no longer visible
    // Note: The Modal component itself might still be in the DOM due to how RN Modal works,
    // but its content should be hidden when isVisible is false
    expect(queryByText('Congratulations! Player 1!')).toBeNull();
  });
});
