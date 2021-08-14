import { schedule } from "./Heating/ScheduleHeatingController";
import { setAllZonesDemand } from "../../Helpers/HeatingModes/Zones";
import { getHeatingMode } from "../../Helpers/HeatingModes/Modes";
import { signalValve } from "./DeviceControllers/ValveController";
import { zones } from "./Heating/ZoneHeatingController";
import { heatingController } from "./DeviceControllers/HeatingController";
import { radiatorFanController } from "./DeviceControllers/RadiatorFanController";

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
  radiatorFanController();
  heatingController();
}, 1 * 1000);
