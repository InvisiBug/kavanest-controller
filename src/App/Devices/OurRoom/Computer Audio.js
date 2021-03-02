/*
  Computer audio works differently to prettymuch everything else
  Its basically wireless json
  The mqtt out has been messed with, take a look
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

app.post("/api/ComputerAudio/On", (req, res) => {
  // console.log("Computer Audio On: " + req.body.Device);
  if (req.body.device == "master") {
    // computerAudioControl("1");
    client.publish("Computer Audio Control", "1");
  } else {
    deviceData[req.body.device] = true;

    // let data = deviceData;
    // delete data.isConnected;
    // computerAudioControl(JSON.stringify(data));

    computerAudioControl(data);
  }

  sendSocketData();
  res.json(null);
});

app.post("/api/ComputerAudio/Off", (req, res) => {
  if (req.body.device == "master") {
    client.publish("Computer Audio Control", "0");
  } else {
    deviceData[req.body.device] = false;

    let data = deviceData;
    delete data.isConnected;

    computerAudioControl(JSON.stringify(data));
  }
  console.log(deviceData);

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
        var lower = prop.toLowerCase();
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
  io.emit("Computer Audio", deviceData);
  // console.log("Send socket data", deviceData);
};
