const express = require("express");
var app = (module.exports = express());
const { getStore, setStore, updateValue } = require("../../../helpers/StorageDriver");
const { radiatorFanControl, heatingControl } = require("../../Interfaces/mqttOut");

// TODO, Move each watchdog to seperate files
// Heating
setInterval(() => {
  let heatingSchedule = getStore("heatingSchedule");
  let heatingController = getStore("Heating");
  let now = new Date().getTime();

  if (now < heatingSchedule.heatingTime) {
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
  let heating = getStore("heatingSchedule");
  let now = new Date().getTime();

  if (radiatorFan.isAutomatic) {
    if (now < heating.radiatorFanTime) {
      if (radiatorFan.isConnected && !radiatorFan.isOn) {
        radiatorFanControl("1");
      }
    } else if (radiatorFan.isConnected && radiatorFan.isOn) {
      radiatorFanControl("0");
    }
  }
}, 1 * 1000);
