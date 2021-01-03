const { getEnvironmentalData } = require("../../../helpers/StorageDrivers/LowLevelDriver");
const { getRoomSetpoints, getRoomTemperature } = require("../../../helpers/StorageDrivers/Conditions");
const { radiatorFanControl, heatingControl } = require("../../Interfaces/Out/mqttOut");
const { scheduleHeating, scheduleRadiatorFan } = require("./ScheduleHeatingController");
const { radiatorFanOff, getHeatingMode } = require("../../../helpers/HeatingFunctions");
const { setZonesDemand, isZoneDemand, isZonesDemand, isZonesAuto } = require("../../../helpers/StorageDrivers/Zones");
const { isRadiatorFanAuto, isRadiatorFanConnected, isRadiatorFanOn } = require("../../../helpers/StorageDrivers/RadiatorFan");
const { isHeatingControllerConnected, isHeatingControllerOn } = require("../../../helpers/StorageDrivers/HeatingController");
const { camelRoomName } = require("../../../helpers/Functions");
const { hour } = require("../../../helpers/Time");

const zoneHeating = () => {
  if (isZonesAuto()) {
    if (isZonesDemand()) {
      if (isHeatingControllerConnected() && !isHeatingControllerOn()) {
        heatingControl("1");
      }
    } else if (isHeatingControllerConnected() && isHeatingControllerOn()) {
      heatingControl("0");
    }
  }
};

const zoneRadiatorFan = () => {
  if (isZonesAuto() && isRadiatorFanAuto()) {
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

radiatorFanOff();

const zoneManualOverride = () => {
  if (!isZonesAuto()) {
    scheduleHeating();
    scheduleRadiatorFan();
  }
};

const checkRoomDemand = (room) => {
  const environmentalData = getEnvironmentalData();
  const auto = environmentalData.heatingZones.isAuto;
  const mode = getHeatingMode();

  let setpoint = getRoomSetpoints(camelRoomName(room));
  let currentTemp = getRoomTemperature(camelRoomName(room));

  if (auto && mode === "zones") {
    if (currentTemp < setpoint[hour()] && currentTemp > -1) {
      // ! the -1 bit may need to open the valve, fail safe
      setZonesDemand(camelRoomName(room), true);
    } else {
      setZonesDemand(camelRoomName(room), false);
    }
  } else {
    setZonesDemand(camelRoomName(room), true);
  }
  // console.log(`${room} \t Current Temp: ${currentTemp} \t Target Temp: ${setpoint[hour()]}`);
};

module.exports = {
  zoneHeating: zoneHeating,
  zoneRadiatorFan: zoneRadiatorFan,
  zoneManualOverride: zoneManualOverride,
  checkRoomDemand: checkRoomDemand,
};
