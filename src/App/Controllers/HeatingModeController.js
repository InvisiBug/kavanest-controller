const express = require("express");
var app = (module.exports = express());
const { getStore, setStore } = require("../../helpers/StorageDrivers/LowLevelDriver");
const { heatingScheduleChecker, scheduleSignalHeating, scheduleSignalRadiatorFan } = require("./ScheduleHeatingController");
const { autoSignalHeating, autoSignalRadiatorFan } = require("./ZoneHeatingController");

setInterval(() => {
  const mode = getStore("Environmental Data").heatingMode;

  if (mode === "zones") {
    console.log("Zones");
    autoSignalHeating();
    autoSignalRadiatorFan();
  } else if (mode === "schedule") {
    console.log("Schedule");
    heatingScheduleChecker();
    scheduleSignalHeating();
    scheduleSignalRadiatorFan();
  }
}, 1 * 1000);
