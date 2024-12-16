// varibles 
const inputSearch = document.querySelector('#inputSearch');
const findBtn = document.querySelector('#findBtn');
const cardGroup = document.querySelector('#cardGroup')
let allData = [];

displayApi()



async function getWeather(cityName) {
    // user location default 
    if (!cityName) {
        cityName = await getUserLocation();
    }

    try {
        const res = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=5466b9641d1542c0a1d143720241312&q=${cityName}&days=3`);
        const data = await res.json();
        return data;
    } catch (err) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong, please try again later",
        });
    }
}

async function getUserLocation() {
    try {
        const res = await fetch('https://apiip.net/api/check?accessKey=98097b00-5226-4eb7-92dd-7b1093cb0ac9');
        const data = await res.json();
        console.log(data.city);
        return data.city;

    } catch (err) {
        console.log("getUserLocation error", err);
    }
}



async function displayApi(city ='') {
    try {

        const userLocation = city|| await getUserLocation(); 
        console.log("User Location:", userLocation);

        const allData = await getWeather(userLocation); 
        console.log( allData);

        const { forecast, location, current } = allData;

        // Colors 
        let colrs = ['crd-1', 'crd-2', 'crd-1'];
        let headerColrs = ['head-crd-1', 'head-crd-2', 'head-crd-1'];

        // The name of the day  
        const currentDate = new Date(current.last_updated);
        const dayName = currentDate.toLocaleString('en-US', { weekday: 'long' });
        const formattedDate = currentDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });

        // Handle Current weather  
        let cartonna = `
            <div class="col-lg-4 col-md-6">
                <div class="card h-100 ${colrs[0]}">
                    <div class="card-header border-0 text-white ${headerColrs[0]} d-flex justify-content-between">
                        <span>${dayName}</span>
                        <span>${formattedDate}</span>
                    </div>
                    <div class="card-body">
                        <div class="d-flex flex-column align-items-center justify-content-center gap-4">
                            <span class="card-title text-white">${userLocation.charAt(0).toUpperCase() + userLocation.slice(1)}</span>
                            <h1 class="card-text currentTemp text-white">${current.temp_c}&deg;C</h1>
                        </div>
                        <div class="d-flex flex-column align-items-center justify-content-center">
                            <img src="https:${current.condition.icon}" alt="${current.condition.text}" class="condition-icon icon-img">
                            <span class="text-clr">${current.condition.text}</span>
                        </div>
                    </div>
                    <div class="card-footer border-0 d-flex justify-content-start my-4">
                        <div class="weather-icons me-3 d-flex justify-content-center align-items-center ms-3">
                            <img src="images/icon-umberella.png" alt="Umbrella Icon" />
                            <span class="secundry-colo ms-2">${current.humidity} %</span>
                        </div>
                        <div class="weather-icons me-3 d-flex justify-content-center align-items-center ms-3">
                            <img src="images/icon-wind.png" alt="Wind Icon" />
                            <span class="secundry-colo ms-2">${current.wind_mph} mph</span>
                        </div>
                        <div class="weather-icons me-3 d-flex justify-content-center align-items-center ms-3">
                            <img src="images/icon-compass.png" alt="Compass Icon" />
                            <span class="text-capitalize secundry-colo ms-2"> east</span>
                        </div>
                    </div>
                </div>

            </div>
        `;

        // Handle the other 2 days 
        for (let i = 1; i <= 2; i++) {
            const day = forecast.forecastday[i];
            const forecastDate = new Date(day.date);
            const forecastDayName = forecastDate.toLocaleString('en-US', { weekday: 'long' });

            cartonna += `
            <div class="col-lg-4 col-md-6">
                    <div class="card h-100  ${colrs[i]} ">
                        <div class="card-header border-0 ${headerColrs[i]} d-flex align-items-center justify-content-center">
                            <span class="text-center text-white">${forecastDayName}</span>
                        </div>
                        <div class="card-body">
                            <div class="d-flex flex-column align-items-center justify-content-center gap-3">
                                <img src="https:${day.day.condition.icon}" alt="${day.day.condition.text}" class="condition-icon icon-img">
                                <h2 class="card-text text-white fw-bold">${day.day.maxtemp_c}&deg;C</h2>
                                <span class="card-text secundry-colo">${day.day.mintemp_c}&deg;C</span>
                                <span class="card-title text-clr">${day.day.condition.text}</span>
                            </div>
                        </div>

                    </div>

            </div>
            `;
        }

        if (cardGroup) {
            cardGroup.innerHTML = cartonna;
        } else {
            console.log('Card group not found in the DOM');
        }
    } catch (err) {
        console.log(" displayApi: Error", err);


    }
}
async function fetchinputsearch(query) {
    try {
        const res = await fetch(`https://api.weatherapi.com/v1/search.json?key=5466b9641d1542c0a1d143720241312&q=${query}`);
        const data = await res.json();
        return data; 
    } catch (err) {
        console.error("Error from fetchinputsearch", err);
        return [];
    }
}

inputSearch.addEventListener('input', async function() {
    const inputValue = inputSearch.value.trim();
    if (inputValue.length >= 3) {
        const inputsearch = await fetchinputsearch(inputValue);

        if (inputsearch.length > 0) {
            const firstSuggestedCity = inputsearch[0].name;
            console.log(`Auto-selected city: ${firstSuggestedCity}`);

            displayApi(firstSuggestedCity);
        } else {
            console.log("We cant fond the city ");
        }
    }
});



findBtn.addEventListener('click',  function () {
    const city = inputSearch.value.trim();
        displayApi(city)

});