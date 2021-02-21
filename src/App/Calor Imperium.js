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

const { getStore } = require("../Helpers/StorageDrivers/LowLevelDriver");
const { backendToFrontend, frontendToBackend } = require("../Helpers/Functions");
const { setHeatingModeSchedule, setHeatingModeZones, setHeatingModeManual } = require("../Helpers/HeatingModes/Modes");
const { boostOn, boostOff } = require("../Helpers/HeatingModes/Schedule");
const { setZonesSetpoints } = require("../Helpers/HeatingModes/Zones");
const { setHeatingSchedule } = require("../Helpers/HeatingModes/Schedule");
const { manualheatingOn, manualheatingOff } = require("../Helpers/HeatingModes/Manual");
const { openValve, closeValve } = require("./Interfaces/Out/Valves");
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
  setHeatingSchedule(frontendToBackend(req.body.data));
  sendEnvironmentalData();
  res.end(null);
});

// ----------  Zone Setpoints  ----------
app.post("/api/ci/setpoints", (req, res) => {
  setZonesSetpoints(req.body.room, req.body.vals);
  sendEnvironmentalData();
  res.end(null);
});

// ----------  Boost  ----------
app.get("/api/ci/boost/on", (req, res) => {
  boostOn();
  sendEnvironmentalData();
  res.end(null);
});

app.get("/api/ci/boost/off", (req, res) => {
  boostOff();
  sendEnvironmentalData();
  res.end(null);
});

/*
  On / Off
*/
app.get("/api/ci/on", (req, res) => {
  manualheatingOn();
  sendEnvironmentalData();
  res.end(sendEnvironmentalData());
});

app.get("/api/ci/off", (req, res) => {
  manualheatingOff();
  sendEnvironmentalData();
  res.end(sendEnvironmentalData());
});

/*
  Heating Modes
*/
app.get("/api/ci/mode/zones", (req, res) => {
  setHeatingModeZones();
  sendEnvironmentalData();
  res.end(null);
});

app.get("/api/ci/mode/schedule", (req, res) => {
  setHeatingModeSchedule();
  sendEnvironmentalData();
  res.end(null);
});

app.get("/api/ci/mode/manual", (req, res) => {
  setHeatingModeManual();
  sendEnvironmentalData();
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
  sendEnvironmentalData();
}, 1 * 1000);

const sendEnvironmentalData = () => {
  try {
    // const data = getScheduleHeating();
    // const adjustedData = backendToFrontend(data);

    // // io.emit("Heating Schedule", adjustedData);

    const envData = getStore("Environmental Data");
    const newData = envData.heatingSchedule;

    envData.heatingSchedule = backendToFrontend(newData);

    io.emit(`${"Environmental Data"}`, envData);
  } catch (e) {
    console.log(e);
  }
};

////////////
/*
  Living Room
*/
app.get("/api/radiatorValves/livingRoom/open", (req, res) => {
  openValve("Living Room");
  res.end(null);
});

app.get("/api/radiatorValves/livingRoom/close", (req, res) => {
  closeValve("Living Room");
  res.end(null);
});

/*
  Liams Room
*/
app.get("/api/radiatorValves/liamsRoom/open", (req, res) => {
  openValve("Liams Room");
  res.end(null);
});

app.get("/api/radiatorValves/liamsRoom/close", (req, res) => {
  closeValve("Liams Room");
  res.end(null);
});

/*
  Study
*/
app.get("/api/radiatorValves/study/open", (req, res) => {
  openValve("Study");
  res.end(null);
});

app.get("/api/radiatorValves/study/close", (req, res) => {
  closeValve("Study");
  res.end(null);
});

/*
  Our Room
*/
app.get("/api/radiatorValves/ourRoom/open", (req, res) => {
  openValve("Our Room");
  res.end(null);
});

app.get("/api/radiatorValves/ourRoom/close", (req, res) => {
  closeValve("Our Room");
  res.end(null);
});
