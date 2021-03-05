const { getRadiatorFanTime, getBoostTime, getHeatingTime } = require("../../../Helpers/HeatingModes/Timers");
const { heatingOn, heatingOff, getScheduleHeating } = require("../../../Helpers/HeatingModes/Schedule");
const { day, now, time, days } = require("../../../Helpers/Time");
const { setAllZonesDemand } = require("../../../Helpers/HeatingModes/Zones");
const { signalValve } = require("../DeviceControllers/ValveController");

const schedule = (rooms) => {
  scheduleChecker();

  setAllZonesDemand(true);

  rooms.map((room) => {
    signalValve(room);
  });
};

const scheduleChecker = () => {
  if (getBoostTime() < now()) {
    if (
      (getScheduleHeating()[days[day()]][0] <= time() && time() <= getScheduleHeating()[days[day()]][1]) || // ! (Not sure this is the case anymore) Seems to be some overlap ie schedule on at 16:02 when should be on at 16:15
      (getScheduleHeating()[days[day()]][2] <= time() && time() <= getScheduleHeating()[days[day()]][3])
    ) {
      heatingOn();
    } else {
      heatingOff();
    }
  }
};

module.exports = {
  schedule,
};
