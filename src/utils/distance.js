const EARTH_RADIUS_KM = 6371;
const CONVERSION_FACTORS = {
  km: 1,
  miles: 0.621371,
  nm: 0.539957,
};

/**
 * Converts an angle from degrees to radians.
 * @param {number} degrees
 * @returns {number}
 */
function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

/**
 * Calculates the great-circle distance between two points on Earth
 * using the Haversine formula.
 * @param {number} lat1 - Latitude of point A in decimal degrees
 * @param {number} lon1 - Longitude of point A in decimal degrees
 * @param {number} lat2 - Latitude of point B in decimal degrees
 * @param {number} lon2 - Longitude of point B in decimal degrees
 * @returns {number} Distance in kilometres
 */
export function haversineKm(lat1, lon1, lat2, lon2) {
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return EARTH_RADIUS_KM * c;
}

/**
 * Converts a distance in kilometres to the chosen unit.
 * @param {number} km - Distance in kilometres
 * @param {'km' | 'miles' | 'nm'} unit - Unit to convert to
 * @returns {number} Distance in the chosen unit
 */
export function convertDistance(km, unit) {
  const factor = CONVERSION_FACTORS[unit];

  if (factor === undefined) {
    throw new Error(`Unknown unit: ${unit}`);
  }

  return km * factor;
}

/**
 * Checks whether a distance is within the maximum allowed distance.
 * Both values must be in the same unit.
 * @param {number} distance
 * @param {number} maxDistance
 * @returns {boolean}
 */
export function isWithinRange(distance, maxDistance) {
  return distance <= maxDistance;
}