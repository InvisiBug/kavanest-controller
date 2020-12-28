const fs = require("fs");
const path = require("path");
// const { getHeatingSchedule, setHeatingSchedule } = require("./ClimateControl");

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

const getEnvironmentalData = () => {
  return getStore("Environmental Data");
};

module.exports = {
  getStore: getStore,
  setStore: setStore,
  updateValue: updateValue,
  readValue: readValue,
};
