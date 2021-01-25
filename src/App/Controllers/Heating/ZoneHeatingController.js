const { getEnvironmentalData, setEnvironmentalData } = require("../../../Helpers/StorageDrivers/LowLevelDriver");
const { getRoomSetpoints, getRoomTemperature } = require("../../../Helpers/StorageDrivers/Devices/HeatingSensors");
const { radiatorFanControl, heatingControl } = require("../../Interfaces/Out/mqttOut");
const { scheduleHeating, scheduleRadiatorFan } = require("./ScheduleHeatingController");
const { radiatorFanOff, getHeatingMode } = require("../../../Helpers/HeatingModes/Functions");
const { setZonesDemand, isZoneDemand, isZonesDemand, isZonesAuto } = require("../../../Helpers/HeatingModes/Zones");
const { isRadiatorFanAuto, isRadiatorFanConnected, isRadiatorFanOn } = require("../../../Helpers/StorageDrivers/Devices/RadiatorFan");
const { isHeatingControllerConnected, isHeatingControllerOn } = require("../../../Helpers/StorageDrivers/Devices/HeatingController");
const { camelRoomName } = require("../../../Helpers/Functions");
const { hour } = require("../../../Helpers/Time");

const zoneHeating = () => {
  if (isZonesDemand()) {
    if (isHeatingControllerConnected() && !isHeatingControllerOn()) {
      heatingControl("1");
    }
  } else if (isHeatingControllerConnected() && isHeatingControllerOn()) {
    heatingControl("0");
  }
};

const zoneRadiatorFan = () => {
  if (isRadiatorFanAuto()) {
    if (isZoneDemand("ourRoom")) {
      if (isRadiatorFanConnected() && !isRadiatorFanOn()) {
        radiatorFanControl("1");
      }
    } else if (isRadiatorFanConnected() && isRadiatorFanOn()) {
      setTimeout(() => {
        radiatorFanControl("0");
      }, 2 * 1000);
    }
  }
};

const checkRoomDemand = (room) => {
  let setpoint = getRoomSetpoints(camelRoomName(room));
  let currentTemp = getRoomTemperature(camelRoomName(room));
  const hysteresis = 1;

  if (currentTemp < setpoint[hour()] - hysteresis) {
    setZonesDemand(room, true);
  } else if (currentTemp > setpoint[hour()]) {
    setZonesDemand(room, false);
  }
};

module.exports = {
  zoneHeating: zoneHeating,
  zoneRadiatorFan: zoneRadiatorFan,
  checkRoomDemand: checkRoomDemand,
};
