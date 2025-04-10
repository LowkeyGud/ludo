import {fireEvent, screen} from '@testing-library/react-native';
import React from 'react';
import MenuModal from '../../src/components/MenuModal';
import {goBack} from '../../src/helpers/NavigationUtil';
import {playSound} from '../../src/helpers/SoundUtility';
import {resetGame} from '../../src/redux/reducers/gameSlice';
import {renderWithProviders} from '../redux/renderWithProvider';

// Mock necessary modules and functions
jest.mock('../../src/redux/reducers/gameSlice', () => ({
  resetGame: jest.fn(),
}));

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => jest.fn(),
}));

jest.mock('../../src/helpers/SoundUtility', () => ({
  playSound: jest.fn(),
}));

jest.mock('../../src/helpers/NavigationUtil', () => ({
  goBack: jest.fn(),
}));

describe('MenuModal Component', () => {
  let onPressHide;
  let dispatch;

  beforeEach(() => {
    dispatch = jest.fn(); // Mock the dispatch function
    onPressHide = jest.fn(); // Mock the onPressHide function
  });

  it('should render the modal and buttons', () => {
    const {getByText, getByLabelText} = renderWithProviders(
      <MenuModal visible={true} onPressHide={onPressHide} />,
    );

    // Modal should be visible
    expect(getByLabelText('menu-modal')).toBeTruthy();

    // Buttons should be rendered
    expect(getByText('RESUME')).toBeTruthy();
    expect(getByText('NEW GAME')).toBeTruthy();
    expect(getByText('HOME')).toBeTruthy();
  });

  it('should call goBack on HOME press', () => {
    const {getByText} = renderWithProviders(
      <MenuModal visible={true} onPressHide={onPressHide} />,
    );

    // Press the HOME button
    fireEvent.press(getByText('HOME'));

    // Check if goBack was called
    expect(goBack).toHaveBeenCalled();
  });

  it('should call onPressHide on RESUME press', () => {
    const {getByText} = renderWithProviders(
      <MenuModal visible={true} onPressHide={onPressHide} />,
    );

    // Press the RESUME button
    fireEvent.press(getByText('RESUME'));

    // Ensure that onPressHide was called
    expect(onPressHide).toHaveBeenCalled();
  });

  it('should hide the modal when visible is false', () => {
    renderWithProviders(
      <MenuModal visible={false} onPressHide={onPressHide} />,
    );

    // The modal should not be rendered when visible is false
    expect(screen.queryByLabelText('menu-modal')).toBeNull();
  });

  it('should call resetGame and playSound on NEW GAME press', () => {
    renderWithProviders(<MenuModal visible={true} onPressHide={onPressHide} />);

    // Press the NEW GAME button
    fireEvent.press(screen.getByText('NEW GAME'));

    // Check if resetGame and playSound were called
    expect(resetGame).toHaveBeenCalled();
    expect(playSound).toHaveBeenCalledWith('game_start');

    // Ensure that onPressHide was called to close the modal
    expect(onPressHide).toHaveBeenCalled();
  });
});
