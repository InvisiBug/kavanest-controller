const express = require("express");
const bodyParser = require("body-parser");
const app = (module.exports = express());

app.use(bodyParser.json()); // Used to handle data in post requests
console.clear();

const fetchPort = process.env.PORT || 5000;
const socketPort = process.env.PORT || 5001;

let server = require("http").createServer(app);
global.io = require("socket.io")(server);

const mqtt = require("mqtt");

// global.client = mqtt.connect("mqtt://192.168.1.46"); //  Deployment
global.client = mqtt.connect("mqtt://localhost"); //  Production, Can stay as this one
// global.client = mqtt.connect("mqtt://kavanet.io"); // Dont use this one

client.setMaxListeners(50); // TODO Sort this out later, Disables event listener warning

client.subscribe("#", (err) => {
  err ? console.log(err) : console.log("Subscribed to all");
});

client.on("connect", () => console.log("MQTT Connected"));

// client.on("message", (topic, payload) => console.log(chalk.white("Topic: " + topic) + chalk.cyan(" \t" + payload)));
client.on("message", (topic, payload) => {
  try {
    io.emit("MQTT Messages", JSON.parse(payload));
  } catch {}
});

////////////////////////////////////////////////////////////////////////
//
//  #     #
//  ##   ##  ####  #####  #    # #      ######  ####
//  # # # # #    # #    # #    # #      #      #
//  #  #  # #    # #    # #    # #      #####   ####
//  #     # #    # #    # #    # #      #           #
//  #     # #    # #    # #    # #      #      #    #
//  #     #  ####  #####   ####  ###### ######  ####
//
////////////////////////////////////////////////////////////////////////
// General
// app.use(require("./App/Weather.js"));

// Our Room
app.use(require("./App/Devices/OurRoom/Desk LEDs"));
app.use(require("./App/Devices/OurRoom/Screen LEDs"));
app.use(require("./App/Devices/OurRoom/FloodLight"));
app.use(require("./App/Devices/OurRoom/Table Lamp"));
app.use(require("./App/Devices/OurRoom/FloodLight.js"));
app.use(require("./App/Devices/OurRoom/Sun.js"));
app.use(require("./App/Devices/OurRoom/Computer Audio.js"));
app.use(require("./App/Devices/OurRoom/Computer Power.js"));

app.use(require("./App/Interfaces/In/RadiatorFan.js"));

app.use(require("./App/Calor Imperium.js"));
app.use(require("./App/Interfaces/In/HeatingController.js"));
require("./App/Services/HouseClimateStats");
require("./App/Controllers/HeatingModeController");
app.use(require("./App/Services/HistoricalClimate"));

////////////////////////////////////////////////////////////////////////
//
//  #     #  #####     ######
//  #     # #     #    #     # ###### #    # #  ####  ######  ####
//  #     #       #    #     # #      #    # # #    # #      #
//  #     #  #####     #     # #####  #    # # #      #####   ####
//   #   #        #    #     # #      #    # # #      #           #
//    # #   #     #    #     # #       #  #  # #    # #      #    #
//     #     #####     ######  ######   ##   #  ####  ######  ####
//
////////////////////////////////////////////////////////////////////////
const { newSensor } = require("./App/Interfaces/In/HeatingSensor");
const { newValve } = require("./App/Interfaces/In/RadiatorValve");

const rooms = [
  {
    name: "Our Room",
    offset: 2.2,
    valve: true,
  },
  {
    name: "Study",
    offset: -7.1,
    valve: true,
  },
  {
    name: "Living Room",
    offset: -1.8,
    valve: true,
  },
  {
    name: "Kitchen",
    offset: 0,
    valve: false,
  },
  {
    name: "Liams Room",
    offset: -0.9,
    valve: true,
  },
];

rooms.map((room, index) => {
  newSensor(room.name, room.offset);
  if (room.valve) newValve(room.name);
});

////////////////////////////////////////////////////////////////////////
//
//  #
//  #       #  ####  ##### ###### #    #  ####
//  #       # #        #   #      ##   # #
//  #       #  ####    #   #####  # #  #  ####
//  #       #      #   #   #      #  # #      #
//  #       # #    #   #   #      #   ## #    #
//  ####### #  ####    #   ###### #    #  ####
//
////////////////////////////////////////////////////////////////////////
// Start the app
app.listen(fetchPort, console.log("App is listening on port " + fetchPort));
io.listen(socketPort, console.log("Socket is open on port " + socketPort));
