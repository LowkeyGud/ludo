import {CommonActions} from '@react-navigation/native';
import {
  goBack,
  navigate,
  navigationRef,
  prepareNavigation,
  push,
  resetAndNavigate,
} from '../../src/helpers/NavigationUtil';

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  const mockNavigationRef = {
    isReady: jest.fn().mockReturnValue(true), // Default value
    dispatch: jest.fn(),
  };
  return {
    ...actualNav,
    createNavigationContainerRef: () => mockNavigationRef,
    CommonActions: {
      navigate: jest.fn(),
      reset: jest.fn(),
      goBack: jest.fn(),
      push: jest.fn(),
    },
  };
});

describe('Navigation functions', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Reset mock calls between tests
  });

  it('should navigate to a route', async () => {
    const routeName = 'TestRoute';
    const params = {key: 'value'};
    await navigate(routeName, params);
    expect(CommonActions.navigate).toHaveBeenCalledWith(routeName, params);
  });

  it('should not navigate if not ready', async () => {
    // Arrange: Mock isReady to false for both calls
    navigationRef.isReady
      .mockResolvedValueOnce(true) // For await (must resolve for promise)
      .mockReturnValueOnce(false); // For if condition

    // Act
    await navigate('TestRoute', {key: 'value'});

    // Assert
    expect(navigationRef.dispatch).not.toHaveBeenCalled();
  });

  it('should reset and navigate to a route', async () => {
    const routeName = 'TestRoute';
    await resetAndNavigate(routeName);
    expect(CommonActions.reset).toHaveBeenCalledWith({
      index: 0,
      routes: [{name: routeName}],
    });
  });

  it('should go back', async () => {
    await goBack();
    expect(CommonActions.goBack).toHaveBeenCalled();
  });

  it('should push a route', async () => {
    const routeName = 'TestRoute';
    const params = {key: 'value'};
    await push(routeName, params);
    expect(CommonActions.push).toHaveBeenCalledWith(routeName, params);
  });

  it('should prepare navigation', async () => {
    await prepareNavigation();
    expect(navigationRef.isReady).toHaveBeenCalled();
  });
});
