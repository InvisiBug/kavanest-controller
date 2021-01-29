const fs = require("fs");
const path = require("path");
// const { getScheduleHeating, setHeatingSchedule } = require("./ClimateControl");

const setStore = (store, data) => {
  const storePath = path.join(`${__dirname}${"/../../../PersistantStorage/"}${store}${".json"}`);
  try {
    fs.writeFileSync(storePath, JSON.stringify(data, null, 0));
  } catch (e) {
    console.log(e);
  }
};

const getStore = (store) => {
  const storePath = path.join(`${__dirname}${"/../../../PersistantStorage/"}${store}${".json"}`);
  try {
    return JSON.parse(fs.readFileSync(storePath));
  } catch (err) {
    console.log(err);
  }
};

const updateValue = (store, point, value) => {
  let data = getStore(store);
  data = {
    ...data,
    [point]: value,
  };
  setStore(store, data);
};

const readValue = (store, point) => {
  return getStore(store)[point];
};

const getEnvironmentalData = () => {
  return getStore("Environmental Data");
};

const setEnvironmentalData = (data) => {
  setStore("Environmental Data", data);
};

const getRadiatorFan = () => {
  return getStore("Radiator Fan");
};

const getHeatingController = () => {
  return getStore("Environmental Data").heatingController;
};

/*
  Heating Timers
*/
const getHeatingTimers = () => {
  return getEnvironmentalData().heatingTimers;
};

const setHeatingTimers = (timer, value) => {
  let data = getEnvironmentalData();
  data.heatingTimers[timer] = value;
  setEnvironmentalData(data);
};

module.exports = {
  getStore: getStore,
  setStore: setStore,
  updateValue: updateValue,
  readValue: readValue,
  getEnvironmentalData: getEnvironmentalData,
  getRadiatorFan: getRadiatorFan,
  setEnvironmentalData: setEnvironmentalData,
  getHeatingTimers: getHeatingTimers,
  setHeatingTimers: setHeatingTimers,
  getHeatingController: getHeatingController,
};
