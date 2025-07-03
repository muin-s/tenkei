let now = new Date();
let time = document.querySelector("time");
let date = now.getDate();
let year = now.getFullYear();
let hours = now.getHours();
let todayMinute = now.getMinutes();
if (todayMinute < 10) {
  todayMinute = `0${todayMinute}`;
}

let p = document.querySelector("p");

p.innerHTML = `${hours}:${todayMinute}`;

let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
let day = days[now.getDay()];

let months = [
  "January",
  "Feburary",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
let month = months[now.getMonth()];

weekday.innerHTML = `Today is ${day}, ${month} ${date}, ${year}`;

function showTemperature(response) {
  celsiusTemperature = response.data.main.temp;
  let temperature = Math.round(response.data.main.temp);
  let humidity = document.querySelector("#humidity");
  humidity.innerHTML = `Humidity: ${response.data.main.humidity}%`;
  let wind = document.querySelector("#wind");
  wind.innerHTML = `Wind Speed: ${Math.round(response.data.wind.speed)} km/hr`;
  let description = document.querySelector("#description");
  description.innerHTML = response.data.weather[0].description;
  let main = document.querySelector("main");
  main.innerHTML = temperature + "℃";
  let h1 = document.querySelector("h1");
  h1.innerHTML = response.data.name;
  let iconElement = document.querySelector("#icon");
  iconElement.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@4x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);

  getForecast(response.data.coord);
}

function searchCity(city) {
  let apiKey = "c6f8ef4575250284954db9f4dfa7a996";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showTemperature);
}

searchCity("Shibukawa");

function search(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#searchInput");
  let h1 = document.querySelector("h1");
  if (searchInput.value === "") {
    h1.innerHTML = "#searchInput";
  } else {
    h1.innerHTML = "Please enter your city!";
    searchCity(searchInput.value);

    searchInput.value = "";
  }
}

let form = document.querySelector("#search-form");
form.addEventListener("submit", search);

function searchLocation(position) {
  let apiKey = "c6f8ef4575250284954db9f4dfa7a996";
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showTemperature);
}

function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchLocation);
}

let currentLocationButton = document.querySelector("#current-location-button");
currentLocationButton.addEventListener("click", getCurrentLocation);

let celsiusTemperature = null;

function showFarenheitTemperature(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#actualDegree");
  let farenheitTemperature = (celsiusTemperature * 9) / 5 + 32;
  temperatureElement.innerHTML = Math.round(farenheitTemperature) + "°F";
}

let fahrenheit = document.querySelector("#fahrenheit");
fahrenheit.addEventListener("click", showFarenheitTemperature);

function showCelsiusTemperature(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#actualDegree");
  temperatureElement.innerHTML = Math.round(celsiusTemperature) + "°C";
}

let celsius = document.querySelector("#celsius");
celsius.addEventListener("click", showCelsiusTemperature);

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}

function displayForecast(response) {
  let forecast = response.data.daily;

  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class = "row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 5) {
      forecastHTML =
        forecastHTML +
        `
    <div class="col-2">
          <div class="card-1" style="width: 7rem">
            <ul class="list-group">
              <li class="list-group-item"><small class="day" id="day">${formatDay(
                forecastDay.dt
              )}</small></li>
              <li class="list-group-item"><img src="https://openweathermap.org/img/wn/${
                forecastDay.weather[0].icon
              }@2x.png" alt="" width="42" /></li>
              <li class="list-group-item"><small class="forecast-temp" id="forecast-temp"><span class="temp-max">${Math.round(
                forecastDay.temp.max
              )}°   </span><span class="temp-min">${Math.round(
          forecastDay.temp.min
        )}°</span> </small></li>
            </ul>
          </div>
        </div>
        `;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  let apiKey = "c6f8ef4575250284954db9f4dfa7a996";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&units=metric&appid=${apiKey}`;

  axios.get(apiUrl).then(displayForecast);
}
