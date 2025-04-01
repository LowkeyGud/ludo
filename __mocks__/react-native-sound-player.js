module.exports = {
  playSoundFile: jest.fn(),
  loadSoundFile: jest.fn(),
  addEventListener: jest.fn(() => ({remove: jest.fn()})),
  removeEventListener: jest.fn(),
  // Add other methods as needed based on your usage
};
