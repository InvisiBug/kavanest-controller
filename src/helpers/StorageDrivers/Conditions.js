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

const setRoomSetpoints = (room, vals) => {
  let environmentalData = getStore("Environmental Data");

  environmentalData = {
    ...environmentalData,
    setpoints: {
      ...environmentalData.setpoints,
      [room]: vals,
    },
  };

  // console.log(environmentalData);

  setStore("Environmental Data", environmentalData);
};

// setRoomSetpoints("kitchen", [2, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 24]);

module.exports = {
  getRoomConditions: getRoomConditions,
  getRoomTemperature: getRoomTemperature,
  getRoomSetpoints: getRoomSetpoints,
  setRoomSetpoints: setRoomSetpoints,
};
