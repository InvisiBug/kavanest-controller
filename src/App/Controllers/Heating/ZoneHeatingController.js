const { getRoomSetpoints, getRoomTemperature } = require("../../../Helpers/StorageDrivers/Devices/HeatingSensors");
const { radiatorFanControl, heatingControl } = require("../../Interfaces/Out/mqttOut");
const { setZonesDemand, isZoneDemand, isZonesDemand } = require("../../../Helpers/HeatingModes/Zones");
const { isRadiatorFanAuto, isRadiatorFanConnected, isRadiatorFanOn } = require("../../../Helpers/StorageDrivers/Devices/RadiatorFan");
const { isHeatingControllerConnected, isHeatingControllerOn } = require("../../../Helpers/StorageDrivers/Devices/HeatingController");
const { camelRoomName } = require("../../../Helpers/Functions");
const { hour, now } = require("../../../Helpers/Time");
const { getRadiatorFanTime, getHeatingTime, updateHeatingTime, updateRadiatorFanTime } = require("../../../Helpers/HeatingModes/Timers");

const zoneDemandChecker = () => {
  if (isZonesDemand()) {
    if (isZoneDemand("ourRoom")) {
      updateRadiatorFanTime(9999);
    } else if (getRadiatorFanTime() - now() > 1199998) {
      updateRadiatorFanTime(20);
    }
    updateHeatingTime(99999);
  } else {
    updateHeatingTime(0);
    if (getRadiatorFanTime() - now() > 1199998) {
      updateRadiatorFanTime(20);
    }
  }
};

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
