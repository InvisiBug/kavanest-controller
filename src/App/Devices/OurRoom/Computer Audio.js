/*
  Computer audio works differently to pretty much everything else
  Its basically wireless json
  The mqtt out has been messed with to remove the isConnected prop, take a look
*/
const express = require("express");
const app = (module.exports = express());
const { computerAudioControl } = require("../../Interfaces/Out/mqttOut");

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
const disconnectedState = {
  isConnected: false,
  left: false,
  right: false,
  sub: false,
  mixer: false,
};
var timer;
var deviceData = disconnectedState;

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
app.post("/api/ComputerAudio", (req, res) => {
  if (req.body.state === "on") {
    if (req.body.device == "master") {
      client.publish("Computer Audio Control", "1");
    } else {
      deviceData[req.body.device] = true;
      computerAudioControl(deviceData);
    }
  } else if (req.body.state === "off") {
    if (req.body.device == "master") {
      client.publish("Computer Audio Control", "0");
    } else {
      deviceData[req.body.device] = false;
      computerAudioControl(deviceData);
    }
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
  if (topic == "Computer Audio") {
    clearTimeout(timer);

    timer = setTimeout(() => {
      deviceData.isConnected = false;
    }, 10 * 1000);

    if (payload != "Computer Audio Disconnected") {
      jsonData = JSON.parse(payload, function (prop, value) {
        let lower = prop.toLowerCase();
        if (prop === lower) return value;
        else this[lower] = value;
      });

      deviceData = {
        ...deviceData,
        isConnected: true,
        left: jsonData.left,
        right: jsonData.right,
        sub: jsonData.sub,
        mixer: jsonData.mixer,
      };
    } else {
      console.log("Computer Audio Disconnected");
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
  // console.log(deviceData);
  io.emit("Computer Audio", deviceData);
};
