const express = require("express");
const app = (module.exports = express());
const { sunControl } = require("../../Interfaces/mqttOut");
const { printTime } = require("../../../helpers/Functions.js");

let errorState = {
  isConnected: false,
  isOn: false,
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
app.get("/api/Sun/On", (req, res) => {
  sunControl("1");
  deviceData.isOn = true;
  sendSocketData();
  res.json(null);
});

app.get("/api/Sun/Off", (req, res) => {
  sunControl("0");
  deviceData.isOn = false;
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
  if (topic === "Sun") {
    clearTimeout(timer);

    timer = setTimeout(() => {
      deviceData = errorState;
    }, 10 * 1000);

    if (payload != "Sun Disconnected") {
      deviceData = {
        ...deviceData,
        isConnected: true,
        isOn: JSON.parse(payload).state,
      };
    } else {
      console.log("Sun Disconnected" + printTime());
    }
  } else if (topic === "Sun Button") {
    deviceData.isOn ? sunControl("0") : sunControl("1");
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
  io.emit("Sun", deviceData);
};
