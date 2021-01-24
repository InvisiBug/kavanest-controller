const { getEnvironmentalData } = require("../../../Helpers/StorageDrivers/LowLevelDriver");
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
    if (isZonesDemand()) {
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

// radiatorFanOff();

const checkRoomDemand = (room) => {
  const environmentalData = getEnvironmentalData();
  const auto = environmentalData.heatingZones.isAuto;
  const mode = getHeatingMode();

  let setpoint = getRoomSetpoints(camelRoomName(room));
  let currentTemp = getRoomTemperature(camelRoomName(room));

  if (auto && mode === "zones") {
    if (currentTemp < setpoint[hour()] && currentTemp > -1) {
      // ! the -1 bit may need to open the valve, fail safe
      setZonesDemand(room, true);
    } else {
      setZonesDemand(room, false);
    }
  } else {
    setZonesDemand(room, true);
  }
  // console.log(`${room} \t Current Temp: ${currentTemp} \t Target Temp: ${setpoint[hour()]}`);
};

module.exports = {
  zoneHeating: zoneHeating,
  zoneRadiatorFan: zoneRadiatorFan,
  checkRoomDemand: checkRoomDemand,
};
