const { getHeatingController } = require("../../../Helpers/HeatingModes/Functions");
const { getStore } = require("../../../Helpers/StorageDrivers/LowLevelDriver");
const { getManualHeating } = require("../../../Helpers/HeatingModes/Manual");
const { getScheduleHeating } = require("../../../Helpers/HeatingModes/Schedule");
const { radiatorFanControl, heatingControl } = require("../../Interfaces/Out/mqttOut");

const checkFan = () => {
  let radiatorFan = getStore("Radiator Fan");
  let heating = getScheduleHeating(); // * Changed from getManualHeating, manual & schedule radiator cfan now use same control point

  const radiatorFanAuto = radiatorFan.isAutomatic;
  const radiatorFanOn = radiatorFan.isOn;
  const radiatorFanConnected = radiatorFan.isConnected;

  if (radiatorFanAuto && radiatorFanConnected) {
    if (new Date() < heating.radiatorFanTime) {
      if (!radiatorFanOn) {
        radiatorFanControl("1");
      }
    } else {
      if (radiatorFanOn) {
        radiatorFanControl("0");
      }
    }
  }
};

const checkHeating = () => {
  let heatingController = getHeatingController();
  let heating = getScheduleHeating();

  const heatingConnected = heatingController.isConnected;
  const heatingOn = heatingController.isOn;

  if (heatingConnected) {
    if (new Date() < heating.heatingTime) {
      if (!heatingOn) {
        heatingControl("1");
      }
    } else {
      if (heatingOn) {
        heatingControl("0");
      }
    }
  }
};

module.exports = {
  checkFan: checkFan,
  checkHeating: checkHeating,
};
