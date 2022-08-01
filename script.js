//Declare a variable to store the searched city
var city = "";
//Variadle declararion
var searchCity = $("#search-city");
var searchButton = $("#search-button");
var clearHistory = $("#clear-history");
var currentCity = $("#current-city");
var currentTemperature = $("#temperature");
var currentHumidity = $("#humidity");
var currentWSpeed = $("#wind-speed");
var sCity = []; //searched city will save in this array

// Searchs the city to see if it exist in the storage
function find(c) {
  for (let i = 0; i < sCity.length; i++) {
    if (c.toUpperCase() === sCity[i]) {
      return -1;
    }
  }
  return 1;
}

//Set up the key
var APIKey = "b3ed711f1639e257afb3f20f481be17f";
// Display the current and future weather to the user after grabing the city from the input field
function displayWeather(event) {
  console.log(event, "event");
  event.preventDefault();
  if (searchCity.val().trim() !== "") {
    city = searchCity.val().trim();
    currentWeather(city);
  }
}

//Create a ajax call
function currentWeather(city) {
  console.log("1");
  queryURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&APPID=" +
    APIKey;

  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    console.log(response, "response");

    var weatherIcon = response.weather[0].icon;
    var iconurl =
      "https://openweathermap.org/img/wn/" + weatherIcon + "@2x.png";
    console.log(iconurl, "iconurl");
    //Date
    var date = new Date(response.dt * 1000).toLocaleDateString();
    console.log(date, "Date");
    $("#current-city").html(
      response.name + "(" + date + ")" + "<img src=" + iconurl + ">"
    );

    var tempF = response.main.temp - 273.15;
    $(currentTemperature).html(tempF.toFixed(2) + "&#8451");
    // Display the Humidity
    $(currentHumidity).html(response.main.humidity + "%");
    //Display Wind speed and convert to MPH
    var ws = response.wind.speed;
    var windsmph = (ws * 2.237).toFixed(1);
    $(currentWSpeed).html(windsmph + "MPH");
    foreCast(response.id);
  });
}

// 5 days forecast weather
function foreCast(cityId) {
  console.log(cityId, "cityId");
  var dayOver = false;
  var castURL =
    "https://api.openweathermap.org/data/2.5/forecast?id=" +
    cityId +
    "&appid=" +
    APIKey;
  console.log(castURL, "castURL");

  $.ajax({
    url: castURL,
    method: "GET",
  }).then(function (response) {
    console.log(response, "response1");

    for (let i = 0; i < 5; i++) {
      var date = new Date(
        response.list[(i + 1) * 8 - 1].dt * 1000
      ).toLocaleDateString();
      var iconcode = response.list[(i + 1) * 8 - 1].weather[0].icon;
      var iconurl = "https://openweathermap.org/img/wn/" + iconcode + ".png";
      var tempK = response.list[(i + 1) * 8 - 1].main.temp;
      var tempF = (tempK - 273.5).toFixed(2);
      var humidity = response.list[(i + 1) * 8 - 1].main.humidity;

      $("#fDate" + i).html(date);
      $("#fImg" + i).html("<img src=" + iconurl + ">");
      $("#fTemp" + i).html(tempF + "&#8451");
      $("#fHumidity" + i).html(humidity + "%");
    }
  });
}

// Clickhandler
$("#search-button").on("click", displayWeather);
