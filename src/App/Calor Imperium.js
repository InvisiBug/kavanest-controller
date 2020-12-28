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
const { boostOn, boostOff, setHeatingModeSchedule, setHeatingModeZones } = require("../helpers/HeatingFunctions");
const { isClimateControlAuto, setClimateControlAuto, getHeatingSchedule, setHeatingSchedule } = require("../helpers/StorageDrivers/ClimateControl");
const { setRoomSetpoints } = require("../helpers/StorageDrivers/Conditions");

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
  Manual
*/
app.get("/api/ci/manual", (req, res) => {
  const data = getStore("Environmental Data");

  if (data.heatingMode === "schedule") {
    data.heatingSchedule.auto = false;
  } else if (data.heatingMode === "zones") {
    data.climateControl.isAuto = false;
  }

  setStore("Environmental Data", data);
  sendEnvironmentalData();
  res.end(null);
});

app.get("/api/ci/auto", (req, res) => {
  const data = getStore("Environmental Data");

  if (data.heatingMode === "schedule") {
    data.heatingSchedule.auto = true;
  } else if (data.heatingMode === "zones") {
    data.climateControl.isAuto = true;
  }

  setStore("Environmental Data", data);
  sendEnvironmentalData();
  res.end(null);
});

/*
  On / Off
*/
app.get("/api/ci/on", (req, res) => {
  const data = getStore("Environmental Data");

  if (data.heatingMode === "schedule") {
    console.log("Schedule Heating On");
  } else if (data.heatingMode === "zones") {
    console.log("Zones Heating On");
  }

  res.end(null);
});

app.get("/api/ci/off", (req, res) => {
  const data = getStore("Environmental Data");

  if (data.heatingMode === "schedule") {
    console.log("Schedule Heating Off");
  } else if (data.heatingMode === "zones") {
    console.log("Zones Heating Off");
  }
  res.end(null);
});

/*
  Heating Modes
*/
app.get("/api/ci/mode/zones", (req, res) => {
  sendEnvironmentalData();
  setHeatingModeZones();
  res.end(null);
});

app.get("/api/ci/mode/schedule", (req, res) => {
  setHeatingModeSchedule();
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

app.post("/api/ci/setpoints", (req, res) => {
  setRoomSetpoints(req.body.room, req.body.vals);
  sendEnvironmentalData();
  res.end(null);
});
