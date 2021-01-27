const { updateValue, getStore } = require("../StorageDrivers/LowLevelDriver");

const getHeatingMode = () => {
  const data = getStore("Environmental Data");
  return data.heatingMode;
};

const setHeatingModeSchedule = () => {
  updateValue("Environmental Data", "heatingMode", "schedule");
};

const setHeatingModeZones = () => {
  updateValue("Environmental Data", "heatingMode", "zones");
};

const setHeatingModeManual = () => {
  updateValue("Environmental Data", "heatingMode", "manual");
};

module.exports = {
  setHeatingModeZones: setHeatingModeZones,
  setHeatingModeSchedule: setHeatingModeSchedule,
  setHeatingModeManual: setHeatingModeManual,
  getHeatingMode: getHeatingMode,
};
