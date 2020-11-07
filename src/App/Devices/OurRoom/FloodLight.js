const express = require("express");
const app = (module.exports = express());
const { plugControl } = require("../../Interfaces/mqttOut");

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
app.get("/api/Plug/On", (req, res) => {
  plugControl("1");
  deviceData.isOn = true;
  sendSocketData();
  res.json(null);
});

app.get("/api/Plug/Off", (req, res) => {
  plugControl("0");
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
  if (topic == "Plug") {
    clearTimeout(timer);

    timer = setTimeout(() => {
      deviceData = errorState;
    }, 10 * 1000);

    if (payload != "Plug Disconnected") {
      deviceData = {
        ...deviceData,
        isConnected: true,
        isOn: JSON.parse(payload).state,
      };
    } else {
      console.log("Plug Disconnected");
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
  io.emit("Floodlight", deviceData);
};
