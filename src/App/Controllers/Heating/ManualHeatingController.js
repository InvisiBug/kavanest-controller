const { getHeatingController } = require("../../../Helpers/HeatingModes/Functions");
const { getStore } = require("../../../Helpers/StorageDrivers/LowLevelDriver");
const { getManualHeating } = require("../../../Helpers/HeatingModes/Manual");
const { getScheduleHeating } = require("../../../Helpers/HeatingModes/Schedule");
const { radiatorFanControl, heatingControl } = require("../../Interfaces/Out/mqttOut");

const checkFan = () => {
  let radiatorFan = getStore("Radiator Fan");
  let heating = getScheduleHeating(); // * Changed from getManualHeating, manual & schedule radiator cfan now use same control point

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

const checkHeating = () => {
  let heatingController = getHeatingController();
  let heating = getScheduleHeating();

  if (heatingController.isConnected) {
    if (new Date() < heating.heatingTime) {
      if (!heatingController.isOn) {
        heatingControl("1");
      }
    } else {
      if (heatingController.isOn) {
        heatingControl("0");
      }
    }
  }
};

module.exports = {
  checkFan: checkFan,
  checkHeating: checkHeating,
};
