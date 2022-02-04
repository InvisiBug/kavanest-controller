import { Plug } from "../stores";
import Timers from "../stores/timers";
import { nowTimer } from "../helpers";

const on = true;
const off = false;

export default class HeatingController {
  plug: Plug;
  timer: Timers;
  deviceName: string = "mattress";

  constructor() {
    this.plug = new Plug(this.deviceName);
    this.timer = new Timers(this.deviceName); // convert this to use the timername as an argument in the constructor

    this.tick();
  }

  async tick() {
    const log: boolean = false;

    if (log) console.log(`\n* Mattress *`);

    const plug = await this.plug.getState();
    if (plug?.connected) {
      if (log) console.log(`${this.deviceName} connected`);

      const plugOffTime = await this.timer.getTimer();
      if (log) console.log(`${(plugOffTime - nowTimer()) / 1000} Seconds remaining`);

      if (nowTimer() < plugOffTime) {
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
