import styles from './CurrentWeatherCard.module.css';
import {
    numOrNull,
    roundOrNull,
    formatValue,
    degToCompass,
    prettyTime,
} from '../utils/format';

export default function CurrentWeatherCard({ data, units = 'metric' }) {
    if (!data) return null;

    // --- parsed (raw) values: numbers as number|null, labels as strings
    const city = data.name ?? '—';
    const country = data.sys?.country ?? '';
    const weather = data.weather?.[0];
    const icon = weather?.icon;
    const desc = weather?.description
        ? weather.description.charAt(0).toUpperCase() +
          weather.description.slice(1)
        : '—';

    const temp = roundOrNull(data.main?.temp);
    const feels = roundOrNull(data.main?.feels_like);
    const humidity = numOrNull(data.main?.humidity);
    const windSpeed = roundOrNull(data.wind?.speed);
    const windDeg = numOrNull(data.wind?.deg);
    const clouds = numOrNull(data.clouds?.all);

    const unitSymbol = units === 'imperial' ? '°F' : '°C';
    const windUnit = units === 'imperial' ? 'mph' : 'm/s';

    const localTime = prettyTime(data.dt, data.timezone); // "HH:MM" or '—'

    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <div className={styles.place}>
                    <h2 className={styles.title}>
                        {city}
                        {country ? (
                            <span className={styles.country}>, {country}</span>
                        ) : null}
                    </h2>
                    <div className={styles.subtle}>Local time: {localTime}</div>
                </div>

                {icon && (
                    <img
                        className={styles.icon}
                        src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
                        alt={weather?.main ?? 'Weather icon'}
                        width="80"
                        height="80"
                        loading="lazy"
                    />
                )}
            </div>

            <div className={styles.mainRow}>
                <div className={styles.temp}>
                    {formatValue(temp, unitSymbol)}
                    <div className={styles.desc}>{desc}</div>
                </div>

                <div className={styles.details}>
                    <Detail
                        label="Feels like"
                        value={formatValue(feels, unitSymbol)}
                    />
                    <Detail
                        label="Humidity"
                        value={formatValue(humidity, '%')}
                    />
                    <Detail
                        label="Wind"
                        value={
                            windSpeed === null
                                ? '—'
                                : `${windSpeed} ${windUnit} ${degToCompass(windDeg)}`
                        }
                    />
                    {clouds !== null && (
                        <Detail label="Clouds" value={`${clouds}%`} />
                    )}
                </div>
            </div>
        </div>
    );
}

function Detail({ label, value }) {
    return (
        <div className={styles.detail}>
            <div className={styles.detailLabel}>{label}</div>
            <div className={styles.detailValue}>{value}</div>
        </div>
    );
}
