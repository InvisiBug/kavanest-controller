import { Plug } from "../../stores";
import Timers from "../../stores/timers";
import { decamelize, nowTimer } from "../../helpers";

const on = true;
const off = false;

export default class PlugTimer {
  device: Plug;
  timer: Timers;
  deviceName: string;

  constructor(device: string) {
    this.deviceName = device;
    this.device = new Plug(this.deviceName); // The physical device
    this.timer = new Timers(this.deviceName); // The timer for the device in the mongo store
  }

  async tick() {
    const log = false;

    if (log) console.log(`\n* ${decamelize(this.deviceName)} *`);

    const device = await this.device.getState();
    if (!device) {
      if (log) console.log("No device found");
      return;
    }

    const { state, connected } = device;

    if (connected) {
      if (log) console.log(`${decamelize(this.deviceName)} connected`);

      const offTime = await this.timer.getTimer();
      if (!offTime) {
        if (log) console.log("No device off time found");
        return;
      }

      if (log) console.log(`${(offTime - nowTimer()) / 1000} Seconds remaining`);

      if (nowTimer() < offTime) {
        if (log) console.log(`${decamelize(this.deviceName)} should be on!`);

        if (state === off) {
          if (log) console.log(`${decamelize(this.deviceName)} is off...`);
          if (log) console.log(`So turn on the ${decamelize(this.deviceName)}`);

          this.device.setState(on);
        } else {
          if (log) console.log("And it is :)");
        }
      } else {
        if (log) console.log(`${decamelize(this.deviceName)} should be off!`);

        if (state === on) {
          if (log) console.log(`${decamelize(this.deviceName)} is on...`);
          if (log) console.log(`So turn off the ${decamelize(this.deviceName)}`);

          this.device.setState(off);
        } else {
          if (log) console.log("And it is :)");
        }
      }
    } else {
      if (log) console.log(`${this.deviceName} not connected, oh dear`);
      return;
    }
  }
}
