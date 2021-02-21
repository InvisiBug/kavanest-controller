const { isValveOpen, isValveConnected } = require("../../Helpers/StorageDrivers/Devices/Valves");
const { openValve, closeValve } = require("../Interfaces/Out/Valves");
const { isZoneDemand, isZonesDemand } = require("../../Helpers/HeatingModes/Zones");
const { camelRoomName } = require("../../Helpers/Functions");

const newValveController = (room) => {
  setInterval(() => {
    signalValve(room);
  }, 1 * 1000);
};

/* 
  All valves will now open if no rooms are calling for heat,
  all releays are de-energized
  valves are normally open
*/
const signalValve = (room) => {
  if (isZonesDemand() && isValveConnected(camelRoomName(room))) {
    if (isZoneDemand(camelRoomName(room)) && !isValveOpen(camelRoomName(room))) {
      openValve(room);
    } else if (!isZoneDemand(camelRoomName(room)) && isValveOpen(camelRoomName(room))) {
      closeValve(room);
    }
  } else {
    if (isValveConnected(camelRoomName(room)) && !isValveOpen(camelRoomName(room))) {
      openValve(room);
    }
  }
};

module.exports = {
  newValveController: newValveController,
  signalValve: signalValve,
};
