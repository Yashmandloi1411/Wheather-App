var userTab = document.querySelector('[data-userWeather]');

var searchTab = document.querySelector('[data-searchWeather]');

var userContainer = document.querySelector('.weather-container');

var grantAccessContainer = document.querySelector('.grant-location-container');

var searchForm = document.querySelector('[data-searchForm]');

var loadingScreen = document.querySelector('.loading-container');

var userInfoContainer = document.querySelector('.user-info-container');

// initial variable need



// const API_KEY = "b115fe64757de5aaea857f357ef0dd4f";
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";

let oldTab = userTab;
oldTab.classList.add("current-tab");

getfromSessionStorage();

//ek kam or pending ha 

function switchTab(newTab){
         if(newTab != oldTab){
            oldTab.classList.remove("current-tab");
            oldTab = newTab;
            oldTab.classList.add("current-tab");

            if(!searchForm.classList.contains("active")){
                 // if search form wala container is invisible, if yes then make it visible
                 userInfoContainer.classList.remove("active");
                 grantAccessContainer.classList.remove("active");
                 searchForm.classList.add("active");
            }

            else{
                //main phala search wala tab pr tha ab your weather tab ko vissible karna ha
                  searchForm.classList.remove("active");
                  userInfoContainer.classList.remove("active");

                  //ab main your weather tab me agya hu ,toh weather bi display karna padega
                  // so first chek local storage first for coordinate ,if we haved saved theme there

                  getfromSessionStorage();
            }

         }
}

userTab.addEventListener('click', function(){
    // pass clcked tab as input parameter
         switchTab(userTab)
});

searchTab.addEventListener('click', function(){
    // pass clcked tab as input parameter
         switchTab(searchTab);
});


//check  if coordinate are already present in session storage
function  getfromSessionStorage(){
        const localCoordinate = sessionStorage.getItem("user-coordinate");
        if(!localCoordinate){
             // agar local coordinate nhi milaa
             grantAccessContainer.classList.add("active");
        }
        else{
            //agar local coordinate pada then kya kro

            const  coordinate = JSON.parse(localCoordinate);

            fetchUserWeatherInfo(coordinate);
        }
}

async function fetchUserWeatherInfo(coordinate){
    const {lat,lon} = coordinate;

    // api call maro ga to apko loader dikhan padega
    // or apko grantContainer invisible karvan padega

    grantAccessContainer.classList.remove("active");

    // make loader vissible
    loadingScreen.classList.add("active");

    // API call

    try{
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
     
    const data = await res.json();

     // api call kardi ha ab loader hata do
    loadingScreen.classList.reomove("active");

    // user ka info ko active karna ha
     userInfoContainer.classList.add("active");

     renderWeatherInfo(data);

    }catch(e){
        //loadingScrren ko remove karo ?
        console.log("Error is Occured");
    }
      
}



function renderWeatherInfo(weatherInfo){
           //first we have to fecth  the element

        const cityName = document.querySelector('[data-cityName]');
        const countryIcon = document.querySelector('[data-countryIcon]');
        const weatherDesc = document.querySelector('[data-weatherDesc]');
        const weatherIcon = document.querySelector('[data-weatherIcon]');
        const temp = document.querySelector('[data-temp]');
        const windspeed = document.querySelector('[data-windspeed]');
        const humidity = document.querySelector('[data-humidity]');
        const cloud = document.querySelector('[ data-cloud]');

        console.log(weatherInfo);
        //fetch value from weatherInfo object  and put in UI elemnet

        cityName.innerText = weatherInfo?.name;
        countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
        weatherDesc.innerText =weatherInfo?.weather?.[0]?.description;
        weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
        temp.innerText = weatherInfo?.main?.temp;
        windspeed.innerText = weatherInfo?.wind?.speed;
        humidity.innerText = weatherInfo?.main?.humidity;
        cloud.innerText   = weatherInfo?.clouds?.all;

}


function getlocation(){
    // if geolocation ka support available ha then
    if(navigator.geolocation){
             navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
                //show an alert for no geo location
    }
}

function showPosition(position){
         const userCoordinate = {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
         }    
         
         sessionStorage.setItem("user-coordinate",JSON.stringify(userCoordinate));

         fetchUserWeatherInfo(userCoordinate);
}

const granAccessButton = document.querySelector('[data-grantAccess]');

granAccessButton.addEventListener('click',getlocation);



let searchInput = document.querySelector('[data-searchInput]');

searchForm.addEventListener("submit",(e)=>{
    e.preventDefault();

    let cityName = searchInput.value;

    if(cityName === "") {
        return;
    }
    else{
        fetchSearchWeatherInfo(cityName);
    }
});
 async function fetchSearchWeatherInfo(city) {
               loadingScreen.classList.add('active');

               userInfoContainer.classList.remove("active");
               grantAccessContainer.classList.remove("active");

               try{
                  const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
                  const data =await response.json();   

                  loadingScreen.classList.remove("active");
                  userInfoContainer.classList.add("active");

                  renderWeatherInfo(data);
               }catch(e){
               }
}