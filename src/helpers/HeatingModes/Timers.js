const { setHeatingTimers, getHeatingTimers } = require("../StorageDrivers/LowLevelDriver");
const { offsetTimeMins } = require("../Time");

const updateBoostTime = (time = 0) => {
  setHeatingTimers("boost", offsetTimeMins(time));
};

const updateRadiatorFanTime = (time = 0) => {
  setHeatingTimers("fan", offsetTimeMins(time));
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

// console.log(getRadiatorFanTime() - new Date());
// console.log(getRadiatorFanTime());

module.exports = {
  updateBoostTime: updateBoostTime,
  updateRadiatorFanTime: updateRadiatorFanTime,
  updateHeatingTime: updateHeatingTime,
  getRadiatorFanTime: getRadiatorFanTime,
  getBoostTime: getBoostTime,
  getHeatingTime: getHeatingTime,
};

updateRadiatorFanTime();
