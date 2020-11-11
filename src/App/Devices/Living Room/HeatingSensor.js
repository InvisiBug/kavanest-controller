////////////////////////////////////////////////////////////////////////
//
//  888      d8b          d8b                         8888888b.
//  888      Y8P          Y8P                         888   Y88b
//  888                                               888    888
//  888      888 888  888 888 88888b.   .d88b.        888   d88P  .d88b.   .d88b.  88888b.d88b.
//  888      888 888  888 888 888 "88b d88P"88b       8888888P"  d88""88b d88""88b 888 "888 "88b
//  888      888 Y88  88P 888 888  888 888  888       888 T88b   888  888 888  888 888  888  888
//  888      888  Y8bd8P  888 888  888 Y88b 888       888  T88b  Y88..88P Y88..88P 888  888  888
//  88888888 888   Y88P   888 888  888  "Y88888       888   T88b  "Y88P"   "Y88P"  888  888  888
//                                          888
//                                     Y8b d88P
//                                      "Y88P"
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
app.get("/api/heating/sensor/livingRoom/status", (req, res) => {
  res.json(livingRoom);
});

app.get("/api/heating/sensor/livingRoom/setpoint/status", (req, res) => {
  res.json(setpoint);
});

app.post("/api/heating/sensor/livingRoom/setpoint/set", (req, res) => {
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
client.on("message", async (topic, payload) => {
  if (topic == "Living Room Heating Sensor") {
    clearTimeout(timer);

    timer = setTimeout(async () => {
      deviceData.isConnected = false;
      await setStore("Living Room Heating Sensor", deviceData);
    }, 10 * 1000);

    if (payload != "Living Room Heating Sensor Disconnected") {
      var mqttData = JSON.parse(payload);

      deviceData = {
        ...deviceData,
        isConnected: true,
        temperature: mqttData.temperature,
        humidity: mqttData.humidity,
        pressure: mqttData.pressure,
        battery: mqttData.battery,
      };

      await setStore("Living Room Heating Sensor", deviceData);
      console.log(await getStore("Living Room Heating Sensor"));
    } else {
      console.log("Living room heating sensor disconnected at " + functions.printTime());
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
  io.emit("Living Room Heating Sensor", deviceData);
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
//   if (livingRoom) {
//     var data = {
//       temperature: livingRoom.temperature,
//       humidity: livingRoom.humidity,
//       timestamp: functions.currentTime(),
//     };
//     db.collection("Living Room").insert(data, (err, res) => {
//       if (err) console.log(err);
//     });
//   } else {
//     data = {
//       temperature: null,
//       humidity: null,
//       timestamp: functions.currentTime(),
//     };
//     db.collection("Living Room").insert(data, (err, res) => {
//       if (err) console.log(err);
//     });
//   }
// });

// const bedroomTemperatureController = setInterval(()  =>
// {
//   try
//   {
//     if((livingRoom.Temperature < setpoint - hysteresis))
//     {
//       client.publish("Living Room Radiator Control", JSON.stringify({"Node": "Living Room Temperature Controller", "state": true}));
//       client.publish("Heating Request Control",   JSON.stringify({"Node": "Living Room Temperature Controller", "state": true}));
//     }
//
//     if((livingRoom.Temperature > setpoint + hysteresis))
//     {
//       client.publish("Living Room Radiator Control", JSON.stringify({"Node": "Living Room Temperature Controller", "state": false}));
//       client.publish("Heating Request Control",   JSON.stringify({"Node": "Living Room Temperature Controller", "state": false}));
//     }
//   }
//
//   catch {}
// }, 5 * 1000);
