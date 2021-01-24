const { getStore, setStore, getEnvironmentalData } = require("../StorageDrivers/LowLevelDriver");

const isHeatingScheduleAuto = () => {
  const data = getEnvironmentalData();
  return data.heatingSchedule.auto;
};

const setHeatingScheduleAuto = () => {
  const data = getEnvironmentalData();
  data.heatingSchedule.auto = true;
  setStore("Environmental Data", data);
};

const setHeatingScheduleManual = () => {
  const data = getEnvironmentalData();
  data.heatingSchedule.auto = false;
  setStore("Environmental Data", data);
};

const getScheduleHeating = () => {
  const heatingSchedule = getStore("Environmental Data").heatingSchedule;
  return heatingSchedule;
};

const setHeatingSchedule = (data) => {
  let oldData = getStore("Environmental Data");

  setStore("Environmental Data", {
    ...oldData,
    heatingSchedule: data,
  });
};

module.exports = {
  getScheduleHeating: getScheduleHeating,
  setHeatingSchedule: setHeatingSchedule,
  isHeatingScheduleAuto: isHeatingScheduleAuto,
  setHeatingScheduleAuto: setHeatingScheduleAuto,
  setHeatingScheduleManual: setHeatingScheduleManual,
};
