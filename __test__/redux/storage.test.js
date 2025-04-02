// reduxStorage.test.js

const {default: reduxStorage} = require('../../src/redux/storage');

// Mock the react-native-mmkv module
jest.mock('react-native-mmkv', () => {
  // Mock MMKV class
  const mockStorage = {
    set: jest.fn(),
    getString: jest.fn(),
    delete: jest.fn(),
  };
  return {
    MMKV: jest.fn(() => mockStorage), // Return mock instance when new MMKV() is called
  };
});

describe('reduxStorage', () => {
  let mockMMKVInstance;

  beforeEach(() => {
    // Access the mocked MMKV instance
    const {MMKV} = require('react-native-mmkv');
    mockMMKVInstance = new MMKV(); // This uses the mock
    // Clear mock calls before each test
    jest.clearAllMocks();
  });

  describe('setItem', () => {
    test('sets a key-value pair and resolves with true', async () => {
      const result = await reduxStorage.setItem('testKey', 'testValue');
      expect(mockMMKVInstance.set).toHaveBeenCalledWith('testKey', 'testValue');
      expect(mockMMKVInstance.set).toHaveBeenCalledTimes(1);
      expect(result).toBe(true);
    });
  });

  describe('getItem', () => {
    test('retrieves a value for a key', async () => {
      mockMMKVInstance.getString.mockReturnValue('storedValue');
      const result = await reduxStorage.getItem('testKey');
      expect(mockMMKVInstance.getString).toHaveBeenCalledWith('testKey');
      expect(mockMMKVInstance.getString).toHaveBeenCalledTimes(1);
      expect(result).toBe('storedValue');
    });

    test('returns undefined for a non-existent key', async () => {
      mockMMKVInstance.getString.mockReturnValue(undefined);
      const result = await reduxStorage.getItem('missingKey');
      expect(mockMMKVInstance.getString).toHaveBeenCalledWith('missingKey');
      expect(result).toBeUndefined();
    });
  });

  describe('removeItem', () => {
    test('deletes a key and resolves', async () => {
      const result = await reduxStorage.removeItem('testKey');
      expect(mockMMKVInstance.delete).toHaveBeenCalledWith('testKey');
      expect(mockMMKVInstance.delete).toHaveBeenCalledTimes(1);
      expect(result).toBeUndefined(); // Promise.resolve() returns undefined
    });
  });
});
