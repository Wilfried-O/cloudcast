import { useState } from 'react';
import { getCurrentByCity } from './services/openweather';
import CurrentWeatherCard from './components/CurrentWeatherCard';
import './App.css';

function pickThemeFromWeather(data) {
    if (!data?.weather?.[0]) return 'theme-default';

    const main = (data.weather[0].main || '').toLowerCase(); // e.g. "clear", "clouds", "rain"
    const icon = data.weather[0].icon || ''; // "01d" or "01n"
    const isNight = icon.endsWith('n');

    if (main.includes('thunder')) return 'theme-thunder';
    if (main.includes('drizzle')) return 'theme-drizzle';
    if (main.includes('rain')) return 'theme-rain';
    if (main.includes('snow')) return 'theme-snow';
    if (
        main.includes('mist') ||
        main.includes('fog') ||
        main.includes('haze') ||
        main.includes('smoke')
    )
        return 'theme-mist';
    if (main.includes('cloud'))
        return isNight ? 'theme-night-clouds' : 'theme-clouds';
    if (main.includes('clear'))
        return isNight ? 'theme-night-clear' : 'theme-clear';

    return isNight ? 'theme-night' : 'theme-default';
}

export default function App() {
    const [city, setCity] = useState('');
    const [data, setData] = useState(null);
    const [units, setUnits] = useState('metric'); // or "imperial"
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    async function fetchWeather() {
        setLoading(true);
        setError('');
        setData(null);
        try {
            const json = await getCurrentByCity(city, units);
            setData(json);
        } catch (e) {
            setError(e.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    }

    const theme = pickThemeFromWeather(data);

    return (
        <div className={`app ${theme}`}>
            <div className="container" style={{ fontFamily: 'system-ui' }}>
                <h1>CloudCast ☁️</h1>

                <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                    <input
                        className="field"
                        value={city}
                        onChange={e => setCity(e.target.value)}
                        placeholder="Enter a city name "
                    />
                    <select
                        className="select"
                        value={units}
                        onChange={e => setUnits(e.target.value)}
                    >
                        <option value="metric">°C</option>
                        <option value="imperial">°F</option>
                    </select>
                    <button className="btn" onClick={fetchWeather}>
                        {loading ? 'Loading…' : 'Fetch'}
                    </button>
                </div>

                {error && (
                    <div
                        style={{
                            background: '#ffe5e5',
                            color: '#b00020',
                            padding: 10,
                            borderRadius: 8,
                            marginBottom: 10,
                        }}
                    >
                        {error}
                    </div>
                )}

                {data && <CurrentWeatherCard data={data} units={units} />}

                {!loading && !data && !error && (
                    <p style={{ color: '#666' }}>
                        Enter a city and click <b>Fetch</b> to see the current
                        weather.
                    </p>
                )}
            </div>
        </div>
    );
}
