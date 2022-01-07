import Heating from "../../stores/heating";
import Timers from "../../stores/timers";
import { nowTimer } from "../../helpers";

const on = true;
const off = false;

export default class HeatingController {
  heating: Heating;
  timers: Timers;

  constructor() {
    this.heating = new Heating();
    this.timers = new Timers();
    this.tick();
  }

  async tick() {
    const heating = await this.heating.getState();
    const heatingOffTime = await this.timers.getTimer("heating");

    const log = false;
    if (log) console.log(`\n* Heating *`);

    if (heating.connected) {
      if (log) console.log("Heating connected");

      if (nowTimer() < heatingOffTime) {
        if (log) console.log("Heating should be on");

        if (heating.state !== on) {
          if (log) console.log("Heating relay is off...");

          if (log) console.log("So turn on the heating relay");
          this.heating.setState(on);
        } else {
          if (log) console.log("And it is");
        }
      } else {
        if (log) console.log("Heating should be off");

        if (heating.state === on) {
          if (log) console.log("Heating relay is on...");

          console.log("So turn off the heating relay");
          this.heating.setState(off);
        } else {
          if (log) console.log("And it is");
        }
      }
    }
  }
}