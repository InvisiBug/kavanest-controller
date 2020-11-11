////////////////////////////////////////////////////////////////////////
//
//  ███████╗████████╗██╗   ██╗██████╗ ██╗   ██╗
//  ██╔════╝╚══██╔══╝██║   ██║██╔══██╗╚██╗ ██╔╝
//  ███████╗   ██║   ██║   ██║██║  ██║ ╚████╔╝
//  ╚════██║   ██║   ██║   ██║██║  ██║  ╚██╔╝
//  ███████║   ██║   ╚██████╔╝██████╔╝   ██║
//  ╚══════╝   ╚═╝    ╚═════╝ ╚═════╝    ╚═╝
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
const express = require("express");
const app = (module.exports = express());

// Functions
const functions = require("../../Functions.js");

// Database
const path = require("path");
const Engine = require("tingodb")();
const db = new Engine.Db(path.join(__dirname, "../../../Databases/Heating"), {});

// Schedule
const schedule = require("node-schedule");

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
var deviceData;
var timer;

var setpoint = 22;
var hysteresis = 0.5;

var addHeat = false;

timer = setTimeout(() => {
  deviceData = {
    ...deviceData,
    isConnected: false,
  };
}, 10 * 1000);

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
app.get("/api/heating/sensor/study/status", (req, res) => {
  res.json(deviceData);
});

app.get("/api/heating/sensor/study/setpoint/status", (req, res) => {
  res.json(setpoint);
});

app.post("/api/heating/sensor/study/setpoint/set", (req, res) => {
  setpoint = req.body.value;
  console.log(setpoint);
  res.end(null);
});

////////////////////////////////////////////////////////////////////////
//
//  #     #  #####  ####### #######    #     #                                              ######
//  ##   ## #     #    #       #       ##   ## ######  ####   ####    ##    ####  ######    #     # ######  ####  ###### # #    # ###### #####
//  # # # # #     #    #       #       # # # # #      #      #       #  #  #    # #         #     # #      #    # #      # #    # #      #    #
//  #  #  # #     #    #       #       #  #  # #####   ####   ####  #    # #      #####     ######  #####  #      #####  # #    # #####  #    #
//  #     # #   # #    #       #       #     # #           #      # ###### #  ### #         #   #   #      #      #      # #    # #      #    #
//  #     # #    #     #       #       #     # #      #    # #    # #    # #    # #         #    #  #      #    # #      #  #  #  #      #    #
//  #     #  #### #    #       #       #     # ######  ####   ####  #    #  ####  ######    #     # ######  ####  ###### #   ##   ###### #####
//
////////////////////////////////////////////////////////////////////////
client.on("message", (topic, payload) => {
  if (topic == "Study Heating Sensor") {
    clearTimeout(timer);

    timer = setTimeout(() => {
      deviceData.isConnected = false;
    }, 10 * 1000);

    if (payload != "Study Heating Sensor Disconnected") {
      var mqttData = JSON.parse(payload);

      deviceData = {
        ...deviceData,
        isConnected: true,
        temperature: mqttData.temperature,
        humidity: mqttData.humidity,
        pressure: mqttData.pressure,
        battery: mqttData.battery,
      };
    } else {
      console.log("Study Heating Sensor Disconnected  at " + functions.printTime());
    }
  }
});

////////////////////////////////////////////////////////////////////////
//
//  #####
// #     #  ####   ####  #    # ###### #####
// #       #    # #    # #   #  #        #
//  #####  #    # #      ####   #####    #
//       # #    # #      #  #   #        #
// #     # #    # #    # #   #  #        #
//  #####   ####   ####  #    # ######   #
//
////////////////////////////////////////////////////////////////////////
const sensorUpdate = setInterval(() => {
  sendSocketData();
}, 1 * 1000);

const sendSocketData = () => {
  io.emit("Study Heating Sensor", deviceData);
};

////////////////////////////////////////////////////////////////////////
//
//  ######
//  #     #   ##   #####   ##   #####    ##    ####  ######
//  #     #  #  #    #    #  #  #    #  #  #  #      #
//  #     # #    #   #   #    # #####  #    #  ####  #####
//  #     # ######   #   ###### #    # ######      # #
//  #     # #    #   #   #    # #    # #    # #    # #
//  ######  #    #   #   #    # #####  #    #  ####  ######
//
////////////////////////////////////////////////////////////////////////
// var Hourly = new schedule.RecurrenceRule();
// Hourly.minute = 0;

// schedule.scheduleJob(Hourly, () => {
//   var data;
//   if (deviceData) {
//     data = {
//       temperature: deviceData.temperature,
//       humidity: deviceData.humidity,
//       timestamp: functions.currentTime(),
//     };
//     db.collection("Study").insert(data, (err, res) => {
//       if (err) console.log(err);
//     });
//   } else {
//     data = {
//       temperature: null,
//       humidity: null,
//       timestamp: functions.currentTime(),
//     };
//     db.collection("Study").insert(data, (err, res) => {
//       if (err) console.log(err);
//     });
//   }
// });

// const bedroomTemperatureController = setInterval(()  =>
// {
//   try
//   {
//     if((deviceData.Temperature < setpoint - hysteresis))
//     {
//       client.publish("Study Radiator Control", JSON.stringify({"Node": "Study Temperature Controller", "state": true}));
//       client.publish("Heating Request Control",   JSON.stringify({"Node": "Study Temperature Controller", "state": true}));
//     }
//
//     if((deviceData.Temperature > setpoint + hysteresis))
//     {
//       client.publish("Study Radiator Control", JSON.stringify({"Node": "Study Temperature Controller", "state": false}));
//       client.publish("Heating Request Control",   JSON.stringify({"Node": "Study Temperature Controller", "state": false}));
//     }
//   }
//
//   catch {}
// }, 5 * 1000);
