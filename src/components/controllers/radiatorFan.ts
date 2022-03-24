import { Radiator, Plug } from "../stores";

const on = true;
const off = false;
export default class RadiatorController {
  roomName: string;
  radiator: Radiator;
  fan: Plug;

  constructor(roomName: string) {
    this.roomName = roomName;

    this.radiator = new Radiator(roomName);
    this.fan = new Plug("radiatorFan");
  }

  async tick() {
    const log = false;

    const fan = await this.fan.getState();
    const setpoint: number = 30;
    const deadzone: number = 0.5;

    if (log) console.log("\nRadiator fan controller");

    if (fan?.connected) {
      if (log) console.log("Fan connected");

      const radiator = await this.radiator.getTemp();
      if (!radiator) return;

      if (log) console.log("Radiator inlet temp:", radiator.inlet, "Setpoint:", setpoint, "Deadzone", deadzone);

      if (radiator.inlet > setpoint) {
        if (log) console.log("Fan should be on!");

        if (!fan.state) {
          if (log) console.log("Fan is off...");
          if (log) console.log("So turn fan on");

          this.fan.setState(on);
        } else {
          if (log) console.log("And it is :)");
        }
      } else if (radiator.inlet < setpoint - deadzone) {
        if (log) console.log("Fan should be off!");

        if (fan.state) {
          if (log) console.log("Fan is on...");
          if (log) console.log("So turn fan off");

          this.fan.setState(off);
        } else {
          if (log) console.log("And it is :)");
        }
      } else {
        if (log) console.log("Within deadzone, do nothing!");
      }
    }
  }
}
