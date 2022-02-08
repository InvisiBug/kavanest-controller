import { Plug } from "../stores";
import Timers from "../stores/timers";
import { nowTimer } from "../helpers";

const on = true;
const off = false;

export default class HeatingController {
  plug: Plug;
  timer: Timers;
  deviceName: string;

  constructor(device: string) {
    this.deviceName = device;
    this.plug = new Plug(this.deviceName);
    this.timer = new Timers(this.deviceName);
  }

  async tick() {
    const log: boolean = false;

    if (log) console.log(`\n* ${this.deviceName} *`);

    const plug = await this.plug.getState();
    if (!plug) return;

    if (plug?.connected) {
      if (log) console.log(`${this.deviceName} connected`);

      const deviceOffTime = await this.timer.getTimer();

      if (!deviceOffTime) return;

      if (log) console.log(`${(deviceOffTime - nowTimer()) / 1000} Seconds remaining`);

      if (deviceOffTime && nowTimer() < deviceOffTime) {
        if (log) console.log("Plug should be on!");

        if (plug.state !== on) {
          if (log) console.log("Plug is off...");

          if (log) console.log("So turn on the plug");
          this.plug.setState(on);
        } else {
          if (log) console.log("And it is :)");
        }
      } else {
        if (log) console.log("Plug should be off!");

        if (plug.state === on) {
          if (log) console.log("Plug is on...");

          if (log) console.log("So turn off the plug");
          this.plug.setState(off);
        } else {
          if (log) console.log("And it is :)");
        }
      }
    } else {
      if (log) console.log(`${this.deviceName} not connected, oh dear`);
    }
  }
}
