const { getStore } = require("../../helpers/StorageDrivers/LowLevelDriver");
const { scheduleChecker, scheduleHeating, scheduleRadiatorFan } = require("./Heating/ScheduleHeatingController");
const { zoneHeating, zoneRadiatorFan, zoneManualOverride } = require("./Heating/ZoneHeatingController");

setInterval(() => {
  const mode = getStore("Environmental Data").heatingMode;

  if (mode === "zones") {
    zoneHeating();
    zoneRadiatorFan();
    zoneManualOverride();
  } else if (mode === "schedule") {
    scheduleChecker();
    scheduleHeating();
    scheduleRadiatorFan();
  }
}, 1 * 1000);
