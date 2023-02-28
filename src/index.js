const apiKey = "18ae5b950d1246b6d613eff00dad0eb7"; 
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?"; 

const searchInput = document.querySelector(".search_input"); 
const searchButton = document.querySelector(".search_btn"); 
const geoBtn = document.querySelector(".geo_btn"); 
const hint = document.querySelector(".hint"); 

const weatherDiv = document.querySelector(".weather"); 
const cityParagraph = weatherDiv.querySelector(".city"); 
const timeParagraph = weatherDiv.querySelector(".time"); 
const tempParagraph = weatherDiv.querySelector(".temp"); 
const iconImage = weatherDiv.querySelector(".icon"); 
const descriptionHeading = weatherDiv.querySelector(".description"); 
const humidityParagraph = weatherDiv.querySelector(".humidity"); 
const windParagraph = weatherDiv.querySelector(".wind"); 


// функция для отображения метеоданных на UI: получить объект с данными и отобразить в соответствующих элементах DOM текущую дату и время, метеоданные, а также удалить класс loading
const displayWeather = (data) => {
        timeParagraph.innerHTML = new Date().toLocaleString("en-GB", {weekday: "long", year: "2-digit", month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit"});

        const { name } = data;
        const { icon, description } = data.weather[0];
        const { temp, humidity } = data.main;
        const { speed, deg } = data.wind;

        cityParagraph.innerText = `${name}`;
        tempParagraph.innerText = `${temp.toFixed(1)}°C`;
        iconImage.src = `https://openweathermap.org/img/wn/${icon}.png`;
        descriptionHeading.innerText = description;        
        humidityParagraph.innerText = `Humidity: ${humidity}%`;
        windParagraph.innerText = `Wind speed: ${speed} km/h, direction: ${deg}°`;

        weatherDiv.classList.remove("loading");        
};


// функция для получения метеоданных по API по названию города
const fetchWeather = (city) => {
        if (!city) {
            hint.innerText = "Please, type Your city!";
            searchInput.focus();
            return;
        };

        fetch(`${apiUrl}q=${city}&appid=${apiKey}&units=metric`)
            .then((response) => response.json())
            .then((data) => displayWeather(data))
            .catch(() =>  hint.innerText = "Please, check Your input!");
};


// функция для получения метеоданных по API по местоположению пользователя; также очищает содержимое абзаца для подсказки/ошибки
const getCurrentPosition = () => {
    hint.innerText = "";

    if (!navigator.geolocation) {
        hint.innerText = "Sorry, Your browser doesn't support geolocation API!";
    } else {
        navigator.geolocation.getCurrentPosition(locationSuccess, locationError);
    };    
};


// колбэк для успешного определения местоположения пользователя: получить метеоданные по API
const locationSuccess = (position) => {
    const { latitude, longitude } = position.coords;
   
    fetch(`${apiUrl}lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`)
        .then((response) => response.json())
        .then((data) => displayWeather(data))            
        .catch(() => hint.innerText = "Sorry, it's impossible to define weather in Your location");
};


// колбэк для ошибки определения местоположения пользователя: в зависимости от ошибки вывести сообщение в абзац для подсказки/ошибки
const locationError = (err) => {
    err.code === 1 ? hint.innerText = "Please, give permission to define Your location!" : "Sorry, it's impossible to define Your location";    
};


// обработчик события загрузки страницы браузером: назначает событиям на элементах обработчики и выводит на странице погоду в Москве
document.addEventListener("DOMContentLoaded", () => {    
    searchButton.addEventListener("click", () => {
        fetchWeather(searchInput.value);
    });
    
    searchInput.addEventListener("keyup", (event) => {
        hint.innerText = "";
        if (event.key === "Enter") {
            fetchWeather(searchInput.value);
        };
    });
    
    geoBtn.addEventListener("click", () => {
        getCurrentPosition();
    });
    
    fetchWeather("Moscow");
});











