const apiKey = '9aed6d7911ae6ff9006f7346bc3c6632';

document.getElementById('searchBtn').addEventListener('click', function() {
    const city = document.getElementById('searchCity').value
    getLongLat(city);
});

function getLongLat(city) {
    const LongLatURL = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${apiKey}`

    fetch(LongLatURL)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            // console.log(data)
            const latitude = data[0].lat;
            const longitude = data[0].lon;
            console.log(latitude, longitude);
        })
}
