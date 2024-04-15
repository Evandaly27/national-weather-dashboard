let history = [];

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('search-form');
    const cityInput = document.getElementById('city-input')
    const currentWeather = document.getElementById('current-weather');
    const forecastSection = document.getElementById('forecast');
    const searchHistory = document.getElementById('search-history');

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        const cityName = cityInput.value.trim();
        if (cityName === '') return;

        if (!history.includes(cityName)) {
            history.push(cityName);
            displaySearchHistory();
        }

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

            if (!currentRespone.ok || !forecastResponse.ok) {
                throw new Error('City not found');
            }

            const currentData = await currentRespone.json();
            const forecastData = await forecastResponse.json();

            displayCurrentWeather(currentData);
            displayForecast(forecastData);

        } catch (error) {
            console.error('Error fetching weather:', error.message);
            currentWeather.innerHTML = `<p>Error fetching weather data: ${error.message}</p>`
        }
    }

    function displayCurrentWeather(data) {
        const cityName = data.name;
        const temperature = Math.round(((data.main.temp - 273.15) * 9/5) + 32);
        const humidity = data.main.humidity;
        const windSpeed = data.wind.speed;
        const weatherIcon = data.weather[0].icon;

        const html = `
        <h2>${cityName}</h2>
        <img src="http://openweathermap.org/img/w/${weatherIcon}.png" alt="Weather icon">
        <p>Temperature: ${temperature}°F</p>
        <p>Humidity: ${humidity}%</p>
        <p>Wind Speed: ${windSpeed} m/s</p>`;

        currentWeather.innerHTML = html;
    }
    function displayForecast(data) {
        let html = '<h2>5-Day Forecast:</h2>';
        const dailyData = data.list.filter((reading, index) => index % 8 === 0);
        dailyData.forEach((day) => {
            const date = new Date(day.dt_txt).toLocaleDateString();
            const temp = Math.round(((day.main.temp - 273.15) *9/5) + 32);
            const icon = day. weather[0].icon;
            html += `
            <div>
            <h3>${date}</h3>
            <img src="http://openweathermap.org/img/w/${icon}.png" alt="Weather icon">
            <p>Temp: ${temp}°F</p>
        </div>
        `;
        });
        forecastSection.innerHTML = html
    }

    function displaySearchHistory() {
        searchHistory.innerHTML = '';
        history.forEach(city => {
            const cityDiv = document.createElement('div');
            cityDiv.textContent = city;
            cityDiv.classList.add('search-history-item');
            cityDiv.onclick = () => fetchWeather(city);
            searchHistory.appendChild(cityDiv);
        })
    }

    displaySearchHistory();
});