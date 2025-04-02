import {render} from '@testing-library/react-native';
import {Text} from 'react-native';
import Wrapper from '../../src/components/Wrapper'; // Adjust path

// Mock dependencies
jest.mock('@react-native-community/blur', () => ({
  BlurView: ({children, style, blurType, blurAmount}) => (
    <view style={style} blurType={blurType} blurAmount={blurAmount}>
      {children}
    </view>
  ),
}));

jest.mock('../../src/assets/images/bg.jpeg', () => 'mock-bg-image');

jest.mock('../../src/constants/Scaling', () => ({
  deviceHeight: 800,
  deviceWidth: 400,
}));

describe('Wrapper', () => {
  it('renders with children and default styles', () => {
    const {getByLabelText, getByText} = render(
      <Wrapper>
        <view>
          <Text>Test Child</Text>
        </view>
      </Wrapper>,
    );

    // Check ImageBackground with accessibilityLabel
    const background = getByLabelText('Blur image background');
    expect(background).toBeTruthy();

    // Check child content
    const child = getByText('Test Child');
    expect(child).toBeTruthy();
  });

  it('applies default styles to SafeAreaView', () => {
    const {getByTestId} = render(
      <Wrapper>
        <Text>Test Child</Text>
      </Wrapper>,
    );

    // Find the SafeAreaView by its children or accessibility role
    const safeAreaView = getByTestId('safe-area');
    expect(safeAreaView).toHaveStyle({
      height: 800,
      width: 400,
      justifyContent: 'center',
      alignItems: 'center',
    });
  });

  it('merges custom styles with default styles on SafeAreaView', () => {
    const customStyle = {
      backgroundColor: 'red',
      padding: 20,
    };

    const {getByTestId} = render(
      <Wrapper style={customStyle}>
        <Text>Test Child</Text>
      </Wrapper>,
    );

    const safeAreaView = getByTestId('safe-area');

    // Check that default styles are present
    expect(safeAreaView).toHaveStyle({
      height: 800,
      width: 400,
      justifyContent: 'center',
      alignItems: 'center',
    });

    // Check that custom styles are merged
    expect(safeAreaView).toHaveStyle({
      backgroundColor: 'red',
      padding: 20,
    });
  });
});
