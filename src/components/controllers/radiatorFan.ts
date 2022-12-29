import { Radiator } from "../stores";
import { decamelize } from "../helpers/index";

const on = true;
const off = false;
export default class RadiatorController {
  roomName: string;
  radiator: Radiator;

  constructor(roomName: string) {
    this.roomName = roomName;

    this.radiator = new Radiator(roomName);
  }

  async tick() {
    const log = false;
    if (log) console.log(`\n* ${decamelize(this.roomName)} Radiator Fan Controller *`);

    const radiator = await this.radiator.getData();
    const { temperature, valve, fan } = radiator;
    if (!radiator || !temperature) {
      if (log) console.log(`No temperature probe found`);
      return;
    }
    const setpoint = 30;
    const deadzone = 0.5;

    if (radiator?.connected && temperature) {
      if (log) console.log("Fan connected");

      if (log) console.log("Radiator temp:", temperature, "Setpoint:", setpoint, "Deadzone", deadzone);

      if (temperature > setpoint) {
        if (log) console.log("Fan should be on!");

        if (!fan) {
          if (log) console.log("Fan is off...");
          if (log) console.log("So turn fan on");

          this.radiator.setFanState(on);
        } else {
          if (log) console.log("And it is :)");
        }
      } else if (temperature < setpoint - deadzone) {
        if (log) console.log("Fan should be off!");

        if (fan) {
          if (log) console.log("Fan is on...");
          if (log) console.log("So turn fan off");

          this.radiator.setFanState(off);
        } else {
          if (log) console.log("And it is :)");
        }
      } else {
        if (log) console.log("Within deadzone, do nothing!");
      }
    }
  }
}
