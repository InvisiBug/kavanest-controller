/* 
  * NB *
  The timers here may cause issues if they are too short 
  the system uses file system sync which references files 
  which have to be qued for reading and writing
  if the file is accessed too quickly there may be issues
*/
const { getRoomSetpoints, getRoomTemperature } = require("../../helpers/StorageDrivers/Conditions");
const { setValveDemand, getValveStatus } = require("../../helpers/StorageDrivers/Valves");
const { openValve, closeValve } = require("../Interfaces/Out/Valves");
const { camelRoomName } = require("../../helpers/Functions");
const { hour } = require("../../helpers/Time");
const { getStore, getEnvironmentalData } = require("../../helpers/StorageDrivers/LowLevelDriver");
const { getHeatingMode } = require("../../helpers/HeatingFunctions");
const { setZonesDemand, isZoneDemand, isZonesDemand } = require("../../helpers/StorageDrivers/Zones");

const newValveController = (room) => {
  setInterval(() => {
    signalValve(room);
  }, 1 * 1000);
};

const signalValve = (room) => {
  let valve = getValveStatus(camelRoomName(room));
  if (valve.isConnected) {
    if (isZoneDemand(camelRoomName(room)) && !valve.isOpen) {
      openValve(room);
      // console.log("Opening Valve");
    } else if (!isZoneDemand(camelRoomName(room)) && valve.isOpen) {
      closeValve(room);
      // console.log("Closing Valve");
    }
  }
};

module.exports = {
  newValveController: newValveController,
};
