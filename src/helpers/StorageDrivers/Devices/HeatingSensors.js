const { getStore, setStore } = require("../LowLevelDriver");

const getRoomHeatingSensor = (room) => {
  return getStore("Environmental Data").heatingSensors[room];
};

const getRoomTemperature = (room) => {
  return getStore("Environmental Data").heatingSensors[room].temperature;
};

const getRoomSetpoints = (room) => {
  return getStore("Environmental Data").setpoints[room];
};

const setRoomSetpoints = (room, vals) => {
  let environmentalData = getStore("Environmental Data");

  environmentalData = {
    ...environmentalData,
    setpoints: {
      ...environmentalData.setpoints,
      [room]: vals,
    },
  };

  setStore("Environmental Data", environmentalData);
};

const setRoomOffset = (room, value) => {
  let environmentalData = getStore("Environmental Data");
  environmentalData.offsets[room] = parseFloat(value);
  setStore("Environmental Data", environmentalData);
};

const getRoomOffset = (room) => {
  let environmentalData = getStore("Environmental Data");
  return environmentalData.offsets[room];
};

module.exports = {
  getRoomHeatingSensor: getRoomHeatingSensor,
  getRoomTemperature: getRoomTemperature,
  getRoomSetpoints: getRoomSetpoints,
  setRoomSetpoints: setRoomSetpoints,
  setRoomOffset: setRoomOffset,
  getRoomOffset: getRoomOffset,
};
