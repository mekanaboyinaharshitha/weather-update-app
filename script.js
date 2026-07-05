const apiKey = "4faf4bc4b7a1c91ef5805fa7713990c8";


// =======================
// CLICK SOUND
// =======================
function playSound() {
    document.getElementById("clickSound").play();
}

// =======================
// LIVE CLOCK
// =======================
setInterval(() => {
    document.getElementById("clock").innerText =
        new Date().toLocaleString();
}, 1000);

// =======================
// SEARCH USING ENTER
// =======================
document.getElementById("cityInput").addEventListener("keypress", function (e) {

    if (e.key === "Enter") {
        getWeather();
    }

});

// =======================
// GET WEATHER
// =======================
async function getWeather(cityInput) {

    playSound();

    const loading = document.getElementById("loading");
    loading.style.display = "block";

    let cityName =
        cityInput ||
        document.getElementById("cityInput").value.trim();

    if (cityName === "") {

        loading.style.display = "none";

        alert("Please enter a city name.");

        return;

    }

    try {

        const url =
            `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;

        const res = await fetch(url);
        const data = await res.json();

        loading.style.display = "none";

        if (data.cod != 200) {

            alert("City not found!");

            return;

        }

        // Save last searched city
        localStorage.setItem("lastCity", data.name);

        document.getElementById("city").innerText =
            `${data.name}, ${data.sys.country}`;

        document.getElementById("temp").innerText =
            `${Math.round(data.main.temp)}°C`;

        document.getElementById("desc").innerText =
            data.weather[0].description;

        document.getElementById("humidity").innerText =
            `${data.main.humidity}%`;

        document.getElementById("wind").innerText =
            `${(data.wind.speed * 3.6).toFixed(1)} km/h`;

        document.getElementById("feels").innerText =
            `${Math.round(data.main.feels_like)}°C`;

        document.getElementById("pressure").innerText =
            `${data.main.pressure} hPa`;

        document.getElementById("visibility").innerText =
            `${(data.visibility / 1000).toFixed(1)} km`;

        document.getElementById("sunrise").innerText =
            new Date(data.sys.sunrise * 1000)
            .toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
            });

        document.getElementById("sunset").innerText =
            new Date(data.sys.sunset * 1000)
            .toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
            });

        // Country Flag
        document.getElementById("flag").src =
            `https://flagcdn.com/48x36/${data.sys.country.toLowerCase()}.png`;

        // Weather Icon
        document.getElementById("weatherIcon").src =
            `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

        // Card Animation
        const card = document.querySelector(".card");

        card.style.animation = "none";

        card.offsetHeight;

        card.style.animation = "fadeCard .6s ease";

        // Forecast
        loadForecast(cityName);

        // Clear Search Box
        document.getElementById("cityInput").value = "";

    }

    catch (error) {

        loading.style.display = "none";

        alert("Unable to fetch weather data.");

        console.log(error);

    }

}
// =======================
// DARK MODE
// =======================
function toggleMode() {

    document.body.classList.toggle("light");

    // Save theme
    if (document.body.classList.contains("light")) {
        localStorage.setItem("theme", "light");
    } else {
        localStorage.setItem("theme", "dark");
    }

}

// =======================
// MY LOCATION
// =======================
function getLocation() {

    if (!navigator.geolocation) {

        alert("Geolocation is not supported by your browser.");

        return;

    }

    navigator.geolocation.getCurrentPosition(

        async function (position) {

            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            try {

                const url =
                    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

                const res = await fetch(url);
                const data = await res.json();

                getWeather(data.name);

            }

            catch (error) {

                console.log(error);

                alert("Unable to fetch your location weather.");

            }

        },

        function () {

            alert("Location permission denied.");

        }

    );

}

// =======================
// 5 DAY FORECAST
// =======================
async function loadForecast(city) {

    try {

        const url =
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

        const res = await fetch(url);
        const data = await res.json();

        const box = document.getElementById("days");

        box.innerHTML = "";

        for (let i = 0; i < data.list.length; i += 8) {

            const d = data.list[i];

            const day =
                new Date(d.dt_txt)
                .toLocaleDateString("en-US", {
                    weekday: "short"
                });

            const icon =
                `https://openweathermap.org/img/wn/${d.weather[0].icon}@2x.png`;

            box.innerHTML += `

                <div class="day">

                    <h4>${day}</h4>

                    <img src="${icon}" alt="Weather">

                    <p><strong>${Math.round(d.main.temp)}°C</strong></p>

                    <p>${d.weather[0].main}</p>

                </div>

            `;

        }

    }

    catch (error) {

        console.log("Forecast Error:", error);

    }

}

// =======================
// AUTO LOAD
// =======================
// =======================
// AUTO LOAD
// =======================
window.onload = function () {

    // Focus on search box
    document.getElementById("cityInput").focus();

    // Restore saved theme
    if (localStorage.getItem("theme") === "light") {
        document.body.classList.add("light");
    }

    // Automatically show current location weather
    getLocation();

};

// =======================
// CLEAN INPUT
// =======================
document.getElementById("cityInput")
.addEventListener("change", function () {

    this.value = this.value.trim();

});