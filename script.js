const timeEl = document.getElementById('time');
const dateEl = document.getElementById('date');
const currentWeatherItemsEl = document.getElementById('current-weather-items');
const timezone = document.getElementById('time-zone');
const countryEl = document.getElementById('country');
const weatherForecastEl = document.getElementById('weather-forecast');
const currentTempEl = document.getElementById('current-temp');


const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const API_KEY ='49cc8c821cd2aff9af04c9f98c36eb74';

async function getCityWeather() {
    const cityName = document.getElementById('cityInput').value;
    if (!cityName) {
        alert('Please enter a city name.');
        return;
    }

    const apiUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data && data.length > 0) {
            const { lat, lon } = data[0];
            getWeatherData(lat, lon);
            
        } else {
            alert(`Could not find coordinates for ${cityName}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while fetching the data.');
    }
}
const lati=lat;
const longi=longi;


setInterval(() => {
    const time = new Date();
    const month = time.getMonth();
    const date = time.getDate();
    const day = time.getDay();
    const hour = time.getHours();
    const hoursIn12HrFormat = hour >= 13 ? hour %12: hour
    const minutes = time.getMinutes();
    const ampm = hour >=12 ? 'PM' : 'AM'

    timeEl.innerHTML = (hoursIn12HrFormat < 10? '0'+hoursIn12HrFormat : hoursIn12HrFormat) + ':' + (minutes < 10? '0'+minutes: minutes)+ ' ' + `<span id="am-pm">${ampm}</span>`

    dateEl.innerHTML = days[day] + ', ' + date+ ' ' + months[month]

}, 1000);

function handleWeatherRequest() {
    const cityName = document.getElementById('cityInput').value.trim();
    if (cityName) {
        getCityWeather(cityName);
    } else {
        getLocationWeather();
    }
}

async function getCityWeather(cityName) {
    const apiUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data && data.length > 0) {
            const { lat, lon } = data[0];
            getWeatherData(lat, lon);
        } else {
            alert(`Could not find coordinates for ${cityName}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while fetching the data.');
    }
}

function getLocationWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                getWeatherData(latitude, longitude);
            },
            (error) => {
                console.error("Error getting location:", error);
                alert("Unable to retrieve your location. Please enter a city name.");
            }
        );
    } else {
        alert("Geolocation is not supported by your browser. Please enter a city name.");
    }
}

getWeatherData()
function getWeatherData(latitude, longitude) {
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`)
        .then(res => res.json())
        .then(data => {
            console.log(data);
            localStorage.setItem('apiData', JSON.stringify(data));
            showWeatherData(data);
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            alert('Error fetching weather data');
        });
}


function showWeatherData (data){
    let {humidity, pressure, sunrise, sunset, wind_speed} = data.current;

    timezone.innerHTML = data.timezone;
    countryEl.innerHTML = data.lat + 'N ' + data.lon+'E'

    currentWeatherItemsEl.innerHTML = 
    `<div class="weather-item">
        <div>Humidity</div>
        <div>${humidity}%</div>
    </div>
    <div class="weather-item">
        <div>Pressure</div>
        <div>${pressure}</div>
    </div>
    <div class="weather-item">
        <div>Wind Speed</div>
        <div>${wind_speed}</div>
    </div>
    <div class="weather-item">
        <div>Sunrise</div>
        <div>${window.moment(sunrise * 1000).format('HH:mm a')}</div>
    </div>
    <div class="weather-item">
        <div>Sunset</div>
        <div>${window.moment(sunset*1000).format('HH:mm a')}</div>
    </div>
    
    
    `;

    let otherDayForcast = ''
    data.daily.forEach((day, idx) => {
        if(idx == 0){
            currentTempEl.innerHTML = `
            <img src="http://openweathermap.org/img/wn//${day.weather[0].icon}@4x.png" alt="weather icon" class="w-icon">
            <div class="other">
                <div class="day">${window.moment(day.dt*1000).format('dddd')}</div>
                <div class="temp">Night - ${day.temp.night}&#176;C</div>
                <div class="temp">Day - ${day.temp.day}&#176;C</div>
            </div>
            
            `
        }else{
            otherDayForcast += `
            <div class="weather-forecast-item">
                <div class="day">${window.moment(day.dt*1000).format('ddd')}</div>
                <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="w-icon">
                <div class="temp">Night - ${day.temp.night}&#176;C</div>
                <div class="temp">Day - ${day.temp.day}&#176;C</div>
            </div>
            
            `
        }
    })


    weatherForecastEl.innerHTML = otherDayForcast;
}
