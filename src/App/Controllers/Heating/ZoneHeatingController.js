const { getEnvironmentalData, setEnvironmentalData, getStore } = require("../../../Helpers/StorageDrivers/LowLevelDriver");
const { getRoomSetpoints, getRoomTemperature } = require("../../../Helpers/StorageDrivers/Devices/HeatingSensors");
const { radiatorFanControl, heatingControl } = require("../../Interfaces/Out/mqttOut");
const { scheduleHeating, scheduleRadiatorFan } = require("./ScheduleHeatingController");
const { radiatorFanOff, getHeatingMode } = require("../../../Helpers/HeatingModes/Functions");
const { setZonesDemand, isZoneDemand, isZonesDemand, isZonesAuto } = require("../../../Helpers/HeatingModes/Zones");
const { isRadiatorFanAuto, isRadiatorFanConnected, isRadiatorFanOn, getRadiatorFan } = require("../../../Helpers/StorageDrivers/Devices/RadiatorFan");
const { isHeatingControllerConnected, isHeatingControllerOn } = require("../../../Helpers/StorageDrivers/Devices/HeatingController");
const { camelRoomName } = require("../../../Helpers/Functions");
const { hour, now } = require("../../../Helpers/Time");

const { heatingOn, heatingOff, getScheduleHeating, getHeatingController } = require("../../../Helpers/HeatingModes/Schedule");

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

const zoneDemandChecker = () => {
  const heatingControllerConnected = isHeatingControllerConnected();
  const zonesDemand = isZonesDemand();
  // const heatingOn = isHeatingControllerOn();

  if (zonesDemand) {
    console.log("here");
    heatingOn();
  } else {
    heatingOff();
  }
};

const zoneRadiatorFan = () => {
  /*  Currently an issue with the fan not turning off 
  when switching from manual to auto
  */

  // const ourRoomDemand = isZoneDemand("ourRoom");
  // const radiatorFan = getRadiatorFan();

  // const on = radiatorFan.isOn;
  // const connected = radiatorFan.isConnected;
  // const auto = radiatorFan.isAutomatic;

  // if (connected && auto) {
  //   if (ourRoomDemand && !on) {
  //     fan = false;
  //     radiatorFanControl("1");
  //   } else if (!ourRoomDemand && on) {
  //     if (!fan) {
  //       fan = true;
  //       setTimeout(() => {
  //         console.log("Radiator Fan Off 1");
  //         radiatorFanControl("0");
  //       }, 2 * 1000);
  //     }
  //   }
  // }
  let radiatorFan = getStore("Radiator Fan");
  let heating = getScheduleHeating();

  console.log(heating.radiatorFanTime - now());

  if (radiatorFan.isAutomatic && radiatorFan.isConnected) {
    if (new Date() < heating.radiatorFanTime) {
      if (!radiatorFan.isOn) {
        radiatorFanControl("1");
      }
    } else {
      if (radiatorFan.isOn) {
        radiatorFanControl("0");
      }
    }
  }
};

const zoneHeating = () => {
  let heatingSchedule = getScheduleHeating();
  let heatingController = getHeatingController();

  if (now() < heatingSchedule.heatingTime) {
    if (heatingController.isConnected && !heatingController.isOn) {
      client.publish("Heating Control", "1");
    }
  } else if (heatingController.isConnected && heatingController.isOn) {
    client.publish("Heating Control", "0");
  }
};

const roomDemandSetter = (room) => {
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
  zoneDemandChecker: zoneDemandChecker,
  zoneRadiatorFan: zoneRadiatorFan,
  roomDemandSetter: roomDemandSetter,
  zoneHeating: zoneHeating,
};
