////////////////////////////////////////////////////////////////////////
//
//   █████╗ ██╗   ██╗████████╗ ██████╗      █████╗  ██████╗████████╗██╗██╗   ██╗ █████╗ ████████╗███████╗
//  ██╔══██╗██║   ██║╚══██╔══╝██╔═══██╗    ██╔══██╗██╔════╝╚══██╔══╝██║██║   ██║██╔══██╗╚══██╔══╝██╔════╝
//  ███████║██║   ██║   ██║   ██║   ██║    ███████║██║        ██║   ██║██║   ██║███████║   ██║   █████╗
//  ██╔══██║██║   ██║   ██║   ██║   ██║    ██╔══██║██║        ██║   ██║╚██╗ ██╔╝██╔══██║   ██║   ██╔══╝
//  ██║  ██║╚██████╔╝   ██║   ╚██████╔╝    ██║  ██║╚██████╗   ██║   ██║ ╚████╔╝ ██║  ██║   ██║   ███████╗
//  ╚═╝  ╚═╝ ╚═════╝    ╚═╝    ╚═════╝     ╚═╝  ╚═╝ ╚═════╝   ╚═╝   ╚═╝  ╚═══╝  ╚═╝  ╚═╝   ╚═╝   ╚══════╝
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
var express = require("express");
var app = (module.exports = express());
var ping = require("ping");

// Functions
var functions = require("../Functions.js");

// Schedule
var schedule = require("node-schedule");

var time = new Date();

// MQTT Setup
const mqtt = require("mqtt");
const client = mqtt.connect("mqtt://192.168.1.46");
client.on("connect", () => null); //client.on('connect', () => console.log(topic + " MQTT Connected"));

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
var autoActivate = false;

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
app.get("/api/autoActivate/status", (req, res) => {
  res.json(autoActivate);
});

app.post("/api/autoActivate/on", (req, res) => {
  autoActivate = true;
  res.json(autoActivate);
});

app.post("/api/autoActivate/off", (req, res) => {
  autoActivate = false;
  res.json(autoActivate);
});

////////////////////////////////////////////////////////////////////////
//
//   #####
//  #     #  ####  #    # ###### #####  #    # #      ######
//  #       #    # #    # #      #    # #    # #      #
//   #####  #      ###### #####  #    # #    # #      #####
//        # #      #    # #      #    # #    # #      #
//  #     # #    # #    # #      #    # #    # #      #
//   #####   ####  #    # ###### #####   ####  ###### ######
//
////////////////////////////////////////////////////////////////////////
var Hourly = new schedule.RecurrenceRule();
Hourly.hour = 0;

schedule.scheduleJob(Hourly, function () {
  autoActivate = true;
});

const interval = setInterval(() => {
  if (time.getHours() >= 12 && autoActivate && time.getDay() < 6) {
    ping.sys.probe("192.168.1.12", (phoneFound, error) => {
      if (phoneFound) {
        console.log("Phone Found");
        autoActivate = false;

        //         deskLEDs = {"red": 255, "green": 100, "blue": 0}
        //         client.publish("Desk LED Control", JSON.stringify({"red": 255, "green": 100, "blue": 0}));
        //
        //         tableLamp = {"red": 255, "green": 100, "blue": 0}
        //         client.publish("Table Lamp Control", JSON.stringify(tableLamp));
        //
        //         client.publish("Plug Control", '1');
        //
        //         client.publish("Computer Audio Control", '1'); // Toggle power button
        //
        //         client.publish("Computer Power Control", '1'); // Toggle power button
      }
    });
  }
}, 5000);
