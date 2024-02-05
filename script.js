const apiKey = '9aed6d7911ae6ff9006f7346bc3c6632';
const currentDay =  dayjs().format('MM/DD/YYYY');

document.getElementById('searchBtn').addEventListener('click', function() {
    const city = document.getElementById('searchCity').value
    getLatLong(city);
    addToHistory(city);
});

function getLatLong(city) {
    const LatLongURL = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`

    fetch(LatLongURL)
        .then(function(response) {  
            return response.json();
        })
        .then(function(weatherData) {
            console.log(weatherData)
            const latitude = weatherData.coord.lat;
            const longitude = weatherData.coord.lon;
            console.log(latitude, longitude)
            displayCurrentWeather(city, weatherData);
            getWeatherForecast(city, latitude, longitude)
        });
}

function displayCurrentWeather(city, weatherData) {
    const currentWeatherEl = document.getElementById('currentWeather');
    
    currentWeatherEl.innerHTML = `
    
    <h2>Current Forecast: ${weatherData.name} on (${currentDay})</h2>
        <div id="currentWeatherCard>
            <p id="currentTemp">Temperature: ${weatherData.main.temp}°F</p>
            <p id="currentHumidity">Humidity: ${weatherData.main.humidity}%</p>
            <p id="currentWindSpeed">Wind Speed: ${weatherData.wind.speed}MPH
            <p id="currentWeatherIcon"><img src="http://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png"</p>
        <div/>
    `;
}

function getWeatherForecast(city, latitude, longitude) {
    const weatherURL = `http://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=imperial`

    fetch(weatherURL)
        .then(function(response) {
            return response.json();
        })
        .then(function(forecastData) {
            console.log(forecastData);

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

function displayWeatherForecast(dailyData) {
    const forecastWeatherEl = document.getElementById('fiveDayWeather');

    forecastWeatherEl.innerHTML =  `

        <h2>5-Day Forecast:</h2>
    `;

    for(let i = 0; i < 5; i++) {
        forecastWeatherEl.innerHTML += `
        <div>
            <div class="forecastWeatherCard id="card${i}">
                <p id="date${i}">${dayjs().add(i + 1, 'day').format('MM/DD/YYYY')}</p>
                <card/>
                <p id="temp${i}">Temperature: ${dailyData[i].main.temp}°F</p>
                <p id="humidity${i}">Humidity: ${dailyData[i].main.humidity}%</p>
                <p id="windSpeed${i}">Wind Speed: ${dailyData[i].wind.speed}MPH</p>
                <p id="icon${i}"><img src="http://openweathermap.org/img/wn/${dailyData[i].weather[0].icon}.png"</p>
            <div/>
        <div/>
        `
    };
}

function addToHistory(city) {
    let savedCities = JSON.parse(localStorage.getItem('savedCities')) || []; 
    
    if(!savedCities.includes(city)) {
        savedCities.push(city);
        localStorage.setItem('savedCities', JSON.stringify(savedCities));
    }

    const searchedCityEl = document.createElement('button');
    searchedCityEl.textContent = city;

    searchedCityEl.addEventListener('click', function() {
        getLatLong(city);
    });
    const searchHistoryEl = document.getElementById('searchHistory');
    searchHistoryEl.appendChild(searchedCityEl);
}

function displaySearchHistory() {
    const savedCities = JSON.parse(localStorage.getItem('savedCities')) || [];
    savedCities.forEach(city => {
        addToHistory(city);
    });
}

document.getElementById('clearHistoryBtn').addEventListener("click", function() {
    localStorage.removeItem('savedCities');
    const searchHistoryEl = document.getElementById('searchHistory'); 
    searchHistoryEl.innerHTML = '';
})

displaySearchHistory();