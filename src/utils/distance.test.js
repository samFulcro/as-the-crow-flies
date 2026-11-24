import { describe, it, expect } from 'vitest';
import { haversineKm } from './distance';

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