const { getRoomSetpoints, getRoomTemperature } = require("../../../Helpers/StorageDrivers/Devices/HeatingSensors");
const { radiatorFanControl, heatingControl } = require("../../Interfaces/Out/mqttOut");
const { setZonesDemand, isZoneDemand, isZonesDemand } = require("../../../Helpers/HeatingModes/Zones");
const { isRadiatorFanAuto, isRadiatorFanConnected, isRadiatorFanOn } = require("../../../Helpers/StorageDrivers/Devices/RadiatorFan");
const { isHeatingControllerConnected, isHeatingControllerOn } = require("../../../Helpers/StorageDrivers/Devices/HeatingController");
const { camelRoomName } = require("../../../Helpers/Functions");
const { hour, now } = require("../../../Helpers/Time");
const { getRadiatorFanTime, getHeatingTime, updateHeatingTime, updateRadiatorFanTime } = require("../../../Helpers/HeatingModes/Timers");
const { signalValve } = require("../DeviceControllers/ValveController");
/*
  1. Check room temperatures and set demands, on a per room basis (roomDemandSetter)
  2. Check room demands and set heating & fan timers accordingly
*/

const zones = (rooms) => {
  zoneDemandChecker();

  rooms.map((room) => {
    roomDemandSetter(room);
  });

  rooms.map((room) => {
    signalValve(room);
  });
};

const roomDemandSetter = (room) => {
  let setpoint = getRoomSetpoints(camelRoomName(room));
  let currentTemp = getRoomTemperature(camelRoomName(room));
  const hysteresis = 0.5;

  if (currentTemp < setpoint[hour()] - hysteresis) {
    setZonesDemand(room, true);
  } else if (currentTemp > setpoint[hour()]) {
    setZonesDemand(room, false);
  }
};

// Heating and radiator fan set here
/* 
  Are any of the rooms calling for heat
    Is it our room
      - Turn on the radiator fan
    Is our room not in overrun
      - Start overrun
    - Start Heating after 3 mins
  else
    - Turn off heating
    Is our room not in overrun 
      - Start overrun
*/
const zoneDemandChecker = () => {
  const overrunTime = 1199998;
  if (isZonesDemand()) {
    // Is a room asking for heat
    if (isZoneDemand("ourRoom")) {
      // Is our room asking for heat
      updateRadiatorFanTime("on"); // Start radiator fan
    } else if (getRadiatorFanTime() - now() > overrunTime) {
      updateRadiatorFanTime("overrun"); // Start radiator fan overrun
    }
    updateHeatingTime(99999); // Start heating
  } else {
    updateHeatingTime(0); // Stop heating
    if (getRadiatorFanTime() - now() > overrunTime) {
      // ! Not sure
      updateRadiatorFanTime("overrun"); // Start radiator fan overrun
    }
  }
};

module.exports = {
  zoneDemandChecker,
  roomDemandSetter,
  zones,
};
