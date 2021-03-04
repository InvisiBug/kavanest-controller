/*
 TODO This currently turns on the radiator fan regardless of whether
 or not our room valve is open
*/
const { updateHeatingTime, updateRadiatorFanTime } = require("../HeatingModes/Timers");

const manualheatingOn = () => {
  updateHeatingTime(9999);
  updateRadiatorFanTime("on");
};

const manualheatingOff = () => {
  updateHeatingTime(0);
  updateRadiatorFanTime("overrun"); // should be 20
};

module.exports = {
  manualheatingOn: manualheatingOn,
  manualheatingOff: manualheatingOff,
};
