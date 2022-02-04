import { Plug } from "../stores";
import Timers from "../stores/timers";
import { nowTimer } from "../helpers";

const on = true;
const off = false;

export default class HeatingController {
  heating: Plug;
  heatingTimer: Timers;

  constructor() {
    this.heating = new Plug("heating");
    this.heatingTimer = new Timers("heating"); // convert this to use the timername as an argument in the constructor

    this.tick();
  }

  async tick() {
    const log = false;

    if (log) console.log(`\n* Heating *`);

    const heating = await this.heating.getState();
    if (heating?.connected) {
      if (log) console.log("Heating connected");

      const heatingOffTime = await this.heatingTimer.getTimer();

      if (nowTimer() < heatingOffTime) {
        if (log) console.log("Heating should be on!");

        if (heating.state !== on) {
          if (log) console.log("Heating relay is off...");

          if (log) console.log("So turn on the heating relay");
          this.heating.setState(on);
        } else {
          if (log) console.log("And it is :)");
        }
      } else {
        if (log) console.log("Heating should be off!");

        if (heating.state === on) {
          if (log) console.log("Heating relay is on...");

          if (log) console.log("So turn off the heating relay");
          this.heating.setState(off);
        } else {
          if (log) console.log("And it is :)");
        }
      }
    } else {
      if (log) console.log("Heating not connected, oh dear");
    }
  }
}
