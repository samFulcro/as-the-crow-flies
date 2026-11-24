/**
 * Validates a coordinate entered as text.
 * @param {string} input - Raw value from the form field
 * @param {string} label - Name used in the error message, e.g. "Latitude"
 * @param {number} min - Lowest allowed value
 * @param {number} max - Highest allowed value
 * @returns {{ valid: true, value: number } | { valid: false, error: string }}
 */
function validateCoordinate(input, label, min, max) {
  const trimmed = String(input).trim();

  if (trimmed === '') {
    return { valid: false, error: 'Please enter a value.' };
  }

  const value = Number(trimmed);

  if (Number.isNaN(value)) {
    return { valid: false, error: 'Please enter a number.' };
  }

  if (value < min || value > max) {
    return { valid: false, error: `${label} must be between ${min} and ${max}.` };
  }

  return { valid: true, value };
}

export function validateLatitude(input) {
  return validateCoordinate(input, 'Latitude', -90, 90);
}

export function validateLongitude(input) {
  return validateCoordinate(input, 'Longitude', -180, 180);
}