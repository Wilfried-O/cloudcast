export function getThemeFromWeather(weatherData) {
    if (!weatherData?.weather?.[0]) return 'theme-default';

    const main = (weatherData.weather[0].main || '').toLowerCase();
    const icon = weatherData.weather[0].icon || ''; // e.g. "01d" or "01n"
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
