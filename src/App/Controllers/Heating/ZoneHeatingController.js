const { getRoomSetpoints, getRoomTemperature } = require("../../../Helpers/StorageDrivers/Devices/HeatingSensors");
const { radiatorFanControl, heatingControl } = require("../../Interfaces/Out/mqttOut");
const { setZonesDemand, isZoneDemand, isZonesDemand } = require("../../../Helpers/HeatingModes/Zones");
const { isRadiatorFanAuto, isRadiatorFanConnected, isRadiatorFanOn } = require("../../../Helpers/StorageDrivers/Devices/RadiatorFan");
const { isHeatingControllerConnected, isHeatingControllerOn } = require("../../../Helpers/StorageDrivers/Devices/HeatingController");
const { camelRoomName } = require("../../../Helpers/Functions");
const { hour, now } = require("../../../Helpers/Time");
const { getRadiatorFanTime, getHeatingTime, updateHeatingTime, updateRadiatorFanTime } = require("../../../Helpers/HeatingModes/Timers");

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
      updateRadiatorFanTime(9999); // Start radiator fan
    } else if (getRadiatorFanTime() - now() > overrunTime) {
      updateRadiatorFanTime(20); // Start radiator fan overrun
    }
    updateHeatingTime(99999); // Start heating
  } else {
    updateHeatingTime(0); // Stop heating
    if (getRadiatorFanTime() - now() > overrunTime) {
      // ! Not sure
      updateRadiatorFanTime(20); // Start radiator fan overrun
    }
  }
};

/*
  Is our radfan in auto and connected
    Is now before turn off time
      Is radfan off
        - Turn radfan on
    else
      Is radfan on
        - Turn radFan off
*/
const zoneRadiatorFan = () => {
  if (isRadiatorFanAuto() && isRadiatorFanConnected()) {
    if (new Date() < getRadiatorFanTime()) {
      if (!isRadiatorFanOn()) {
        radiatorFanControl("1");
      }
    } else {
      if (isRadiatorFanOn()) {
        radiatorFanControl("0");
      }
    }
  }
};

const zoneHeating = () => {
  if (now() < getHeatingTime() && isHeatingControllerConnected()) {
    if (!isHeatingControllerOn()) {
      heatingControl("1");
    }
  } else if (isHeatingControllerOn()) {
    heatingControl("0");
  }
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

module.exports = {
  zoneDemandChecker: zoneDemandChecker,
  zoneRadiatorFan: zoneRadiatorFan,
  roomDemandSetter: roomDemandSetter,
  zoneHeating: zoneHeating,
};
