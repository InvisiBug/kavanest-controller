const { isValveOpen, isValveConnected } = require("../../Helpers/StorageDrivers/Devices/Valves");
const { openValve, closeValve } = require("../Interfaces/Out/Valves");
const { isZoneDemand } = require("../../Helpers/HeatingModes/Zones");
const { camelRoomName } = require("../../Helpers/Functions");

const newValveController = (room) => {
  setInterval(() => {
    signalValve(room);
  }, 1 * 1000);
};

const signalValve = (room) => {
  if (isValveConnected(camelRoomName(room))) {
    if (isZoneDemand(camelRoomName(room)) && !isValveOpen(camelRoomName(room))) {
      openValve(room);
    } else if (!isZoneDemand(camelRoomName(room)) && isValveOpen(camelRoomName(room))) {
      closeValve(room);
    }
  }
};

module.exports = {
  newValveController: newValveController,
  signalValve: signalValve,
};
