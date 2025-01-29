let valueSearch = document.getElementById("valueSearch");
let city = document.getElementById("city");
let temperature = document.getElementById("temperature");
let description = document.querySelector(".description");
let clouds = document.getElementById("clouds");
let humidity = document.getElementById("humidity");
let pressure = document.getElementById("pressure");

let main = document.querySelector(".container");

let form = document.querySelector("form");
form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (valueSearch.value != "") {
    searchWeather();
  }
});

let id = "de4c930185ccc274f4c9d9cd50254e0c";
let url =
  "https://api.openweathermap.org/data/2.5/weather?units=metric&appid=" + id;

const searchWeather = () => {
  fetch(url + "&q=" + valueSearch.value)
    .then((responsive) => responsive.json())
    .then((data) => {
      if (data.cod == 200) {
        updateWeatherUI(data);
      } else {
        main.classList.add("error");
        setTimeout(() => {
          main.classList.remove("error");
        }, 1000);
      }
      valueSearch.value = "";
    });
};

const fetchUserLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        // Fetch weather data using the coordinates
        getWeatherByCoordinates(latitude, longitude);
      },
      (error) => {
        console.error("Geolocation Error: ", error);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            alert("Permission denied. Please allow location access.");
            break;
          case error.POSITION_UNAVAILABLE:
            alert(
              "Position unavailable. Ensure your device's location is turned on."
            );
            break;
          case error.TIMEOUT:
            alert("Request timed out. Try refreshing the page.");
            break;
          default:
            alert("An unknown error occurred.");
        }
      }
    );
  } else {
    alert("Geolocation is not supported by your browser.");
  }
};

const getWeatherByCoordinates = (lat, lon) => {
  fetch(`${url}&lat=${lat}&lon=${lon}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.cod == 200) {
        updateWeatherUI(data);
      } else {
        main.classList.add("error");
        setTimeout(() => {
          main.classList.remove("error");
        }, 1000);
      }
    })
    .catch((error) => {
      alert("Failed to fetch weather data.");
      console.error(error);
    });
};

const updateWeatherUI = (data) => {
  city.querySelector("figcaption").innerText = data.name;
  city.querySelector("img").src =
    "https://flagsapi.com/" + data.sys.country + "/shiny/32.png";

  temperature.querySelector("img").src =
    "http://openweathermap.org/img/wn/" + data.weather[0].icon + "@4x.png";

  temperature.querySelector("figcaption span").innerText = data.main.temp;

  description.innerText = data.weather[0].description;
  clouds.innerText = data.clouds.all;
  humidity.innerText = data.main.humidity;
  pressure.innerText = data.main.pressure;
};

const initApp = () => {
  valueSearch.value = "bengaluru";
  searchWeather();
};
initApp();

let locationIcon = document.getElementById("my-location");
locationIcon.addEventListener("click", fetchUserLocation);

// Toggle degree value

let isCelsius = true; // Track the current unit (default is Celsius)

const toggleTemperatureUnit = () => {
  const tempElement = temperature.querySelector("figcaption span");
  const unitElement = temperature.querySelector("figcaption sup");
  const currentTemp = parseFloat(tempElement.innerText);

  if (isCelsius) {
    // Convert to Fahrenheit
    const fahrenheit = (currentTemp * 9) / 5 + 32;
    tempElement.innerText = fahrenheit.toFixed(2); // Update temperature value
    unitElement.innerHTML = " &#176;F"; // Change unit to °F
  } else {
    // Convert to Celsius
    const celsius = ((currentTemp - 32) * 5) / 9;
    tempElement.innerText = celsius.toFixed(2); // Update temperature value
    unitElement.innerHTML = " &#176;C"; // Change unit to °C
  }

  isCelsius = !isCelsius; // Toggle the state
};
document
  .getElementById("unit-toggle")
  .addEventListener("click", toggleTemperatureUnit);
