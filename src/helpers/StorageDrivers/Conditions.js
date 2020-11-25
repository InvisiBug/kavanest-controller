const { getStore, setStore } = require("./LowLevelDriver");

// Conditions
const getRoomConditions = (room) => {
  return getStore("Environmental Data").heatingSensors[room];
};

const getRoomTemperature = (room) => {
  return getStore("Environmental Data").heatingSensors[room].temperature;
};

const getRoomSetpoints = (room) => {
  return getStore("Environmental Data").setpoints[room];
};

module.exports = {
  getRoomConditions: getRoomConditions,
  getRoomTemperature: getRoomTemperature,
  getRoomSetpoints: getRoomSetpoints,
};
