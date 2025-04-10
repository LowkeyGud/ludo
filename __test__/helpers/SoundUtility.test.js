// soundUtils.test.js
import SoundPlayer from 'react-native-sound-player';
import {playSound} from '../../src/helpers/SoundUtility';

// Mock the SoundPlayer module
jest.mock('react-native-sound-player', () => ({
  playAsset: jest.fn(),
}));

describe('Sound Utilities', () => {
  beforeEach(() => {
    SoundPlayer.playAsset.mockClear();
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  describe('playSound', () => {
    test.each([
      'dice_roll',
      'cheer',
      'game_start',
      'collide',
      'home_win',
      'pile_move',
      'safe_spot',
      'ui',
      'home',
      'girl2',
      'girl1',
      'girl3',
    ])('plays %s sound with mocked path', soundName => {
      playSound(soundName);
      expect(SoundPlayer.playAsset).toHaveBeenCalledWith('mocked-sound');
      expect(SoundPlayer.playAsset).toHaveBeenCalledTimes(1);
    });

    test('handles unknown sound name and logs error', () => {
      playSound('unknown_sound');
      expect(SoundPlayer.playAsset).not.toHaveBeenCalled();
      expect(console.log).toHaveBeenCalledWith(
        'cannot play the sound file',
        expect.objectContaining({message: 'Sound unknown_sound not found'}),
      );
    });

    test('handles playback error and logs it', () => {
      SoundPlayer.playAsset.mockImplementation(() => {
        throw new Error('Playback failed');
      });

      playSound('dice_roll');
      expect(SoundPlayer.playAsset).toHaveBeenCalledWith('mocked-sound');
      expect(console.log).toHaveBeenCalledWith(
        'cannot play the sound file',
        expect.any(Error),
      );
    });

    test('does not throw error on failure', () => {
      SoundPlayer.playAsset.mockImplementation(() => {
        throw new Error('Playback failed');
      });

      expect(() => playSound('dice_roll')).not.toThrow();
    });
  });
});
