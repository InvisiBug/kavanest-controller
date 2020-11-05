////////////////////////////////////////////////////////////////////////
//
//   ██████╗ ██████╗ ███╗   ███╗██████╗ ██╗   ██╗████████╗███████╗██████╗      █████╗ ██╗   ██╗██████╗ ██╗ ██████╗
//  ██╔════╝██╔═══██╗████╗ ████║██╔══██╗██║   ██║╚══██╔══╝██╔════╝██╔══██╗    ██╔══██╗██║   ██║██╔══██╗██║██╔═══██╗
//  ██║     ██║   ██║██╔████╔██║██████╔╝██║   ██║   ██║   █████╗  ██████╔╝    ███████║██║   ██║██║  ██║██║██║   ██║
//  ██║     ██║   ██║██║╚██╔╝██║██╔═══╝ ██║   ██║   ██║   ██╔══╝  ██╔══██╗    ██╔══██║██║   ██║██║  ██║██║██║   ██║
//  ╚██████╗╚██████╔╝██║ ╚═╝ ██║██║     ╚██████╔╝   ██║   ███████╗██║  ██║    ██║  ██║╚██████╔╝██████╔╝██║╚██████╔╝
//   ╚═════╝ ╚═════╝ ╚═╝     ╚═╝╚═╝      ╚═════╝    ╚═╝   ╚══════╝╚═╝  ╚═╝    ╚═╝  ╚═╝ ╚═════╝ ╚═════╝ ╚═╝ ╚═════╝
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
const express = require("express");
const app = (module.exports = express());
const { computerAudioControl } = require("../../Interfaces/mqttOut");

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
var computerAudio = null;
var timer;
var deviceData = {
  isConnected: false,
  left: false,
  right: false,
  sub: false,
  mixer: false,
};
// var timer = setTimeout(() => {
//   deviceData.isConnected = false;
// }, 10 * 1000);

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
app.get("/api/computerAudio/Status", (req, res) => {
  res.json(computerAudio);
});

app.post("/api/ComputerAudio/On", (req, res) => {
  // console.log("Computer Audio On: " + req.body.Device);
  if (req.body.Device == "Master") {
    computerAudioControl("1");

    computerAudio.Left = true;
    computerAudio.Right = true;
    computerAudio.Sub = true;
    computerAudio.Mixer = true;
  } else {
    req.body.Device == "Left"
      ? (computerAudio.Left = true)
      : req.body.Device == "Right"
      ? (computerAudio.Right = true)
      : req.body.Device == "Sub"
      ? (computerAudio.Sub = true)
      : req.body.Device == "Mixer"
      ? (computerAudio.Mixer = true)
      : null;

    computerAudioControl(JSON.stringify(computerAudio));
  }

  res.json(computerAudio);
});

app.post("/api/ComputerAudio/Off", (req, res) => {
  // console.log("Computer Audio Off: " + req.body.Device);
  if (req.body.Device == "Master") {
    computerAudioControl("0");

    computerAudio.Left = false;
    computerAudio.Right = false;
    computerAudio.Sub = false;
    computerAudio.Mixer = false;
  } else {
    req.body.Device == "Left"
      ? (computerAudio.Left = false)
      : req.body.Device == "Right"
      ? (computerAudio.Right = false)
      : req.body.Device == "Sub"
      ? (computerAudio.Sub = false)
      : req.body.Device == "Mixer"
      ? (computerAudio.Mixer = false)
      : null;

    computerAudioControl(JSON.stringify(computerAudio));
  }
  // console.log(computerAudio);

  res.json(computerAudio);
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
    if (payload != "Computer Audio Disconnected") {
      computerAudio = JSON.parse(payload);
    } else {
      computerAudio = null;
      console.log("Computer Audio Disconnected");
    }
  }

  if (topic == "Computer Audio") {
    clearTimeout(timer);

    timer = setTimeout(() => {
      deviceData.isConnected = false;
    }, 10 * 1000);

    if (payload != "Computer Audio Disconnected") {
      deviceData = {
        ...deviceData,
        isConnected: true,
        left: JSON.parse(payload).Left,
        right: JSON.parse(payload).Right,
        sub: JSON.parse(payload).Sub,
        mixer: JSON.parse(payload).Mixer,
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
  io.emit("New Computer Audio", deviceData);
  io.emit("Computer Audio", computerAudio);
};
