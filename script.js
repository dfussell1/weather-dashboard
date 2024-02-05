const apiKey = '9aed6d7911ae6ff9006f7346bc3c6632';
const currentDay =  dayjs().format('DD/MM/YYYY');

document.getElementById('searchBtn').addEventListener('click', function() {
    const city = document.getElementById('searchCity').value
    getLatLong(city);
});

function getLatLong(city) {
    const LatLongURL = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`

    fetch(LatLongURL)
        .then(function(response) {
            return response.json();
        })
        .then(function(weatherData) {
            console.log(weatherData)
            displayCurrentWeather(city, weatherData);
            const latitude = weatherData.coord.lat;
            const longitude = weatherData.coord.lon;
            console.log(latitude, longitude)
            getWeatherForecast(city, latitude, longitude)
        });
}

function displayCurrentWeather(city, weatherData) {
    const currentWeatherEl = document.getElementById('currentWeather');
    
    currentWeatherEl.innerHTML = `
    <h2>Current Forecast: ${weatherData.name} on (${currentDay})</h2>
    <p id="currentTemp">Temperature: ${weatherData.main.temp}°F</p>
    <p id="currentHumidity">Humidity: ${weatherData.main.humidity}%</p>
    <p id="currentWindSpeed">Wind Speed: ${weatherData.wind.speed}MPH
    <p id="currentWeatherIcon"><img src="http://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png"</p>
    `;
}

function getWeatherForecast(city, latitude, longitude) {
    const weatherURL = `http://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=imperial`

    fetch(weatherURL)
        .then(function(response) {
            return response.json();
        })
        .then(function(forecastData) {
            // console.log(forecastData);

            const dailyData = [];

            forecastData.list.forEach(item => {
                const dateText = item.dt_txt;
                const date = new Date(dateText);
                const hour = date.getHours();

                if (hour === 12) {
                    dailyData.push(item);
                }
            });
            console.log(dailyData);
            displayWeatherForecast(dailyData);
        });
}

// function displayWeatherForecast(dailyData) {
//     const forecastWeatherEl = document.getElementById('fiveDayWeather');

//     forecastWeatherEl.innerHTML =
// }