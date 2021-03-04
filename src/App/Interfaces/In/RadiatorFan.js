const express = require("express");
const app = (module.exports = express());
const { radiatorFanControl } = require("../Out/mqttOut");

const { getStore, setStore } = require("../../../Helpers/StorageDrivers/LowLevelDriver");
const { setRadiatorFan } = require("../../../Helpers/StorageDrivers/Devices/RadiatorFan");
const { updateRadiatorFanTime } = require("../../../Helpers/HeatingModes/Timers");

const disconnectedState = {
  isAutomatic: true,
  isConnected: false,
  isOn: false,
};

var deviceData = disconnectedState;
var timer;

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
// Automatic / Manual
app.get("/api/RadiatorFanAutomatic/On", (req, res) => {
  deviceData.isAutomatic = true;
  sendSocketData();
  res.json(null);
});

app.get("/api/RadiatorFanAutomatic/off", (req, res) => {
  deviceData.isAutomatic = false;
  sendSocketData();
  res.json(null);
});

// On / Off
app.get("/api/RadiatorFan/On", (req, res) => {
  if (!deviceData.isAutomatic) {
    deviceData.isOn = true;
    updateRadiatorFanTime("on");
  }
  sendSocketData();
  res.json(null);
});

app.get("/api/RadiatorFan/Off", (req, res) => {
  if (!deviceData.isAutomatic) {
    deviceData.isOn = false;
    updateRadiatorFanTime("off");
  }
  sendSocketData();
  res.json(null);
});

////////////////////////////////////////////////////////////////////////
//
//  #     #  #####  ####### #######
//  ##   ## #     #    #       #
//  # # # # #     #    #       #
//  #  #  # #     #    #       #
//  #     # #   # #    #       #
//  #     # #    #     #       #
//  #     #  #### #    #       #
//
////////////////////////////////////////////////////////////////////////
client.on("message", (topic, payload) => {
  if (topic == "Radiator Fan") {
    clearTimeout(timer);

    timer = setTimeout(() => {
      setStore("Radiator Fan", disconnectedState);
    }, 10 * 1000);

    if (payload != "Radiator Fan Disconnected") {
      const mqttData = JSON.parse(payload);

      deviceData = {
        ...deviceData,
        isConnected: true,
        isOn: mqttData.state,
      };

      setRadiatorFan(deviceData);
      // console.log(`MQTT: ${mqttData.state}, Storage: ${getStore("Radiator Fan").isOn}`);
    } else {
      console.log("Radiator Fan Disconnected");
    }
  } else if (topic == "Radiator Fan Button") {
    if (!deviceData.isAutomatic) {
      if (deviceData.isOn) {
        deviceData = {
          ...deviceData,
          isOn: false,
        };
        radiatorFanControl("0");
      } else {
        deviceData = {
          ...deviceData,
          isOn: true,
        };
        radiatorFanControl("1");
      }
      sendSocketData();
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
  io.emit("Radiator Fan", deviceData);
};
