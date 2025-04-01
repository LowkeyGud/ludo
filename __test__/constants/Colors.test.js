// Colors.test.js
import {Colors} from '../../src/constants/Colors'; // Adjust the path to your file

describe('Colors', () => {
  it('should have the correct green color', () => {
    expect(Colors.green).toBe('#00a049');
  });

  it('should have the correct red color', () => {
    expect(Colors.red).toBe('#d5151d');
  });

  it('should have the correct yellow color', () => {
    expect(Colors.yellow).toBe('#ffde17');
  });

  it('should have the correct blue color', () => {
    expect(Colors.blue).toBe('#28aeff');
  });

  it('should have the correct borderColor', () => {
    expect(Colors.borderColor).toBe('#4f6e82');
  });

  it('should contain exactly 5 color properties', () => {
    const colorKeys = Object.keys(Colors);
    expect(colorKeys).toHaveLength(5);
    expect(colorKeys).toEqual([
      'green',
      'red',
      'yellow',
      'blue',
      'borderColor',
    ]);
  });

  it('should be an object with defined values', () => {
    expect(typeof Colors).toBe('object');
    expect(Colors).not.toBeNull();
    Object.values(Colors).forEach(color => {
      expect(color).toBeDefined();
      expect(typeof color).toBe('string');
      expect(color).toMatch(/^#[0-9A-Fa-f]{6}$/); // Basic hex color validation
    });
  });
});
