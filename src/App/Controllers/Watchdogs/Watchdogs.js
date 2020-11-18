const express = require("express");
var app = (module.exports = express());
const { getStore, setStore, updateValue } = require("../../../helpers/StorageDrivers/LowLevelDriver");
const { radiatorFanControl, heatingControl } = require("../../Interfaces/out/mqttOut");
const { now } = require("../../../helpers/Time");

// TODO, Move each watchdog to seperate files
// Heating
setInterval(() => {
  let heatingSchedule = getStore("heatingSchedule");
  let heatingController = getStore("Heating");
  // let valves = getStore("Radiator Valves");

  if (now() < heatingSchedule.heatingTime) {
    // if (valves.livingRoom || valves.kitchen || valves.liamsRoom || valves.study || valves.ourRoom) {
    if (heatingController.isConnected && !heatingController.isOn) {
      heatingControl("1");
    }
    // }
  } else if (heatingController.isConnected && heatingController.isOn) {
    heatingControl("0");
  }
}, 1 * 1000);

// Radiator Fan
setInterval(() => {
  let radiatorFan = getStore("Radiator Fan");
  let heating = getStore("heatingSchedule");
  // let valves = getStore("Radiator Valves");

  if (radiatorFan.isAutomatic) {
    if (now() < heating.radiatorFanTime) {
      if (radiatorFan.isConnected && !radiatorFan.isOn) {
        radiatorFanControl("1");
      }
    } else if (radiatorFan.isConnected && radiatorFan.isOn) {
      radiatorFanControl("0");
    }
  }
}, 1 * 1000);

setInterval(() => {
  // grab valve demand
  // grab valve state
  // if demand is less than state then change state
}, 1 * 1000);
