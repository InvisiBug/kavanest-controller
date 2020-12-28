const { get } = require("../../App/Calor Imperium");
const { getStore, setStore, updateValue } = require("./LowLevelDriver");

const setClimateControl = (point = null, value = null) => {
  let environmentalData = getStore("Environmental Data");
  environmentalData = {
    ...environmentalData,
    climateControl: {
      ...environmentalData.climateControl,
      [point]: value,
    },
  };

  setStore("Environmental Data", environmentalData);
};

const setClimateControlAuto = (value) => {
  setClimateControl("isAuto", value);
};

const isClimateControlAuto = () => {
  let environmentalData = getStore("Environmental Data").climateControl;
  return environmentalData.isAuto;
};

const getHeatingSchedule = () => {
  let heatingSchedule = getStore("Environmental Data").heatingSchedule;
  return heatingSchedule;
};

const setHeatingSchedule = (data) => {
  let oldData = getStore("Environmental Data");

  setStore("Environmental Data", {
    ...oldData,
    heatingSchedule: data,
  });
};

const getHeatingController = () => {
  let heatingController = getStore("Environmental Data").heatingController;
  return heatingController;
};

module.exports = {
  isClimateControlAuto: isClimateControlAuto,
  setClimateControlAuto: setClimateControlAuto,
  getHeatingSchedule: getHeatingSchedule,
  setHeatingSchedule: setHeatingSchedule,
  getHeatingController: getHeatingController,
};
