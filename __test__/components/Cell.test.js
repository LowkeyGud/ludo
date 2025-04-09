jest.mock('react-native-responsive-fontsize', () => ({
  RFValue: jest.fn(() => 12), // Mock the RFValue function to return a fixed value
}));

jest.mock('react-native-vector-icons/Ionicons', () => 'Ionicons'); // Mock Ionicons
