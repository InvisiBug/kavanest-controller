////////////////////////////////////////////////////////////////////////
//
//  ██████╗ ███████╗██████╗ ██████╗  ██████╗  ██████╗ ███╗   ███╗     ██████╗██╗     ██╗███╗   ███╗ █████╗ ████████╗███████╗
//  ██╔══██╗██╔════╝██╔══██╗██╔══██╗██╔═══██╗██╔═══██╗████╗ ████║    ██╔════╝██║     ██║████╗ ████║██╔══██╗╚══██╔══╝██╔════╝
//  ██████╔╝█████╗  ██║  ██║██████╔╝██║   ██║██║   ██║██╔████╔██║    ██║     ██║     ██║██╔████╔██║███████║   ██║   █████╗
//  ██╔══██╗██╔══╝  ██║  ██║██╔══██╗██║   ██║██║   ██║██║╚██╔╝██║    ██║     ██║     ██║██║╚██╔╝██║██╔══██║   ██║   ██╔══╝
//  ██████╔╝███████╗██████╔╝██║  ██║╚██████╔╝╚██████╔╝██║ ╚═╝ ██║    ╚██████╗███████╗██║██║ ╚═╝ ██║██║  ██║   ██║   ███████╗
//  ╚═════╝ ╚══════╝╚═════╝ ╚═╝  ╚═╝ ╚═════╝  ╚═════╝ ╚═╝     ╚═╝     ╚═════╝╚══════╝╚═╝╚═╝     ╚═╝╚═╝  ╚═╝   ╚═╝   ╚══════╝
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
var app = (module.exports = express());
const { getStore, setStore, updateValue, readValue } = require("../helpers/StorageDrivers/LowLevelDriver");
const { backendToFrontend, frontendToBackend } = require("../helpers/Functions");
const { boostOn, boostOff, radiatorFanOverrun, heatingOn, heatingOff } = require("../helpers/HeatingFunctions");
const { isClimateControlAuto, setClimateControlAuto } = require("../helpers/StorageDrivers/ClimateControl");
const { setRoomSetpoints } = require("../helpers/StorageDrivers/Conditions");
const { triggerEnvironmentalDataSocket } = require("../App/Services/HouseClimateStats");

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
// -----  Schedule  -----
app.post("/api/ci/schedule/update", (req, res) => {
  setStore("heatingSchedule", frontendToBackend(req.body.data));
  sendHeatingSchedule();
  res.end(null);
});

// ----------  Boost  ----------
app.get("/api/ci/boost/on", (req, res) => {
  // boostOn();
  // sendHeatingSchedule();
  console.log("Boost On");
  res.end(null);
});

app.get("/api/ci/boost/off", (req, res) => {
  // boostOff();
  // sendHeatingSchedule();
  console.log("Boost Off");
  res.end(null);
});

// -----  Manual  -----
app.get("/api/ci/manual/on", (req, res) => {
  setClimateControlAuto(true);
  console.log("Heating in manual mode");
  res.end(null);
});

app.get("/api/ci/manual/off", (req, res) => {
  setClimateControlAuto(false);
  console.log("Heating in auto mode");
  res.end(null);
});

// ----- On / Off -----
app.get("/api/ci/on", (req, res) => {
  if (!isClimateControlAuto()) {
    console.log("Heating On");
  }
  res.end(null);
});

app.get("/api/ci/off", (req, res) => {
  let data = getStore("heatingSchedule");
  if (!data.auto) {
    // close all valves here
    console.log("Heating Off");
    // heatingOff();
    // sendHeatingSchedule();
  }
  // sendHeatingSchedule();
  res.end(null);
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
var heatingScheduleSocket = setInterval(() => {
  sendHeatingSchedule();
}, 1 * 1000);

const sendHeatingSchedule = () => {
  try {
    const data = getStore("heatingSchedule");
    const adjustedData = backendToFrontend(data);

    io.emit("Heating Schedule", adjustedData);
  } catch (e) {
    console.log(e);
  }
};

app.post("/api/ci/setpoints", (req, res) => {
  setRoomSetpoints(req.body.room, req.body.vals);
  triggerEnvironmentalDataSocket();
  res.end(null);
});
