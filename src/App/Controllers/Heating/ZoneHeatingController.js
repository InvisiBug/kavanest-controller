const { getStore, getEnvironmentalData } = require("../../../helpers/StorageDrivers/LowLevelDriver");
const { isValveOpen, getValveState } = require("../../../helpers/StorageDrivers/Valves");
const { radiatorFanControl, heatingControl } = require("../../Interfaces/out/mqttOut");
const { scheduleHeating, scheduleRadiatorFan } = require("./ScheduleHeatingController");
const { radiatorFanOff } = require("../../../helpers/HeatingFunctions");

const zoneHeating = () => {
  const heatingController = getStore("Environmental Data").heatingController;
  const environmentalData = getEnvironmentalData();

  if (environmentalData.climateControl.isAuto && isValveOpen()) {
    if (heatingController.isConnected && !heatingController.isOn) {
      heatingControl("1");
    }
  } else if (heatingController.isConnected && heatingController.isOn) {
    heatingControl("0");
  }
};

const zoneRadiatorFan = () => {
  const radiatorFan = getStore("Radiator Fan");
  const ourRoomValve = getValveState("ourRoom");
  const environmentalData = getEnvironmentalData();
  var timer;

  if (environmentalData.climateControl.isAuto && radiatorFan.isAutomatic) {
    if (isValveOpen()) {
      if (radiatorFan.isConnected && !radiatorFan.isOn) {
        radiatorFanControl("1");
        clearTimeout(timer);
      }
    } else if (radiatorFan.isConnected && radiatorFan.isOn) {
      timer = setTimeout(() => {
        radiatorFanControl("0");
      }, 15 * 60 * 1000);
    }
  }
};

radiatorFanOff();

const zoneManualOverride = () => {
  const environmentalData = getEnvironmentalData();
  if (!environmentalData.climateControl.isAuto) {
    scheduleHeating();
    scheduleRadiatorFan();
  }
};

module.exports = {
  zoneHeating: zoneHeating,
  zoneRadiatorFan: zoneRadiatorFan,
  zoneManualOverride: zoneManualOverride,
};
