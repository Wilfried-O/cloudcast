import { useState } from 'react';
import { getCurrentByCity } from './services/openweather';
import './App.css';

export default function App() {
    const [city, setCity] = useState('Toronto');
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

    return (
        <div
            style={{
                maxWidth: 700,
                margin: '40px auto',
                padding: 16,
                fontFamily: 'system-ui',
            }}
        >
            <h1>CloudCast – Fetch Test</h1>

            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                <input
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    placeholder="Enter city"
                    style={{
                        flex: 1,
                        padding: '10px 12px',
                        borderRadius: 8,
                        border: '1px solid #ddd',
                    }}
                />
                <select
                    value={units}
                    onChange={e => setUnits(e.target.value)}
                    style={{ padding: '10px 12px', borderRadius: 8 }}
                >
                    <option value="metric">°C</option>
                    <option value="imperial">°F</option>
                </select>
                <button
                    onClick={fetchWeather}
                    style={{ padding: '10px 16px', borderRadius: 8 }}
                >
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
                    }}
                >
                    {error}
                </div>
            )}

            {data && (
                <pre
                    style={{
                        background: '#f7f7f7',
                        padding: 12,
                        borderRadius: 8,
                        overflowX: 'auto',
                        lineHeight: 1.3,
                    }}
                >
                    {JSON.stringify(data, null, 4)}
                </pre>
            )}

            {!loading && !data && !error && (
                <p style={{ color: '#666' }}>
                    Enter a city and click <b>Fetch</b> to test the API.
                </p>
            )}
        </div>
    );
}
