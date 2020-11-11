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
// app.post("/api/ci/outside/set",  (req, res) => {
//   console.log(req.body);
//   await storage.init();
//   await storage.setItem("outsideSetpoint", req.body);

//   res.end(null);
// });

// app.get("/api/ci/outside/get",  () => {
//   await storage.init();

//   try {
//     x = await storage.getItem("outsideSetpoint");
//     data = x.value;

//     res.json(data);
//   } catch (e) {
//     console.log(e);
//   }
// });
// -----  Schedule  -----
app.post("/api/ci/schedule/update", (req, res) => {
  setStore("heatingSchedule", frontendToBackend(req.body.data));
  sendHeatingSchedule();
  res.end(null);
});

// ----------  Boost  ----------
app.get("/api/ci/boost/on", (req, res) => {
  boostOn();
  sendHeatingSchedule();
  res.end(null);
});

app.get("/api/ci/boost/off", (req, res) => {
  boostOff();
  sendHeatingSchedule();
  res.end(null);
});

// -----  Manual  -----
app.get("/api/ci/manual/on", (req, res) => {
  updateValue("heatingSchedule", "auto", false);
  sendHeatingSchedule();
  res.end(null);
});

app.get("/api/ci/manual/off", (req, res) => {
  updateValue("heatingSchedule", "auto", true);
  sendHeatingSchedule();
  res.end(null);
});

// ----- On / Off -----
app.get("/api/ci/on", (req, res) => {
  let data = getStore("heatingSchedule");
  if (!data.auto) {
    // Open all valves here
    heatingOn();
    sendHeatingSchedule();
  }
  res.end(null);
});

app.get("/api/ci/off", (req, res) => {
  let data = getStore("heatingSchedule");
  if (!data.auto) {
    // close all valves here
    console.log("heating Off");
    heatingOff();
    sendHeatingSchedule();
  }
  sendHeatingSchedule();
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
