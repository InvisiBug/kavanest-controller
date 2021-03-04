const { setHeatingTimers, getHeatingTimers } = require("../StorageDrivers/LowLevelDriver");
const { offsetTimeMins } = require("../Time");

const updateBoostTime = (time = 0) => {
  setHeatingTimers("boost", offsetTimeMins(time));
};

const updateRadiatorFanTime = (time = 0) => {
  let val = 0;
  if (time === "on") {
    val = 9999;
  } else if (time === "off") {
    val = 0;
  } else if (time === "overrun") {
    val = 20;
  }

  setHeatingTimers("fan", offsetTimeMins(val));
};

const updateHeatingTime = (time = 0) => {
  setHeatingTimers("heating", offsetTimeMins(time));
};

const getRadiatorFanTime = () => {
  return getHeatingTimers().fan;
};

const getBoostTime = () => {
  return getHeatingTimers().boost;
};

const getHeatingTime = () => {
  return getHeatingTimers().heating;
};

module.exports = {
  updateBoostTime,
  updateRadiatorFanTime,
  updateHeatingTime,
  getRadiatorFanTime,
  getBoostTime,
  getHeatingTime,
};

updateRadiatorFanTime();
