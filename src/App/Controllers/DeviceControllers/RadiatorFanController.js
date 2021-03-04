const { isRadiatorFanAuto, isRadiatorFanConnected, isRadiatorFanOn } = require("../../../Helpers/StorageDrivers/Devices/RadiatorFan");
const { radiatorFanControl, heatingControl } = require("../../Interfaces/Out/mqttOut");
const { getRadiatorFanTime, getBoostTime, getHeatingTime } = require("../../../Helpers/HeatingModes/Timers");
const { now } = require("../../../Helpers/Time");
/*
  Is our radfan in auto and connected
    Is now before turn off time
      Is radfan off
        - Turn radfan on
    else
      Is radfan on
        - Turn radFan off
*/
const radiatorFanController = () => {
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

module.exports = { radiatorFanController };
