const { getStore } = require("../../helpers/StorageDrivers/LowLevelDriver");
const { scheduleChecker, scheduleHeating, scheduleRadiatorFan } = require("./Heating/ScheduleHeatingController");
const { zoneHeating, zoneRadiatorFan, zoneManualOverride, checkRoomDemand } = require("./Heating/ZoneHeatingController");

setInterval(() => {
  const mode = getStore("Environmental Data").heatingMode;

  if (mode === "zones") {
    zoneHeating();
    zoneRadiatorFan();
    zoneManualOverride();

    checkRoomDemand("Living Room");
    checkRoomDemand("Kitchen");
    checkRoomDemand("Liams Room");
    checkRoomDemand("Study");
    checkRoomDemand("Our Room");
  } else if (mode === "schedule") {
    scheduleChecker();
    scheduleHeating();
    scheduleRadiatorFan();
  }
}, 1 * 1000);
