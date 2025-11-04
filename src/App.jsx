import { useState } from 'react';
import { getCurrentByCity, getForecastByCity } from './services/openweather';
import CurrentWeatherCard from './components/CurrentWeatherCard';
import ForecastList from './components/ForecastList';
import { getThemeFromWeather } from './utils/theme';
import { buildDailyForecast } from './utils/forecast';
import SearchBar from './components/SearchBar';
import './App.css';

export default function App() {
    const [city, setCity] = useState('');
    const [data, setData] = useState(null);
    const [forecastDays, setForecastDays] = useState(null);
    const [units, setUnits] = useState('metric'); // or "imperial"
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    async function fetchWeather() {
        setLoading(true);
        setError('');
        setData(null);
        setForecastDays(null);

        try {
            const [currentJson, forecastJson] = await Promise.all([
                getCurrentByCity(city, units),
                getForecastByCity(city, units),
            ]);

            setData(currentJson);
            setForecastDays(buildDailyForecast(forecastJson));
        } catch (e) {
            setError(e.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    }

    const theme = getThemeFromWeather(data);

    return (
        <div className={`app ${theme}`}>
            <div className="container" style={{ fontFamily: 'system-ui' }}>
                <h1>CloudCast ☁️</h1>

                <SearchBar
                    city={city}
                    onCityChange={setCity}
                    units={units}
                    onUnitsChange={setUnits}
                    onSubmit={fetchWeather}
                    loading={loading}
                />

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

                {forecastDays && forecastDays.length > 0 && (
                    <>
                        <h2 style={{ marginTop: 16, marginBottom: 6 }}>
                            5-Days
                        </h2>
                        <ForecastList days={forecastDays} units={units} />
                    </>
                )}

                {!loading && !data && !error && (
                    <p style={{ color: '#666' }}>
                        Enter a city and click <b>Fetch</b> to see the current
                        weather and 5-day forecast.
                    </p>
                )}
            </div>
        </div>
    );
}
