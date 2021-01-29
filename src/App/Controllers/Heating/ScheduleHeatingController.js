const { isHeatingControllerConnected, isHeatingControllerOn } = require("../../../Helpers/StorageDrivers/Devices/HeatingController");
const { getRadiatorFanTime, getBoostTime, getHeatingTime } = require("../../../Helpers/HeatingModes/Timers");
const { heatingOn, heatingOff, getScheduleHeating } = require("../../../Helpers/HeatingModes/Schedule");
const { radiatorFanControl, heatingControl } = require("../../Interfaces/Out/mqttOut");
const { getStore } = require("../../../Helpers/StorageDrivers/LowLevelDriver");
const { day, now, time, days } = require("../../../Helpers/Time");

const scheduleChecker = () => {
  if (getBoostTime() < now()) {
    if (
      (getScheduleHeating()[days[day()]][0] <= time() && time() <= getScheduleHeating()[days[day()]][1]) || // Seems to be some overlap ie schedule on at 16:02 when should be on at 16:15
      (getScheduleHeating()[days[day()]][2] <= time() && time() <= getScheduleHeating()[days[day()]][3])
    ) {
      heatingOn();
    } else {
      heatingOff();
    }
  }
};

const scheduleHeating = () => {
  if (now() < getHeatingTime()) {
    if (isHeatingControllerConnected() && !isHeatingControllerOn()) {
      heatingControl("1");
    }
  } else if (isHeatingControllerConnected() && isHeatingControllerOn()) {
    heatingControl("0");
  }
};

const scheduleRadiatorFan = () => {
  let radiatorFan = getStore("Radiator Fan");

  if (radiatorFan.isAutomatic && radiatorFan.isConnected) {
    if (now() < getRadiatorFanTime()) {
      if (!radiatorFan.isOn) {
        radiatorFanControl("1");
      }
    } else {
      if (radiatorFan.isOn) {
        radiatorFanControl("0");
      }
    }
  }
};

module.exports = {
  scheduleChecker: scheduleChecker,
  scheduleHeating: scheduleHeating,
  scheduleRadiatorFan: scheduleRadiatorFan,
};
