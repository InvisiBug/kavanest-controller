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
    if (!plug) {
      if (log) console.log("No plug found");
      return;
    }

    const { state, connected } = plug;

    if (connected) {
      if (log) console.log(`${this.deviceName} connected`);

      const offTime = await this.timer.getTimer();
      if (!offTime) {
        if (log) console.log("No device off time found");
        return;
      }

      if (log) console.log(`${(offTime - nowTimer()) / 1000} Seconds remaining`);

      if (nowTimer() < offTime) {
        if (log) console.log("Plug should be on!");

        if (state === off) {
          if (log) console.log("Plug is off...");

          if (log) console.log("So turn on the plug");
          this.plug.setState(on);
        } else {
          if (log) console.log("And it is :)");
        }
      } else {
        if (log) console.log("Plug should be off!");

        if (state === on) {
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
