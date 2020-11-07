const express = require("express");
const app = (module.exports = express());
const { screenLEDsControl } = require("../../Interfaces/mqttOut");

// Functions
const functions = require("../../../helpers/Functions.js");

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
let errorState = {
  isConnected: false,
  red: 0,
  green: 0,
  blue: 0,
  mode: 0,
};
var deviceData = errorState;
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
app.post("/api/screenLEDs/update", (req, res) => {
  deviceData = req.body;

  screenLEDsControl(JSON.stringify(deviceData));
  res.end(null);
});

app.get("/api/screenLEDs/colour", (req, res) => {
  deviceData.mode = null;

  screenLEDsControl("0");
  res.end(null);
});

app.get("/api/screenLEDs/ambient/on", (req, res) => {
  deviceData.mode = "ambient";

  screenLEDsControl("1");
  res.end(null);
});

app.get("/api/screenLEDs/rainbow/on", (req, res) => {
  deviceData.mode = "rainbow";

  screenLEDsControl("2");
  res.end(null);
});

app.get("/api/screenLEDs/fade/on", (req, res) => {
  deviceData.mode = "fade";

  screenLEDsControl("3");
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
  if (topic == "Screen LEDs") {
    clearTimeout(timer);

    timer = setTimeout(() => {
      deviceData.isConnected = false;
    }, 10 * 1000);

    if (payload != "Screen LEDs Disconnected") {
      var mqttData = JSON.parse(payload);

      deviceData = {
        ...deviceData,
        isConnected: true,
        red: mqttData.red,
        green: mqttData.green,
        blue: mqttData.blue,
        mode: mqttData.mode,
      };
    } else {
      console.log("Screen LEDs Disconnected  at " + functions.printTime());
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
  io.emit("Screen LEDs", deviceData);
};
