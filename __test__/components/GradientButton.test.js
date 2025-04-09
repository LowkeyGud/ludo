import {fireEvent, render, screen} from '@testing-library/react-native';
import GradientButton from '../../src/components/GradientButton';
import {playSound} from '../../src/helpers/SoundUtility';

jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => {
  // Return a mock component that passes through props
  return ({name, size, color, accessibilityLabel}) => (
    <view
      name={name}
      size={size}
      color={color}
      accessibilityLabel={accessibilityLabel}
      accessible={true} // Ensure it’s queryable
    />
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
    const {getByText} = render(
      <GradientButton title="START" onPress={() => {}} />,
    );

    // Check text renders
    const buttonText = getByText('START');
    expect(buttonText).toBeTruthy();
    // Little bit overkill to check styles?🤔
    expect(buttonText.props.style).toMatchObject({
      color: '#fff', // Matches styles.buttonText
      fontSize: 14,
      fontWeight: 'bold',
      textTransform: 'uppercase',
    });

    // Check default icon (play)
    const icon = screen.getByLabelText('Play Button');
    // expect(icon.props.name).toBe('play');
    expect(icon.props.color).toBe('#fff'); // Default iconColor
    expect(icon.props.size).toBe(20); // RFValue(20)
  });

  it('renders resume icon when title is RESUME', () => {
    const {getByLabelText} = render(
      <GradientButton title="RESUME" onPress={() => {}} />,
    );

    const icon = getByLabelText('Resume Button');
    expect(icon.props.name).toBe('play-circle-outline');
    expect(icon.props.size).toBe(20); // RFValue(20)
    expect(icon.props.color).toBe('#fff');
  });

  it('uses custom iconColor when provided', () => {
    const {getByLabelText} = render(
      <GradientButton title="RESUME" onPress={() => {}} iconColor="#000" />,
    );

    const icon = getByLabelText('Resume Button');
    expect(icon.props.color).toBe('#000'); // Custom color
  });

  it('calls playSound and onPress when pressed', () => {
    const mockOnPress = jest.fn();
    const {getByTestId} = render(
      <GradientButton title="START" onPress={mockOnPress} />,
    );

    // Find the TouchableOpacity (using a testID on btnContainer)
    const button = getByTestId('gradient-button');
    fireEvent.press(button);

    expect(playSound).toHaveBeenCalledWith('ui');
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('applies correct gradient styles', () => {
    const {getByTestId} = render(
      <GradientButton title="START" onPress={() => {}} />,
    );

    // Check gradient container styles
    const gradient = getByTestId('gradient-container');
    expect(gradient.props.style).toMatchObject({
      paddingVertical: 12,
      paddingHorizontal: 40,
      borderRadius: 8,
      flexDirection: 'row',
      gap: 10,
      alignItems: 'center',
      justifyContent: 'center',
    });
  });
});
