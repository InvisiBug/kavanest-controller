const { zoneHeating, zoneRadiatorFan, roomDemandSetter, zoneDemandChecker } = require("./Heating/ZoneHeatingController");
const { schedule } = require("./Heating/ScheduleHeatingController");
const { checkFan, checkHeating } = require("./Heating/ManualHeatingController");
const { setAllZonesDemand } = require("../../Helpers/HeatingModes/Zones");
const { getHeatingMode } = require("../../Helpers/HeatingModes/Modes");
const { signalValve } = require("./DeviceControllers/ValveController");
const { zones } = require("./Heating/ZoneHeatingController");

const rooms = ["Our Room", "Study", "Living Room", "Liams Room"];

setInterval(() => {
  switch (getHeatingMode()) {
    case "zones":
      zones();
      rooms.map((room) => {
        signalValve(room);
      });
      break;

    case "schedule":
      schedule();

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
