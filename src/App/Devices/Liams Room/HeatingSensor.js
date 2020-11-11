////////////////////////////////////////////////////////////////////////
//
//  888      d8b                                       8888888b.
//  888      Y8P                                       888   Y88b
//  888                                                888    888
//  888      888  8888b.  88888b.d88b.  .d8888b        888   d88P  .d88b.   .d88b.  88888b.d88b.
//  888      888     "88b 888 "888 "88b 88K            8888888P"  d88""88b d88""88b 888 "888 "88b
//  888      888 .d888888 888  888  888 "Y8888b.       888 T88b   888  888 888  888 888  888  888
//  888      888 888  888 888  888  888      X88       888  T88b  Y88..88P Y88..88P 888  888  888
//  88888888 888 "Y888888 888  888  888  88888P'       888   T88b  "Y88P"   "Y88P"  888  888  888
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

// Persistant Storage
const storage = require("node-persist");

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
//  #####                                              ######
// #     # #####  ####  #####    ##    ####  ######    #     # #####  # #    # ###### #####   ####
// #         #   #    # #    #  #  #  #    # #         #     # #    # # #    # #      #    # #
//  #####    #   #    # #    # #    # #      #####     #     # #    # # #    # #####  #    #  ####
//       #   #   #    # #####  ###### #  ### #         #     # #####  # #    # #      #####       #
// #     #   #   #    # #   #  #    # #    # #         #     # #   #  #  #  #  #      #   #  #    #
//  #####    #    ####  #    # #    #  ####  ######    ######  #    # #   ##   ###### #    #  ####
//
////////////////////////////////////////////////////////////////////////
const getStore = async (store) => {
  await storage.init();
  try {
    return await storage.getItem(store);
  } catch (e) {
    console.log(e);
  }
};

const setStore = async (store, input) => {
  await storage.init();
  try {
    await storage.setItem(store, input);
  } catch (e) {
    console.log(e);
  }
};

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
app.get("/api/heating/sensor/liamsRoom/status", (req, res) => {
  res.json(deviceData);
});

app.get("/api/heating/sensor/liamsRoom/setpoint/status", (req, res) => {
  res.json(setpoint);
});

app.post("/api/heating/sensor/liamsRoom/setpoint/set", (req, res) => {
  setpoint = req.body.value;
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
client.on("message", async (topic, payload) => {
  if (topic == "Liams Room Heating Sensor") {
    clearTimeout(timer);

    timer = setTimeout(async () => {
      deviceData = null;
      await setStore("Liams Room Heating Sensor", deviceData);
    }, 10 * 1000);

    if (payload != "Liams Room Heating Sensor Disconnected") {
      var mqttData = JSON.parse(payload);

      deviceData = {
        ...deviceData,
        isConnected: true,
        temperature: mqttData.temperature,
        humidity: mqttData.humidity,
        pressure: mqttData.pressure,
        battery: mqttData.battery,
      };

      await setStore("Liams Room Heating Sensor", deviceData);
    } else {
      console.log("Liams Room Heating Sensor Disconnected at " + functions.printTime());
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
  io.emit("Liams Room Heating Sensor", deviceData);
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
//   if (deviceData) {
//     var data = {
//       temperature: deviceData.temperature,
//       humidity: deviceData.humidity,
//       timestamp: functions.currentTime(),
//     };
//     db.collection("Liams Room").insert(data, (err, res) => {
//       if (err) console.log(err);
//     });
//   } else {
//     var data = {
//       temperature: null,
//       humidity: null,
//       timestamp: functions.currentTime(),
//     };
//     db.collection("Liams Room").insert(data, (err, res) => {
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
//       client.publish("Liams Room Radiator Control", JSON.stringify({"Node": "Liams Room Temperature Controller", "state": true}));
//       client.publish("Heating Request Control",   JSON.stringify({"Node": "Liams Room Temperature Controller", "state": true}));
//     }
//
//     if((deviceData.Temperature > setpoint + hysteresis))
//     {
//       client.publish("Liams Room Radiator Control", JSON.stringify({"Node": "Liams Room Temperature Controller", "state": false}));
//       client.publish("Heating Request Control",   JSON.stringify({"Node": "Liams Room Temperature Controller", "state": false}));
//     }
//   }
//
//   catch {}
// }, 5 * 1000);
