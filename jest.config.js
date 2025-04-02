module.exports = {
  preset: 'react-native',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  setupFilesAfterEnv: ['./jest-setup.ts'],
  transform: {
    '^.+\\.(ts|tsx)$': 'babel-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|react-native-swiper|react-redux|react-native-sound-player|react-native-linear-gradient|react-native-vector-icons|@react-navigation|@react-native|@react-native/assets)/)',
  ],
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
  testPathIgnorePatterns: ['/node_modules/', '/android/', '/ios/'],
  collectCoverage: true,
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(png|jpg|jpeg|gif|svg)$': '<rootDir>/__mocks__/imageMock.tsx',
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(mp3|wav)$': '<rootDir>/__mocks__/soundMock.tsx',
    'react-native-responsive-fontsize':
      '<rootDir>/__mocks__/react-native-responsive-fontsize.tsx',
    'react-native-sound-player':
      '<rootDir>/__mocks__/react-native-sound-player.js',
  },
  coverageReporters: ['json', 'text', 'lcov', 'clover'],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/navigation/*.{js,jsx,ts,tsx}',
  ],
  globals: {
    'ts-jest': {
      babelConfig: true,
    },
  },
};
