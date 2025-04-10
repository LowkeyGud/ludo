import {fireEvent, render, screen} from '@testing-library/react-native';
import React from 'react';
import * as redux from 'react-redux';
import Pile from '../../src/components/Pile';

// 1. Mock BackgroundImage helper
jest.mock('../../src/helpers/GetIcons', () => ({
  BackgroundImage: {
    GetImage: jest.fn().mockReturnValue({uri: 'dummy-icon'}),
  },
}));

// 2. Mock useSelector so we can control return values
const useSelectorMock = jest.spyOn(redux, 'useSelector');

describe('Pile Component', () => {
  const pieceId = 'D1';
  const mockOnPress = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders and allows press when in pocket and player is selected', () => {
    useSelectorMock.mockImplementation(selector => {
      if (selector.name === 'selectPocketPileSelectionPlayer') return 1;
      if (selector.name === 'selectCellSelectionPlayer') return null;
      if (selector.name === 'selectDiceNo') return 6;
      return [{id: pieceId, pos: 0, travelCount: 10}];
    });

    render(
      <Pile
        color="red"
        player={1}
        pieceId={pieceId}
        cell={false}
        onPress={mockOnPress}
      />,
    );

    const pile = screen.getByLabelText('Pile');
    expect(pile.props.accessibilityState.disabled).toBe(false);

    fireEvent.press(pile);
    expect(mockOnPress).toHaveBeenCalled();
  });

  it('does not allow press if not selected player in pocket mode', () => {
    useSelectorMock.mockImplementation(selector => {
      if (selector.name === 'selectPocketPileSelectionPlayer') return 2; // Not selected
      if (selector.name === 'selectCellSelectionPlayer') return null;
      if (selector.name === 'selectDiceNo') return 6;
      return [{id: pieceId, pos: 0, travelCount: 10}];
    });

    render(
      <Pile
        color="red"
        player={1}
        pieceId={pieceId}
        cell={false}
        onPress={mockOnPress}
      />,
    );

    const pile = screen.getByLabelText('Pile');
    expect(pile.props.accessibilityState.disabled).toBe(true);

    fireEvent.press(pile);
    expect(mockOnPress).not.toHaveBeenCalled();
  });

  it('disables press if travelCount + dice > 57 in cell mode', () => {
    useSelectorMock.mockImplementation(selector => {
      if (selector.name === 'selectPocketPileSelectionPlayer') return null;
      if (selector.name === 'selectCellSelectionPlayer') return 1;
      if (selector.name === 'selectDiceNo') return 50;
      return [{id: pieceId, pos: 10, travelCount: 10}]; // 10 + 50 = 60
    });

    render(
      <Pile
        color="red"
        player={1}
        pieceId={pieceId}
        cell={true}
        onPress={mockOnPress}
      />,
    );

    const pile = screen.getByLabelText('Pile');
    expect(pile.props.accessibilityState.disabled).toBe(true);

    fireEvent.press(pile);
    expect(mockOnPress).not.toHaveBeenCalled();
  });

  it('shows dashed circle animation only when enabled', () => {
    useSelectorMock.mockImplementation(selector => {
      if (selector.name === 'selectPocketPileSelectionPlayer') return null;
      if (selector.name === 'selectCellSelectionPlayer') return 1;
      if (selector.name === 'selectDiceNo') return 3;
      return [{id: pieceId, pos: 4, travelCount: 5}]; // 5 + 3 = 8 < 57
    });

    render(
      <Pile
        color="red"
        player={1}
        pieceId={pieceId}
        cell={true}
        onPress={mockOnPress}
      />,
    );

    const pile = screen.getByLabelText('Pile');

    // Look for Svg dashed circle rendered inside animation wrapper
    const dashedSvg = screen.getByLabelText('Dashed Circle');
    expect(dashedSvg).toBeTruthy();
  });
});
