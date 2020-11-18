const fs = require("fs");
const path = require("path");
const { offsetTime } = require("../Time");

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
  } catch (e) {
    console.log(e);
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
  // let data = getStore(store);
  // return data[point];

  return getStore(store)[point];
};

const updateBoostTime = (time = 0) => {
  updateValue("heatingSchedule", "boostTime", offsetTime(time));
};

const updateRadiatorFanTime = (time = 0) => {
  let now = new Date();
  updateValue("heatingSchedule", "radiatorFanTime", offsetTime(time));
};

const updateHeatingTime = (time = 0) => {
  let now = new Date();
  updateValue("heatingSchedule", "heatingTime", offsetTime(time));
};

// Valves

module.exports = {
  getStore: getStore,
  setStore: setStore,
  updateValue: updateValue,
  readValue: readValue,
  updateBoostTime: updateBoostTime,
  updateRadiatorFanTime: updateRadiatorFanTime,
  updateHeatingTime: updateHeatingTime,
  // getRoomSetpoints: getRoomSetpoints,
  // getRoomConditions: getRoomConditions,
  // getRoomTemperature: getRoomTemperature,
};
