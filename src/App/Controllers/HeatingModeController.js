const { schedule } = require("./Heating/ScheduleHeatingController");
const { setAllZonesDemand } = require("../../Helpers/HeatingModes/Zones");
const { getHeatingMode } = require("../../Helpers/HeatingModes/Modes");
const { signalValve } = require("./DeviceControllers/ValveController");
const { zones } = require("./Heating/ZoneHeatingController");
const { heatingController } = require("./DeviceControllers/HeatingController");
const { radiatorFanController } = require("./DeviceControllers/RadiatorFanController");

const rooms = ["Our Room", "Study", "Living Room", "Liams Room"];

setInterval(() => {
  switch (getHeatingMode()) {
    case "zones":
      zones(rooms);
      break;

    case "schedule":
      schedule(rooms);
      break;

    case "manual":
      // Manual control
      break;
  }
  heatingController();
  radiatorFanController();
}, 1 * 1000);
