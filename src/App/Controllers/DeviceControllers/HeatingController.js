// Radiator fan and heating controller below will be moved to their own controller
const { isHeatingControllerConnected, isHeatingControllerOn } = require("../../../Helpers/StorageDrivers/Devices/HeatingController");
const { radiatorFanControl, heatingControl } = require("../../Interfaces/Out/mqttOut");
const { getRadiatorFanTime, getBoostTime, getHeatingTime } = require("../../../Helpers/HeatingModes/Timers");
const { hour, now } = require("../../../Helpers/Time");

const heatingController = () => {
  if (now() < getHeatingTime() && isHeatingControllerConnected()) {
    if (!isHeatingControllerOn()) {
      heatingControl("1");
    }
  } else if (isHeatingControllerOn()) {
    heatingControl("0");
  }
};

module.exports = { heatingController };
