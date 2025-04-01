import {fireEvent, render, screen} from '@testing-library/react-native';
import GradientButton from '../../src/components/GradientButton';
import {playSound} from '../../src/helpers/SoundUtility';

// Mock dependencies
jest.mock('react-native-linear-gradient', () => {
  return ({children, ...props}) => <>{children}</>; // Simple mock returning children
});

jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => {
  return ({name, size, color}) => (
    <mock-icon testID={`icon-${name}`} name={name} size={size} color={color} />
  );
});

jest.mock('../../src/helpers/SoundUtility', () => ({
  playSound: jest.fn(), // Mock playSound function
}));

jest.mock('react-native-responsive-fontsize', () => ({
  RFValue: jest.fn(value => value), // Mock RFValue to return input value
}));

describe('GradientButton', () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with default props', () => {
    const {getByText, getByTestID} = render(
      <GradientButton title="START" onPress={() => {}} />,
    );

    // Check text renders
    const buttonText = getByText('START');
    expect(buttonText).toBeTruthy();
    expect(buttonText.props.style).toMatchObject({
      color: '#fff', // Matches styles.buttonText
      fontSize: 14,
      fontWeight: 'bold',
      textTransform: 'uppercase',
    });
  });

  it('calls playSound and onPress when pressed', () => {
    const mockOnPress = jest.fn();
    render(<GradientButton title="START" onPress={mockOnPress} />);

    // Find the TouchableOpacity (using a testID on btnContainer)
    const button = screen.getByTestId('gradient-button');
    fireEvent.press(button);

    expect(playSound).toHaveBeenCalledWith('ui');
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });
});
