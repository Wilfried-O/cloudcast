function toLocal(tsSec, tzOffsetSec) {
    return new Date((tsSec + tzOffsetSec) * 1000);
}

function dayKey(dateObj) {
    // YYYY-MM-DD
    const y = dateObj.getUTCFullYear();
    const m = String(dateObj.getUTCMonth() + 1).padStart(2, '0');
    const d = String(dateObj.getUTCDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

function shortDayName(dateObj) {
    return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][
        dateObj.getUTCDay()
    ];
}

/**
 * Build a compact 5-day forecast from OpenWeather /forecast response.
 * Returns:
 * [
 *   { date: '2025-10-09', dayName: 'Thu', icon: '04d', description: 'Clouds', tempMin: 9.1, tempMax: 15.3 },
 *   ...
 * ]
 */
export function buildDailyForecast(forecastJson) {
    if (!forecastJson?.list?.length || !forecastJson?.city) return [];

    const tz = forecastJson.city.timezone ?? 0; // seconds
    const buckets = new Map();

    for (const item of forecastJson.list) {
        const local = toLocal(item.dt, tz);
        const key = dayKey(local);
        if (!buckets.has(key)) buckets.set(key, []);
        buckets.get(key).push({ local, item });
    }

    // Choose around 12:00 local as the representative; compute min/max per day
    const result = [];
    const MIDDAY_HOUR = 12;

    [...buckets.entries()]
        .sort(([a], [b]) => (a < b ? -1 : 1))
        .forEach(([dateStr, entries]) => {
            // daily min/max
            let min = Infinity,
                max = -Infinity;
            for (const { item } of entries) {
                const t = item.main?.temp;
                if (typeof t === 'number') {
                    min = Math.min(min, item.main.temp_min ?? t);
                    max = Math.max(max, item.main.temp_max ?? t);
                }
            }

            // pick the slot closest to local noon
            let chosen = entries[0];
            let bestDiff = Infinity;
            for (const e of entries) {
                const diff = Math.abs(e.local.getUTCHours() - MIDDAY_HOUR);
                if (diff < bestDiff) {
                    bestDiff = diff;
                    chosen = e;
                }
            }

            const w = chosen.item.weather?.[0];
            const icon = w?.icon || '01d';
            const description = w?.main || '—';
            const dayName = shortDayName(toLocal(chosen.item.dt, tz));

            result.push({
                date: dateStr,
                dayName,
                icon,
                description,
                tempMin: Math.round(min),
                tempMax: Math.round(max),
            });
        });

    // usually returns up to 5–6; trim to 5 distinct days
    return result.slice(0, 5);
}
