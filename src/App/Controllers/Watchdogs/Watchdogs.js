const express = require("express");
var app = (module.exports = express());
const { getStore, setStore, updateValue } = require("../../../helpers/StorageDrivers/LowLevelDriver");
const { isValveOpen, getValveState } = require("../../../helpers/StorageDrivers/Valves");
const { radiatorFanControl, heatingControl } = require("../../Interfaces/out/mqttOut");
const { now } = require("../../../helpers/Time");

// TODO, Move each watchdog to seperate files
// Heating
setInterval(() => {
  let heatingSchedule = getStore("heatingSchedule");
  let heatingController = getStore("Environmental Data").heatingController;

  if (isValveOpen()) {
    if (heatingController.isConnected && !heatingController.isOn) {
      heatingControl("1");
    }
  } else if (heatingController.isConnected && heatingController.isOn) {
    heatingControl("0");
  }
}, 1 * 1000);

// Radiator Fan
setInterval(() => {
  let radiatorFan = getStore("Radiator Fan");
  let ourRoomValve = getValveState("ourRoom");

  if (radiatorFan.isAutomatic) {
    if (ourRoomValve) {
      if (radiatorFan.isConnected && !radiatorFan.isOn) {
        radiatorFanControl("1");
      }
    } else if (radiatorFan.isConnected && radiatorFan.isOn) {
      setTimeout(() => radiatorFanControl("0"), 5 * 1000);
    }
  }
}, 1 * 1000);
