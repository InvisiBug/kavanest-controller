const { getRadiatorFanTime, updateHeatingTime, updateRadiatorFanTime } = require("../../../Helpers/HeatingModes/Timers");
const { getRoomSetpoints, getRoomTemperature } = require("../../../Helpers/StorageDrivers/Devices/HeatingSensors");
const { setZonesDemand, isZoneDemand, isZonesDemand } = require("../../../Helpers/HeatingModes/Zones");
const { isValveConnected } = require("../../../Helpers/StorageDrivers/Devices/Valves");
const { signalValve } = require("../DeviceControllers/ValveController");
const { camelRoomName } = require("../../../Helpers/Functions");
const { hour, now } = require("../../../Helpers/Time");
/*
  1. Check room temperatures and set demands, on a per room basis (roomDemandSetter)
  2. Check room demands and set heating & fan timers accordingly
*/

const zones = (rooms) => {
  rooms.map((room) => {
    checkTempAndSetRoomDemand(room);
  });

  zoneDemandChecker();

  rooms.map((room) => {
    signalValve(room);
  });
};

const checkTempAndSetRoomDemand = (room) => {
  let setpoint = getRoomSetpoints(camelRoomName(room));
  let currentTemp = getRoomTemperature(camelRoomName(room));
  const hysteresis = 0.5;

  if (isValveConnected(camelRoomName(room))) {
    //? A rooms demand will be set to false if that rooms valve disconnects
    //? A rooms demand will also be set to false if the sensor drops off the network
    if (currentTemp < setpoint[hour()] - hysteresis && currentTemp > 0) {
      setZonesDemand(room, true);
    } else if (currentTemp > setpoint[hour()]) {
      setZonesDemand(room, false);
    }
  } else {
    setZonesDemand(room, false);
  }
};

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

module.exports = { zones };
