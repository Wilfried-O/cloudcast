export default function SearchBar({
    city,
    onCityChange,
    units,
    onUnitsChange,
    onSubmit,
    loading,
}) {
    function handleSubmit(e) {
        e.preventDefault();
        onSubmit?.();
    }

    return (
        <form
            onSubmit={handleSubmit}
            style={{ display: 'flex', gap: 8, marginBottom: 12 }}
        >
            <input
                className="field"
                value={city}
                onChange={e => onCityChange(e.target.value)}
                placeholder="Enter a city name"
                aria-label="City name"
            />

            <select
                className="select"
                value={units}
                onChange={e => onUnitsChange(e.target.value)}
                aria-label="Units"
            >
                <option value="metric">°C</option>
                <option value="imperial">°F</option>
            </select>

            <button
                className="btn"
                type="submit"
                disabled={!city.trim() || loading}
                aria-disabled={!city.trim() || loading}
            >
                {loading ? 'Loading…' : 'Search'}
            </button>
        </form>
    );
}
