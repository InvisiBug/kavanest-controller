const { getEnvironmentalData, setEnvironmentalData } = require("../../../Helpers/StorageDrivers/LowLevelDriver");
const { getRoomSetpoints, getRoomTemperature } = require("../../../Helpers/StorageDrivers/Devices/HeatingSensors");
const { radiatorFanControl, heatingControl } = require("../../Interfaces/Out/mqttOut");
const { scheduleHeating, scheduleRadiatorFan } = require("./ScheduleHeatingController");
const { radiatorFanOff, getHeatingMode } = require("../../../Helpers/HeatingModes/Functions");
const { setZonesDemand, isZoneDemand, isZonesDemand, isZonesAuto } = require("../../../Helpers/HeatingModes/Zones");
const { isRadiatorFanAuto, isRadiatorFanConnected, isRadiatorFanOn, getRadiatorFan } = require("../../../Helpers/StorageDrivers/Devices/RadiatorFan");
const { isHeatingControllerConnected, isHeatingControllerOn } = require("../../../Helpers/StorageDrivers/Devices/HeatingController");
const { camelRoomName } = require("../../../Helpers/Functions");
const { hour } = require("../../../Helpers/Time");

/*
  These are used as a latch to prevent
  messages queuing due to the setTimeout().
  Messages are queued everytime the functions are run
  while the set timeout is waiting, all these messages
  then get sent later regardless of what the systems state 
*/
// TODO, Come up with a better way for dealing with this
var fan = false;
var heat = false;

const zoneHeating = () => {
  const heatingControllerConnected = isHeatingControllerConnected();
  const zonesDemand = isZonesDemand();
  const heatingOn = isHeatingControllerOn();

  if (heatingControllerConnected) {
    if (zonesDemand) {
      if (!heatingOn) {
        if (!heat) {
          heat = true;
          setTimeout(() => {
            heatingControl("1");
          }, 2 * 1000);
        }
      }
    } else if (heatingOn) {
      heat = false;
      heatingControl("0");
    }
  }
};

const zoneRadiatorFan = () => {
  console.log(fan);
  const ourRoomDemand = isZoneDemand("ourRoom");

  const radiatorFan = getRadiatorFan();

  const on = radiatorFan.isOn;
  const connected = radiatorFan.isConnected;
  const auto = radiatorFan.isAutomatic;

  if (connected && auto) {
    if (ourRoomDemand && !on) {
      fan = false;
      radiatorFanControl("1");
    } else if (!ourRoomDemand && on) {
      console.log("Here");
      if (!fan) {
        fan = true;
        setTimeout(() => {
          console.log("Radiator Fan Off 1");
          radiatorFanControl("0");
        }, 2 * 1000);
      }
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
