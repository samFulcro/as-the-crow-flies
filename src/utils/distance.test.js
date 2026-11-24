import { describe, it, expect } from 'vitest';
import { haversineKm, convertDistance, isWithinRange } from './distance';

describe('haversineKm', () => {
  it('returns 0 for the same point', () => {
    expect(haversineKm(51.5074, -0.1278, 51.5074, -0.1278)).toBe(0);
  });

  it('calculates London to Paris as roughly 343.6 km', () => {
    expect(haversineKm(51.5074, -0.1278, 48.8566, 2.3522)).toBeCloseTo(343.6, 0);
  });

  it('takes the short route across the 180° line', () => {
    expect(haversineKm(0, 179, 0, -179)).toBeCloseTo(222.4, 0);
  });
});

describe('convertDistance', () => {
  it('returns kilometres unchanged', () => {
    expect(convertDistance(100, 'km')).toBe(100);
  });

  it('converts kilometres to miles', () => {
    expect(convertDistance(100, 'miles')).toBeCloseTo(62.14, 2);
  });

  it('converts kilometres to nautical miles', () => {
    expect(convertDistance(100, 'nm')).toBeCloseTo(54.0, 1);
  });

  it('throws an error for an unknown unit', () => {
    expect(() => convertDistance(100, 'furlongs')).toThrow('Unknown unit: furlongs');
  });
});

describe('isWithinRange', () => {
  it('returns true when the distance is below the maximum', () => {
    expect(isWithinRange(10, 25)).toBe(true);
  });

  it('returns false when the distance is above the maximum', () => {
    expect(isWithinRange(40, 25)).toBe(false);
  });

  it('returns true when the distance is exactly on the limit', () => {
    expect(isWithinRange(25, 25)).toBe(true);
  });
});