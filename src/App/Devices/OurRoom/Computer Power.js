const express = require("express");
const app = (module.exports = express());
const { computerPowerControl } = require("../../Interfaces/mqttOut");
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
app.get("/api/ComputerPower/On", (req, res) => {
  computerPowerControl("1");
  deviceData.isOn = true;
  sendSocketData();
  res.json(null); // Toggle power button
});

app.get("/api/ComputerPower/Off", (req, res) => {
  computerPowerControl("0");
  deviceData.isOn = false;
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
  if (topic == "Computer Power") {
    clearTimeout(timer);

    timer = setTimeout(() => {
      deviceData.isConnected = false;
    }, 10 * 1000);

    if (payload != "Computer Power Disconnected") {
      deviceData = {
        ...deviceData,
        isConnected: true,
        isOn: JSON.parse(payload).state,
      };
    } else {
      console.log("Computer power disconnected at " + printTime());
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

var sendSocketData = () => {
  io.emit("Computer Power", deviceData);
};
