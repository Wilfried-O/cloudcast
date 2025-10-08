/** Returns the number if it's finite, otherwise null. */
export function numOrNull(value) {
    return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

/** Rounds a finite number, otherwise returns null. */
export function roundOrNull(value) {
    const n = numOrNull(value);
    return n === null ? null : Math.round(n);
}
/**
 * Safely rounds a number or returns a dash if invalid.
 * Example: roundOrDash(21.6) → 22
 */
export function roundOrDash(value) {
    return typeof value === 'number' && Number.isFinite(value)
        ? Math.round(value)
        : '—';
}

/**
 * Adds a suffix (like %, °C) unless the value is missing.
 * Example: formatValue(65, '%') → "65%"
 */
export function formatValue(value, suffix = '') {
    if (value === '—' || value == null || value === '') return '—';
    return `${value}${suffix}`;
}

/**
 * Converts wind degree (0–360) into a 16-point compass direction.
 * Example: degToCompass(270) → "W"
 */
export function degToCompass(deg) {
    if (typeof deg !== 'number') return '—';
    const dirs = [
        'N',
        'NNE',
        'NE',
        'ENE',
        'E',
        'ESE',
        'SE',
        'SSE',
        'S',
        'SSW',
        'SW',
        'WSW',
        'W',
        'WNW',
        'NW',
        'NNW',
    ];
    return dirs[Math.round(deg / 22.5) % 16];
}

/**
 * Converts OpenWeather timestamps into readable local time.
 * Example: prettyTime(1696820000, -14400) → "14:30"
 */
export function prettyTime(timestamp, timezoneOffset) {
    if (!timestamp || typeof timezoneOffset !== 'number') return '—';
    const local = new Date((timestamp + timezoneOffset) * 1000);
    const time = local.toUTCString().split(' ')[4]; // "HH:MM:SS"
    return time ? time.slice(0, 5) : '—';
}
