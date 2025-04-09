import {delay} from '../../src/helpers/Utils';

describe('delay', () => {
  // Enable fake timers before each test
  beforeEach(() => {
    jest.useFakeTimers();
  });

  // Clean up after each test
  afterEach(() => {
    jest.useRealTimers();
  });

  it('should return a Promise', () => {
    const result = delay(100);
    expect(result).toBeInstanceOf(Promise);
  });

  it('should resolve after the specified duration', async () => {
    const duration = 1000;
    let resolved = false;

    const promise = delay(duration).then(() => {
      resolved = true;
    });

    // Before advancing timers, promise shouldn't be resolved
    expect(resolved).toBe(false);

    // Advance time by less than duration
    jest.advanceTimersByTime(duration - 1);
    await Promise.resolve(); // Let microtasks run
    expect(resolved).toBe(false);

    // Advance time to full duration
    jest.advanceTimersByTime(1);
    await promise; // Wait for the promise to resolve
    expect(resolved).toBe(true);
  });

  it('should resolve immediately when duration is 0', async () => {
    let resolved = false;

    // Create the promise
    const promise = delay(0).then(() => {
      resolved = true;
    });
    jest.advanceTimersByTime(0);
    await promise;

    expect(resolved).toBe(true);
  });

  it('should work with different duration values', async () => {
    const durations = [100, 500, 1000];

    for (const duration of durations) {
      let resolved = false;
      const promise = delay(duration).then(() => {
        resolved = true;
      });

      expect(resolved).toBe(false);
      jest.advanceTimersByTime(duration);
      await promise;
      expect(resolved).toBe(true);
    }
  });

  it('should not reject the promise', async () => {
    const duration = 1000;
    const onRejected = jest.fn();

    const promise = delay(duration).catch(onRejected);
    jest.advanceTimersByTime(duration);
    await promise;

    expect(onRejected).not.toHaveBeenCalled();
  });
});
