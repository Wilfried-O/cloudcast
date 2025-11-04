function iconUrl(icon) {
    return `https://openweathermap.org/img/wn/${icon}@2x.png`;
}

export default function ForecastList({ days, units = 'metric' }) {
    if (!days?.length) return null;

    const unitSymbol = units === 'imperial' ? '°F' : '°C';

    return (
        <div className="forecast">
            {days.map(d => (
                <div key={d.date} className="forecast-item">
                    <div className="forecast-day">{d.dayName}</div>
                    <img
                        className="forecast-icon"
                        src={iconUrl(d.icon)}
                        alt={d.description}
                        width={64}
                        height={64}
                    />
                    <div className="forecast-temps">
                        <span className="tmax">
                            {d.tempMax}
                            {unitSymbol}
                        </span>
                        <span className="tmin">
                            {d.tempMin}
                            {unitSymbol}
                        </span>
                    </div>
                    <div className="forecast-desc">{d.description}</div>
                </div>
            ))}
        </div>
    );
}
