const { getHeatingController } = require("../../../helpers/HeatingFunctions");
const { getStore } = require("../../../helpers/StorageDrivers/LowLevelDriver");
const { getManualHeating } = require("../../../helpers/StorageDrivers/Manual");
const { radiatorFanControl, heatingControl } = require("../../Interfaces/Out/mqttOut");

const checkFan = () => {
  let radiatorFan = getStore("Radiator Fan");

  if (radiatorFan.isAutomatic && radiatorFan.isConnected) {
    if (getManualHeating().radiatorFanTime > new Date()) {
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

  if (heatingController.isConnected) {
    if (getManualHeating().heatingTime > new Date()) {
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
