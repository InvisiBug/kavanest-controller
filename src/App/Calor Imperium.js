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
const { getStore, setStore, updateValue, readValue } = require("../Helpers/StorageDrivers/LowLevelDriver");
const { backendToFrontend, frontendToBackend } = require("../Helpers/Functions");
const {
  boostOn,
  boostOff,
  setHeatingModeSchedule,
  setHeatingModeZones,
  setHeatingModeManual,
  heatingOn,
  heatingOff,
  getHeatingMode,
} = require("../Helpers/HeatingModes/Functions");
const { setZonesSetpoints, setZonesAuto, setZonesManual } = require("../Helpers/HeatingModes/Zones");
const { setHeatingScheduleAuto, setHeatingScheduleManual, setHeatingSchedule } = require("../Helpers/HeatingModes/Schedule");
const { manualheatingOn, manualheatingOff } = require("../Helpers/HeatingModes/Manual");
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
  // setStore("heatingSchedule", frontendToBackend(req.body.data));
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
  console.log("Boost On");
  res.end(null);
});

app.get("/api/ci/boost/off", (req, res) => {
  boostOff();
  sendEnvironmentalData();
  console.log("Boost Off");
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
  // console.log("Manual Mode");
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
    // const data = getHeatingSchedule();
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
