////////////////////////////////////////////////////////////////////////
//
//  ██╗    ██╗███████╗ █████╗ ████████╗██╗  ██╗███████╗██████╗
//  ██║    ██║██╔════╝██╔══██╗╚══██╔══╝██║  ██║██╔════╝██╔══██╗
//  ██║ █╗ ██║█████╗  ███████║   ██║   ███████║█████╗  ██████╔╝
//  ██║███╗██║██╔══╝  ██╔══██║   ██║   ██╔══██║██╔══╝  ██╔══██╗
//  ╚███╔███╔╝███████╗██║  ██║   ██║   ██║  ██║███████╗██║  ██║
//   ╚══╝╚══╝ ╚══════╝╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝
//
////////////////////////////////////////////////////////////////////////
//
//   #####
//  #     #  ####  #    # ###### #  ####
//  #       #    # ##   # #      # #    #
//  #       #    # # #  # #####  # #
//  #       #    # #  # # #      # #  ###
//  #     # #    # #   ## #      # #    #
//   #####   ####  #    # #      #  ####
//
////////////////////////////////////////////////////////////////////////
// Express
var express = require("express");
var app = (module.exports = express());

// Schedule
var schedule = require("node-schedule");

// Request
const request = require("request");

const store = require("../Helpers/StorageDrivers/LowLevelDriver");

const saveToStorage = true;

////////////////////////////////////////////////////////////////////////
//
//  #     #
//  #     #   ##   #####  #   ##   #####  #      ######  ####
//  #     #  #  #  #    # #  #  #  #    # #      #      #
//  #     # #    # #    # # #    # #####  #      #####   ####
//   #   #  ###### #####  # ###### #    # #      #           #
//    # #   #    # #   #  # #    # #    # #      #      #    #
//     #    #    # #    # # #    # #####  ###### ######  ####
//
////////////////////////////////////////////////////////////////////////
var forecastWeatherData;
var currentWeatherData;

////////////////////////////////////////////////////////////////////////
//
//    #    ######  ###
//   # #   #     #  #
//  #   #  #     #  #
// #     # ######   #
// ####### #        #
// #     # #        #
// #     # #       ###
//
////////////////////////////////////////////////////////////////////////
app.get("/api/weather/get/forecast", (req, res) => {
  res.json(forecastWeatherData);
});

app.get("/api/weather/get/current", (req, res) => {
  res.json(currentWeatherData);
});

////////////////////////////////////////////////////////////////////////
//
// #######
// #       #    # #    #  ####  ##### #  ####  #    #  ####
// #       #    # ##   # #    #   #   # #    # ##   # #
// #####   #    # # #  # #        #   # #    # # #  #  ####
// #       #    # #  # # #        #   # #    # #  # #      #
// #       #    # #   ## #    #   #   # #    # #   ## #    #
// #        ####  #    #  ####    #   #  ####  #    #  ####
//
////////////////////////////////////////////////////////////////////////
const getDaily = () => {
  request(
    "https://api.darksky.net/forecast/1a79dafc70696fa86e4f51559476b6d9/52.954399,-1.135709?units=si&exclude=minutely,hourly,flags,currently",
    (error, response, body) => {
      if (!error && response.statusCode == 200) {
        forecastWeatherData = JSON.parse(body);
        store.setStore(`${"Daily Forcast"}`, forecastWeatherData);
      }
    }
  );
};

const getCurrent = () => {
  request(
    "https://api.darksky.net/forecast/1a79dafc70696fa86e4f51559476b6d9/52.954399,-1.135709?units=si&exclude=minutely,daily,hourly,flags",
    (error, response, body) => {
      if (!error && response.statusCode == 200) {
        currentWeatherData = JSON.parse(body);

        let environmentalData = store.getStore("Environmental Data");

        environmentalData = {
          ...environmentalData,
          outside: {
            ...environmentalData.outside,
            current: {
              ...environmentalData.outside.current,
              temperature: currentWeatherData.currently.apparentTemperature,
              humidity: currentWeatherData.currently.humidity,
              pressure: currentWeatherData.currently.pressure,
              windSpeed: currentWeatherData.currently.windSpeed,
              windBearing: currentWeatherData.currently.windBearing,
              cloudCover: currentWeatherData.currently.cloudCover,
            },
          },
        };
        store.setStore("Environmental Data", environmentalData);
      }
    }
  );
};

setInterval(() => {
  getCurrent();
}, 30 * 60 * 1000);

var hours = [];
const next24Hrs = () => {
  request(
    "https://api.darksky.net/forecast/1a79dafc70696fa86e4f51559476b6d9/52.954399,-1.135709?units=si&exclude=minutely,daily,flags,currently",
    (error, response, body) => {
      if (!error && response.statusCode == 200) {
        data = JSON.parse(body);
        // console.log(data);

        for (let i = 0; i < 24; i++) {
          hours[i] = data.hourly.data[i].apparentTemperature;
        }

        let environmentalData = store.getStore("Environmental Data");

        environmentalData = {
          ...environmentalData,
          outside: {
            ...environmentalData.outside,
            next24Hrs: hours,
          },
        };
        // console.log(environmentalData);
        store.setStore("Environmental Data", environmentalData);
      }
      // console.log(environmentalData);
      // store.setStore(`${"Next 24 Hrs"}`, hours);
    }
  );
};

next24Hrs();
//api.darksky.net/forecast/1a79dafc70696fa86e4f51559476b6d9/52.954399,-1.135709?units=si&exclude=minutely,daily,flags,currently
getDaily();
getCurrent();

////////////////////////////////////////////////////////////////////////
//
//   #####
//  #     #  ####  #    # ###### #####  #    # #      ######
//  #       #    # #    # #      #    # #    # #      #
//   #####  #      ###### #####  #    # #    # #      #####
//        # #      #    # #      #    # #    # #      #
//  #     # #    # #    # #      #    # #    # #      #
//   #####   ####  #    # ###### #####   ####  ###### ######
//
////////////////////////////////////////////////////////////////////////
var weatherUpdate = new schedule.RecurrenceRule();
weatherUpdate.minute = 5;

schedule.scheduleJob(weatherUpdate, function () {
  getDaily();
  getCurrent();
  next24Hrs();
});
