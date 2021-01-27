const { scheduleChecker, scheduleHeating, scheduleRadiatorFan } = require("./Heating/ScheduleHeatingController");
const { zoneHeating, zoneRadiatorFan, zoneManualOverride, roomDemandSetter, zoneDemandChecker } = require("./Heating/ZoneHeatingController");
const { checkFan, checkHeating } = require("./Heating/ManualHeatingController");
const { setAllZonesDemand } = require("../../Helpers/HeatingModes/Zones");
const { signalValve } = require("./ValveController");
const { getHeatingMode } = require("../../Helpers/HeatingModes/Modes");

const rooms = ["Our Room", "Study", "Living Room", "Liams Room"];

setInterval(() => {
  switch (getHeatingMode()) {
    case "zones":
      zoneHeating();
      zoneRadiatorFan();
      zoneDemandChecker();

      rooms.map((room) => {
        signalValve(room);
        roomDemandSetter(room);
      });
      break;

    case "schedule":
      scheduleChecker();
      scheduleHeating();
      scheduleRadiatorFan();

      setAllZonesDemand(true);
      rooms.map((room) => {
        signalValve(room);
      });
      break;

    case "manual":
      checkFan();
      checkHeating();
      break;
  }
}, 1 * 1000);
