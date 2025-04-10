import {Colors} from '../../src/constants/Colors';
import {BackgroundImage} from '../../src/helpers/GetIcons';

describe('BackgroundImage', () => {
  it('should return the correct image when name exists', () => {
    expect(BackgroundImage.GetImage(1)).not.toBeNull();
    expect(BackgroundImage.GetImage(2)).not.toBeNull();
    expect(BackgroundImage.GetImage(3)).toEqual('mocked-image');
    expect(BackgroundImage.GetImage(Colors.green)).not.toBeNull();
    expect(BackgroundImage.GetImage(Colors.red)).not.toBeNull();
    expect(BackgroundImage.GetImage(Colors.yellow)).not.toBeNull();
    expect(BackgroundImage.GetImage(Colors.blue)).toEqual('mocked-image');
  });

  it('should return null when name does not exist', () => {
    expect(BackgroundImage.GetImage('non-existing')).toBeNull();
    expect(BackgroundImage.GetImage('')).toBeNull();
    expect(BackgroundImage.GetImage('random')).toBeNull();
  });

  it('should handle edge cases', () => {
    expect(BackgroundImage.GetImage(null as unknown as string)).toBeNull();
    expect(BackgroundImage.GetImage(undefined as unknown as string)).toBeNull();
  });
});
