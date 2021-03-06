const { camelRoomName } = require("../../Functions");
const { getStore, setStore } = require("../LowLevelDriver");

const getRoomHeatingSensor = (room) => {
  return getStore("Environmental Data").heatingSensors[room];
};

const getRoomTemperature = (room) => {
  return getStore("Environmental Data").heatingSensors[room].temperature;
};

const getRoomSetpoints = (room) => {
  let weekday = new Date().getDay() === 6 || new Date().getDay() === 0 ? "weekend" : "weekday";
  return getStore("Environmental Data").setpoints[weekday][room];
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

const broadcastOffsets = () => {
  setInterval(() => {
    var data = {
      "Living Room": getRoomOffset(camelRoomName("Living Room")),
      Kitchen: getRoomOffset(camelRoomName("Kitchen")),
      "Liams Room": getRoomOffset(camelRoomName("Liams Room")),
      Study: getRoomOffset(camelRoomName("Study")),
      "Our Room": getRoomOffset(camelRoomName("Our Room")),
    };
    client.publish(`Room Offsets`, JSON.stringify(data));
  }, 60 * 1000);
};

broadcastOffsets();

module.exports = {
  getRoomHeatingSensor: getRoomHeatingSensor,
  getRoomTemperature: getRoomTemperature,
  getRoomSetpoints: getRoomSetpoints,
  setRoomSetpoints: setRoomSetpoints,
  setRoomOffset: setRoomOffset,
  getRoomOffset: getRoomOffset,
};
