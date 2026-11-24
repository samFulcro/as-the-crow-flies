import { describe, it, expect } from 'vitest';
import { validateLatitude, validateLongitude } from './validation';

describe('validateLatitude', () => {
  it('accepts a valid latitude', () => {
    expect(validateLatitude('51.5074')).toEqual({ valid: true, value: 51.5074 });
  });

  it('accepts the boundary values -90 and 90', () => {
    expect(validateLatitude('-90').valid).toBe(true);
    expect(validateLatitude('90').valid).toBe(true);
  });

  it('rejects a latitude above 90', () => {
    expect(validateLatitude('95')).toEqual({
      valid: false,
      error: 'Latitude must be between -90 and 90.',
    });
  });

  it('rejects non-numeric input', () => {
    expect(validateLatitude('abc')).toEqual({ valid: false, error: 'Please enter a number.' });
  });

  it('rejects blank input', () => {
    expect(validateLatitude('')).toEqual({ valid: false, error: 'Please enter a value.' });
    expect(validateLatitude('   ')).toEqual({ valid: false, error: 'Please enter a value.' });
  });
});

describe('validateLongitude', () => {
  it('accepts a valid longitude', () => {
    expect(validateLongitude('-0.1278')).toEqual({ valid: true, value: -0.1278 });
  });

  it('rejects a longitude below -180', () => {
    expect(validateLongitude('-181')).toEqual({
      valid: false,
      error: 'Longitude must be between -180 and 180.',
    });
  });
});