const { isRadiatorFanConnected, isRadiatorFanOn, isRadiatorFanAuto } = require("../../../Helpers/StorageDrivers/Devices/RadiatorFan");
const { isHeatingControllerConnected, isHeatingControllerOn } = require("../../../Helpers/StorageDrivers/Devices/HeatingController");
const { getHeatingTime, getRadiatorFanTime } = require("../../../Helpers/HeatingModes/Timers");
const { radiatorFanControl, heatingControl } = require("../../Interfaces/Out/mqttOut");
const { now } = require("../../../Helpers/Time");

const checkFan = () => {
  if (isRadiatorFanAuto() && isRadiatorFanConnected()) {
    if (now() < getRadiatorFanTime()) {
      if (!isRadiatorFanOn()) {
        radiatorFanControl("1");
      }
    } else {
      if (isRadiatorFanOn()) {
        radiatorFanControl("0");
      }
    }
  }
};

const checkHeating = () => {
  if (isHeatingControllerConnected()) {
    if (now() < getHeatingTime()) {
      if (!isHeatingControllerOn()) {
        heatingControl("1");
      }
    } else {
      if (isHeatingControllerOn()) {
        heatingControl("0");
      }
    }
  }
};

module.exports = {
  checkFan: checkFan,
  checkHeating: checkHeating,
};
