const { getHeatingSchedule, getHeatingController } = require("../../helpers/StorageDrivers/ClimateControl");
const { day, now, time, days } = require("../../helpers/Time");
const { heatingOn, heatingOff } = require("../../helpers/HeatingFunctions");
const { getStore } = require("../../helpers/StorageDrivers/LowLevelDriver");

const heatingScheduleChecker = () => {
  const scheduleData = getHeatingSchedule();

  if (scheduleData.boostTime < now()) {
    if (scheduleData.auto) {
      if (
        (scheduleData[days[day()]][0] <= time() && time() <= scheduleData[days[day()]][1]) || // Seems to be some overlap ie schedule on at 16:02 when should be on at 16:15
        (scheduleData[days[day()]][2] <= time() && time() <= scheduleData[days[day()]][3])
      ) {
        // console.log("Heating On (A)");
        heatingOn(); // On demand from schedule
      } else {
        // console.log("Heating Off (B)");
        heatingOff(); // off demand from schedule
      }
    }
  }
};

const scheduleSignalHeating = () => {
  let heatingSchedule = getHeatingSchedule();
  let heatingController = getHeatingController();

  if (now() < heatingSchedule.heatingTime) {
    if (heatingController.isConnected && !heatingController.isOn) {
      client.publish("Heating Control", "1");
    }
  } else if (heatingController.isConnected && heatingController.isOn) {
    client.publish("Heating Control", "0");
  }
};

const scheduleSignalRadiatorFan = () => {
  let radiatorFan = getStore("Radiator Fan");
  let heating = getHeatingSchedule();

  if (radiatorFan.isAutomatic) {
    if (now() < heating.radiatorFanTime) {
      if (radiatorFan.isConnected && !radiatorFan.isOn) {
        client.publish("Radiator Fan Control", "1");
      }
    } else if (radiatorFan.isConnected && radiatorFan.isOn) {
      client.publish("Radiator Fan Control", "0");
    }
  }
};

module.exports = {
  heatingScheduleChecker: heatingScheduleChecker,
  scheduleSignalHeating: scheduleSignalHeating,
  scheduleSignalRadiatorFan: scheduleSignalRadiatorFan,
};
