// API Key for OpenWeatherAPI
const apiKey = '9aed6d7911ae6ff9006f7346bc3c6632';
const currentDay =  dayjs().format('MM/DD/YYYY');

// add event listener to search button to begin search for city
document.getElementById('searchBtn').addEventListener('click', function() {
    // gets the value the user puts in search
    const city = document.getElementById('searchCity').value
    // calls function to begin data fetch and add search to history
    getLatLong(city);
    addToHistory(city);
});

// function to grab latitude and longitude from user's city input 
function getLatLong(city) {
    // API URL to get basic weather and geo data from searched city
    const LatLongURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`

    // fetch data and return in JSON
    fetch(LatLongURL)
        .then(function(response) {  
            return response.json();
        })
        // stores data in variable and passes that data to displayCurrentWeather() and getWeatherForecast() functions
        .then(function(weatherData) {
            console.log(weatherData)
            // grabs the latitude and longitude and stores them in variables
            const latitude = weatherData.coord.lat;
            const longitude = weatherData.coord.lon;
            console.log(latitude, longitude)
            // calls functions to display current weather and get data for future forecast with passed in data
            displayCurrentWeather(city, weatherData);
            getWeatherForecast(city, latitude, longitude)
        });
}

// function to display current weather
function displayCurrentWeather(city, weatherData) {
    const currentWeatherEl = document.getElementById('currentWeather');
    
    currentWeatherEl.innerHTML = `
    
    // creates div
    <h2>Current Forecast: ${weatherData.name} on (${currentDay})</h2>
        <div id="currentWeatherCard>
            <p id="currentTemp">Temperature: ${weatherData.main.temp}°F</p>
            <p id="currentHumidity">Humidity: ${weatherData.main.humidity}%</p>
            <p id="currentWindSpeed">Wind Speed: ${weatherData.wind.speed}MPH
            <p id="currentWeatherIcon"><img src="https://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png"</p>
        <div/>
    `;
}

// function to retrieve future forecast data from user's search input
function getWeatherForecast(city, latitude, longitude) {
    // different API URL to grab forecast data
    const weatherURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=imperial`

    // fetch data and return in JSON
    fetch(weatherURL)
        .then(function(response) {
            return response.json();
        })
        // stores data in variable
        .then(function(forecastData) {
            console.log(forecastData);

            const dailyData = [];
            // grabs the dt_txt object from each array
            forecastData.list.forEach(item => {
                const dateText = item.dt_txt;
                const date = new Date(dateText);
                const hour = date.getHours();
                // creates a new array with data that only has a dt_txt value of 12:00:00
                if (hour === 12) {
                    dailyData.push(item);
                }
            });
            // calls displayWeatherForecast function with data passed in from new array
            console.log(dailyData);
            displayWeatherForecast(dailyData);
        });
}

// function to display future weather forecast
function displayWeatherForecast(dailyData) {
    const forecastWeatherEl = document.getElementById('fiveDayWeather');

    forecastWeatherEl.innerHTML =  `

        <h2>5-Day Forecast:</h2>
    `;
    // for each object in the array, creates a div displaying forecast data
    for(let i = 0; i < 5; i++) {
        forecastWeatherEl.innerHTML += `
        <div>
            <div class="forecastWeatherCard id="card${i}">
                <p id="date${i}">${dayjs().add(i + 1, 'day').format('MM/DD/YYYY')}</p>
                <card/>
                <p id="temp${i}">Temperature: ${dailyData[i].main.temp}°F</p>
                <p id="humidity${i}">Humidity: ${dailyData[i].main.humidity}%</p>
                <p id="windSpeed${i}">Wind Speed: ${dailyData[i].wind.speed}MPH</p>
                <p id="icon${i}"><img src="https://openweathermap.org/img/wn/${dailyData[i].weather[0].icon}.png"</p>
            <div/>
        <div/>
        `
    };
}

// function to add user's search input to localStorage
function addToHistory(city) {
    // empty array to store saved cities
    let savedCities = JSON.parse(localStorage.getItem('savedCities')) || []; 
    
    // if the array does not include the searched city, adds that city to the array in localStorage
    if(!savedCities.includes(city)) {
        savedCities.push(city);
        localStorage.setItem('savedCities', JSON.stringify(savedCities));
    }

    // creates a button for each saved city in the search history
    const searchedCityEl = document.createElement('button');
    searchedCityEl.textContent = city;

    // adds event listener to each button that is created for the search history to initiate search once again when clicked
    searchedCityEl.addEventListener('click', function() {
        getLatLong(city);
    });
    // add the searched city to the search history
    const searchHistoryEl = document.getElementById('searchHistory');
    searchHistoryEl.appendChild(searchedCityEl);
}

// display the search history
function displaySearchHistory() {
    const savedCities = JSON.parse(localStorage.getItem('savedCities')) || [];
    savedCities.forEach(city => {
        addToHistory(city);
    });
}

// adds event listener to clearHistoryBtn to clear anything in localStorage and in the Search History container
document.getElementById('clearHistoryBtn').addEventListener("click", function() {
    localStorage.removeItem('savedCities');
    const searchHistoryEl = document.getElementById('searchHistory'); 
    searchHistoryEl.innerHTML = '';
})

// call function to display search history
displaySearchHistory();