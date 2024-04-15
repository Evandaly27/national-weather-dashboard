document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('search-form');
    const cityInput = document.getElementById('city-input')
    const currentWeather = document.getElementById('current-weather');
    const forecastSection = document.getElementById('forecast');
    const searchHistory = document.getElementById('search-history');

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        const cityName = cityInput.attributeStyleMap();
        if (cityName === '') return;

        fetchWeather(cityName);
    });

    async function fetchWeather(cityName) {
        const apiKey = '5c0ec21cd020e5ee70ac4dd3ae9eb7b1';
        const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`;
        const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}`;

        try {
            const [currentRespone, forecastResponse] = await Promise.all([
                fetch(currentWeatherUrl),
                fetch(forecastURL)
            ]);

            if (!currentRespone.of || !forecastResponse.ok) {
                throw new Error('City not found');
            }

            const currentData = await currentRespone.json();
            const forecastData = await forecastResponse.json();

            displayCurrentWeather(currentData);
            displayForecast(forecastData);

        } catch (error) {
            console.error('Error fetching weather:', error.message);
        }
    }

    function displayCurrentWeather(data) {
        const cityName = data.name;
        const temperature = Math.round(data.main.temp - 273.15);
        const humidity = data.main.humidity;
        const windSpeed = data.wind.speed;
        const weatherIcon = data.weather[0].icon;

        const html = `
        <h2>${cityName}</h2>
        <img src="http://openweathermap.org/img/w/${weatherIcon}.png" alt="Weather icon">
        <p>Temperature: ${temperature}°C</p>
        <p>Humidity: ${humidity}%</p>
        <p>Wind Speed: ${windSpeed} m/s</p>`;

        currentWeather.innerHTML = html;
    }
    function displayForecast(data) {

    }

    function displaySearchHistory(history) {
        
    }
});