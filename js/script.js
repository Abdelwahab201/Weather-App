const searchInput = document.querySelector('#searchInput');
let weatherData = null;

searchInput.addEventListener('input', () => {
  const query = searchInput.value.trim();
  if (query.length > 2) {
    startApp(query);
  }
});

async function startApp(query) {
  try {
    weatherData = await fetchWeatherData(query);
    displayTodayWeather();
    displayWeather(1, 'tomorrow');
    displayWeather(2, 'aftertomorrow');
    console.log(weatherData);
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
}

async function fetchWeatherData(query) {
  const API_KEY = '9b1a984a176f4782b2e92741250505';
  const url = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${query}&days=3`;

  const response = await fetch(url);
  if (!response.ok) throw new Error("Network response was not ok");

  const data = await response.json();
  return data;
}
function displayTodayWeather() {
  const { location, current } = weatherData;
  const date = new Date(location.localtime);
  document.querySelector('.today .day').textContent = date.toLocaleDateString('en-US', { weekday: 'long' });
  document.querySelector('.today .date').textContent = date.getDate();
  document.querySelector('.today .month').textContent = date.toLocaleDateString('en-US', { month: 'short' });
  document.querySelector('.today #city-name').textContent = location.name;
  document.querySelector('.today .temp-main').textContent = `${current.temp_c}℃`;
  document.querySelector('.today .status').textContent = current.condition.text;
  document.querySelector('.today .weather-icon').src = `https:${current.condition.icon}`;
  document.querySelector('.today .humidity').textContent = `${current.humidity}%`;
  document.querySelector('.today .wind').textContent = `${current.wind_mph}km/h`;
  document.querySelector('.today .wind-dir').textContent = current.wind_dir;
}

function displayWeather(dayIndex, dayClassPrefix) {
    const forecast = weatherData.forecast.forecastday[dayIndex];
    const date = new Date(forecast.date);
    document.querySelector(`.${dayClassPrefix} .${dayClassPrefix}-day`).textContent = date.toLocaleDateString('en-US', { weekday: 'long' });
    document.querySelector(`.${dayClassPrefix} .weather-icon2`).src = `https:${forecast.day.condition.icon}`;
    document.querySelector(`.${dayClassPrefix} .status2`).textContent = forecast.day.condition.text;
    document.querySelector(`.${dayClassPrefix} .max-t`).textContent = `${forecast.day.maxtemp_c}℃`;
    document.querySelector(`.${dayClassPrefix} .min-t`).textContent = `${forecast.day.mintemp_c}℃`;
  }
// Geolocation
navigator.geolocation.getCurrentPosition(
  (position) => {
    const coords = `${position.coords.latitude},${position.coords.longitude}`;
    startApp(coords);
  },
  (error) => console.error("Geolocation error:", error)
);
