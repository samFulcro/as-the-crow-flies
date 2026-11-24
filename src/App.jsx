import { useState } from 'react';
import './App.css';
import { haversineKm, convertDistance, isWithinRange } from './utils/distance';
import { validateLatitude, validateLongitude, validateMaxDistance } from './utils/validation';

const UNITS = [
  { value: 'miles', label: 'Miles' },
  { value: 'km', label: 'Kilometers' },
  { value: 'nm', label: 'Nautical Miles' },
];

const UNIT_LABELS = { km: 'km', miles: 'miles', nm: 'nautical miles' };

const EMPTY_FORM = {
  unit: 'miles',
  latA: '',
  lonA: '',
  latB: '',
  lonB: '',
  maxDistance: '',
};

/**
 * Validates a field only once the user has typed something,
 * so empty fields don't show errors before they've been filled in.
 */
function getFieldState(input, validator) {
  if (String(input).trim() === '') return { value: null, error: null };
  const check = validator(input);
  return check.valid ? { value: check.value, error: null } : { value: null, error: check.error };
}

/** A centred label and input, with an error message underneath when invalid. */
function Field({ id, label, value, error, onChange }) {
  return (
    <div className="col-sm-6 text-center">
      <label htmlFor={id} className="ascf-label mb-1">{label}</label>
      <input
        id={id}
        name={id}
        type="text"
        inputMode="decimal"
        className={`form-control ascf-input ${error ? 'is-invalid' : ''}`}
        value={value}
        onChange={onChange}
      />
      {error && <div className="invalid-feedback ascf-error">{error}</div>}
    </div>
  );
}

function App() {
  // initialise form state with empty values
  const [form, setForm] = useState(EMPTY_FORM);

  // handle changes to form fields
  function handleChange(event) {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
  }

  // handle clearing the form
  function handleClear() {
    setForm(EMPTY_FORM);
  }

  // get the current state and validation of each field (runs on every render)
  const latA = getFieldState(form.latA, validateLatitude);
  const lonA = getFieldState(form.lonA, validateLongitude);
  const latB = getFieldState(form.latB, validateLatitude);
  const lonB = getFieldState(form.lonB, validateLongitude);
  const max = getFieldState(form.maxDistance, validateMaxDistance);

  // determine if all required points have valid values
  const allPointsValid = [latA, lonA, latB, lonB].every((field) => field.value !== null);

  // calculate the distance and check if it's within the max distance if all points are valid
  let result = null;
  if (allPointsValid && !max.error) {
    const km = haversineKm(latA.value, lonA.value, latB.value, lonB.value);
    const distance = convertDistance(km, form.unit);
    result = {
      distance,
      maxDistance: max.value,
      withinRange: max.value === null ? null : isWithinRange(distance, max.value),
    };
  }

  const unitLabel = UNIT_LABELS[form.unit];

  return (
    <main className="ascf-app">
      <div className="container" style={{ maxWidth: '640px' }}>
        <h1 className="ascf-title">As The Crow Flies</h1>

        <div className="ascf-units" role="radiogroup" aria-label="Unit">
          {UNITS.map((unit) => (
            <div className="form-check form-check-inline" key={unit.value}>
              <input
                className="form-check-input"
                type="radio"
                name="unit"
                id={`unit-${unit.value}`}
                value={unit.value}
                checked={form.unit === unit.value}
                onChange={handleChange}
              />
              <label className="form-check-label ascf-label" htmlFor={`unit-${unit.value}`}>
                {unit.label}
              </label>
            </div>
          ))}
        </div>

        <fieldset className="mb-4">
          <legend className="ascf-label ascf-legend">Point 1</legend>
          <div className="row g-4">
            <Field id="latA" label="Latitude" value={form.latA} error={latA.error} onChange={handleChange} />
            <Field id="lonA" label="Longitude" value={form.lonA} error={lonA.error} onChange={handleChange} />
          </div>
        </fieldset>

        <fieldset className="mb-4">
          <legend className="ascf-label ascf-legend">Point 2</legend>
          <div className="row g-4">
            <Field id="latB" label="Latitude" value={form.latB} error={latB.error} onChange={handleChange} />
            <Field id="lonB" label="Longitude" value={form.lonB} error={lonB.error} onChange={handleChange} />
          </div>
        </fieldset>

        <div className="row justify-content-center mb-4">
          <Field
            id="maxDistance"
            label={`Max Distance (optional)`}
            value={form.maxDistance}
            error={max.error}
            onChange={handleChange}
          />
        </div>

        <h2 className="ascf-label ascf-result-heading">Result</h2>
        <div className="ascf-result" role="status">
          {result ? (
            <>
              <div className="ascf-distance">
                {result.distance.toFixed(2)} {unitLabel}
              </div>
              {result.withinRange === true && <div className="ascf-status ascf-ok">✓ Within range</div>}
              {result.withinRange === false && (
                <div className="ascf-status ascf-bad">
                  ✗ Out of range by {(result.distance - result.maxDistance).toFixed(2)} {unitLabel}
                </div>
              )}
            </>
          ) : (
            <span className="ascf-placeholder">Enter both points</span>
          )}
        </div>

        <div className="text-center mt-4">
          <button type="button" className="btn ascf-clear" onClick={handleClear}>
            Clear
          </button>
        </div>
      </div>
    </main>
  );
}

export default App;