


let userTab = document.querySelector('[data-userWeather]');

let searchTab = document.querySelector('[data-searchWeather]');

var searchForm = document.querySelector('[data-searchForm]');


var userInfoContainer = document.querySelector('.user-info-container');

var grantAccessContainer = document.querySelector('.grant-location-container');

var loadingScreen = document.querySelector('.loading-container');

var userContainer = document.querySelector('.weather-container');

const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";


let oldTab = userTab;
oldTab.classList.add('current-tab');

getfromSessionStorage();

userTab.addEventListener('click',function() {
        switchTab(userTab);
});

searchTab.addEventListener('click',function() {
    switchTab(searchTab);
});

function switchTab(newTab){
      if(newTab != oldTab){
          oldTab.classList.remove('current-tab');
          oldTab = newTab;
          oldTab.classList.add('current-tab');  
          
          // classList.conatins method ha jo dekhagi ki 
          // searchForm abi active ha ya nhi
          if(!searchForm.classList.contains("active")){
                // if active nhi ha mtlb abi user-info val page active ha
                
                userInfoContainer.classList.remove('active');
                // location vali img vala container
                grantAccessContainer.classList.remove('active');
                searchForm.classList.add('active');
          }
            else{
                searchForm.classList.remove('active');
                userInfoContainer.classList.remove('active');

                //ab main your weather tab me agya hu ,toh weather bi display karna padega
                // so first chek local storage first for coordinate ,if we haved saved theme there
                getfromSessionStorage();
            }
      }
}


// check weather function present in session storage or not
function getfromSessionStorage(){

        const localCoordinate = sessionStorage.getItem("user-coordinate");

          if(!localCoordinate){
              // agar local coordinate nhi mila then
              grantAccessContainer.classList.add("active");
          }
          else{
              // agar local coordinate mil gya to
              
              const coordinate = JSON.parse(localCoordinate);

              fetchUserWeatherInfo(coordinate);
          }

}

function getlocation(){
    // if geolocation ka support available ha then

    if( navigator.geolocation){
       navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
       //show alert if no location access
    }
}

function showPosition(position){
     const  userCoordinate = {
          lat:position.coords.latitude,
          lon:position.coords.longitude,
     }
     sessionStorage.setItem("User-Coordinate", JSON.stringify(userCoordinate));
     fetchUserWeatherInfo(userCoordinate);
}



async function fetchUserWeatherInfo(coordinate) {
        const {lat,lon} = coordinate;

        // api call maro ga to apko loader dekhan padega
        //or apko granat container invisible karvana padega

        //location vali img vala container
        grantAccessContainer.classList.remove("active");

        // make loader vissible jab tak API NHI MILJATI
        // If API MILGYI then remove karna hoga loading screen ko
        loadingScreen.classList.add("active");

        // API CALL
        try{
            const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`);

            const data = await res.json();

            // loading screen vali ko remove karo data milgya ha
            loadingScreen.classList.remove("active");

            // user-info-vali ko active karvao
            userInfoContainer.classList.add("active");

            // ab jo data aya ha mera pass usa muja 
            // screen pa bi to dekhan ha to render val fun banaya

             renderWeatherInfo(data);

        }catch(e){
        console.log("Error is occure due to not properley fetching data");
        }
}

function renderWeatherInfo(weatherInfo) {
      
    // first we have to fetch the element 
    const cityName = document.querySelector('[data-cityName]');
    const countryIcon = document.querySelector('[data-countryIcon]');
    const weatherDesc = document.querySelector('[data-weatherDesc]');
    const weatherIcon = document.querySelector('[data-weatherIcon]');
    const temp = document.querySelector('[data-temp]');
    const windspeed = document.querySelector('[data-windspeed]');
    const humidity = document.querySelector('[data-humidity]');
    const cloud = document.querySelector('[ data-cloud]');

     console.log(weatherInfo);

     //fetch value from weatherInfo object and put in UI elemnet

    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    weatherDesc.innerText =weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp}°C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed}m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloud.innerText   = `${weatherInfo?.clouds?.all}%`;


}


let searchInput = document.querySelector('[data-searchInput]');

let granAccessButton = document.querySelector('[data-grantAccess]');

granAccessButton.addEventListener("click",getlocation);



searchForm.addEventListener("submit",(e)=>{
        // form ka sat deal kar rha ho to ya hamasa karna nhi to 
        // page reload hoga or js page reload hona ka phala hi chaljayga or apko 
        // asa laga ki js chl nhi rhi ha

        e.preventDefault();

        let cityName = searchInput.value;

        if(cityName === "" ){
            return;
        }
        else{
            fetchSearchWeatherInfo(cityName);
        }

});


var pageNotFound = document.querySelector('.pagenotfound');

async function fetchSearchWeatherInfo(city){
      
    loadingScreen.classList.add("active");

    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");
     pageNotFound.classList.remove("active");

    try{
          
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data =await response.json();  
                
        loadingScreen.classList.remove("active");

        if (response.status === 404 || !data || !data.main) {
            pageNotFound.classList.add("active");
        } else {
            userInfoContainer.classList.add("active");
            renderWeatherInfo(data);
        }


    }catch(e){
              loadingScreen.classList.remove("active");
              pageNotFound.classList.add("active");
    }
}




