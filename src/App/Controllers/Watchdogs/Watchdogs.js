const express = require("express");
var app = (module.exports = express());
const { getStore, setStore, updateValue } = require("../../../helpers/StorageDrivers/LowLevelDriver");
const { isValveOpen, getValveState } = require("../../../helpers/StorageDrivers/Valves");
const { radiatorFanControl, heatingControl } = require("../../Interfaces/out/mqttOut");
const { now } = require("../../../helpers/Time");

setInterval(() => {
  const auto = getStore("Environmental Data").climateControl.isAuto;

  if (auto) {
    autoSignalHeating();
    autoSignalRadiatorFan();
  } else {
    console.log("Manual Mode");
  }
}, 1 * 1000);

const autoSignalHeating = () => {
  let heatingSchedule = getStore("heatingSchedule");
  let heatingController = getStore("Environmental Data").heatingController;

  if (isValveOpen()) {
    if (heatingController.isConnected && !heatingController.isOn) {
      heatingControl("1");
    }
  } else if (heatingController.isConnected && heatingController.isOn) {
    heatingControl("0");
  }
};

const autoSignalRadiatorFan = () => {
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
};

const scheduleSignalHeating = () => {
  let heatingSchedule = getStore("heatingSchedule");
  let heatingController = getStore("Heating");

  if (now() < heatingSchedule.heatingTime) {
    if (heatingController.isConnected && !heatingController.isOn) {
      client.publish("Heating Control", "1");
    }
  } else if (heatingController.isConnected && heatingController.isOn) {
    client.publish("Heating Control", "0");
  }
};

const scheduleSignalRadiatorFan = () => {
  let radiatorFan = getStore("Radiator Fan");
  let heating = getStore("heatingSchedule");

  if (radiatorFan.isAutomatic) {
    if (now() < heating.radiatorFanTime) {
      if (radiatorFan.isConnected && !radiatorFan.isOn) {
        client.publish("Radiator Fan Control", "1");
      }
    } else if (radiatorFan.isConnected && radiatorFan.isOn) {
      client.publish("Radiator Fan Control", "0");
    }
  }
};
