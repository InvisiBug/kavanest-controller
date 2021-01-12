/* 
  * NB *
  The timers here may cause issues if they are too short 
  the system uses file system sync which references files 
  which have to be qued for reading and writing
  if the file is accessed too quickly there may be issues
*/
const { getRoomSetpoints, getRoomTemperature } = require("../../Helpers/StorageDrivers/Devices/HeatingSensors");
const { setValveDemand, getValveStatus } = require("../../Helpers/StorageDrivers/Devices/Valves");
const { openValve, closeValve } = require("../Interfaces/Out/Valves");
const { camelRoomName } = require("../../Helpers/Functions");
const { hour } = require("../../Helpers/Time");
const { getStore, getEnvironmentalData } = require("../../Helpers/StorageDrivers/LowLevelDriver");
const { getHeatingMode } = require("../../Helpers/HeatingModes/Functions");
const { setZonesDemand, isZoneDemand, isZonesDemand } = require("../../Helpers/HeatingModes/Zones");

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
