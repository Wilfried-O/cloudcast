const BASE = process.env.REACT_APP_OPENWEATHER_BASE;
const KEY = process.env.REACT_APP_OPENWEATHER_KEY;

const get = async path => {
    const url = `${BASE}${path}&appid=${KEY}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
};

export const getCurrentByCity = (q, units = 'metric') =>
    get(`/weather?q=${encodeURIComponent(q)}&units=${units}`);

export async function getForecastByCity(city, units = 'metric') {
    const url = `${BASE}/forecast?q=${encodeURIComponent(city)}&units=${units}&appid=${KEY}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch forecast');
    return res.json(); // returns { city, list: [...] }
}
