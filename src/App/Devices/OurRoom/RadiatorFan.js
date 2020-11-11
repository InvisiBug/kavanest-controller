////////////////////////////////////////////////////////////////////////
//
// ██████╗  █████╗ ██████╗ ██╗ █████╗ ████████╗ ██████╗ ██████╗     ███████╗ █████╗ ███╗   ██╗
// ██╔══██╗██╔══██╗██╔══██╗██║██╔══██╗╚══██╔══╝██╔═══██╗██╔══██╗    ██╔════╝██╔══██╗████╗  ██║
// ██████╔╝███████║██║  ██║██║███████║   ██║   ██║   ██║██████╔╝    █████╗  ███████║██╔██╗ ██║
// ██╔══██╗██╔══██║██║  ██║██║██╔══██║   ██║   ██║   ██║██╔══██╗    ██╔══╝  ██╔══██║██║╚██╗██║
// ██║  ██║██║  ██║██████╔╝██║██║  ██║   ██║   ╚██████╔╝██║  ██║    ██║     ██║  ██║██║ ╚████║
// ╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝ ╚═╝╚═╝  ╚═╝   ╚═╝    ╚═════╝ ╚═╝  ╚═╝    ╚═╝     ╚═╝  ╚═╝╚═╝  ╚═══╝
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
const device = "radiatorFan";

const { getStore, setStore } = require("../../../helpers/StorageDriver");
const { radiatorFanOff, radiatorFanOn } = require("../../../helpers/HeatingFunctions");

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
const saveToStorage = true;
var deviceData = { isAutomatic: true }; // means isAutomatic gets written to long term storage
var timer = setTimeout(() => {
  deviceData.isConnected = false;
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
    client.publish("Radiator Fan Control", "1"); // Toggle power button
    // radiatorFanOn();
  }
  sendSocketData();
  res.json(null);
});

app.get("/api/RadiatorFan/Off", (req, res) => {
  if (!deviceData.isAutomatic) {
    deviceData.isOn = false;
    // console.log("boopp");
    client.publish("Radiator Fan Control", "0"); // Toggle power button
    // radiatorFanOff();
  }
  sendSocketData();
  res.json(null);
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
  if (topic == "Radiator Fan") {
    clearTimeout(timer);

    timer = setTimeout(() => {
      deviceData.isConnected = false;
      if (saveToStorage) setStore(`${"Radiator Fan"}`, deviceData);
    }, 10 * 1000);

    if (payload != "Radiator Fan Disconnected") {
      deviceData = {
        ...deviceData,
        isConnected: true,
        isOn: JSON.parse(payload).state,
      };
      if (saveToStorage) setStore(`${"Radiator Fan"}`, deviceData);
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
        client.publish("Radiator Fan Control", "0");
      } else {
        deviceData = {
          ...deviceData,
          isOn: true,
        };
        client.publish("Radiator Fan Control", "1");
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
