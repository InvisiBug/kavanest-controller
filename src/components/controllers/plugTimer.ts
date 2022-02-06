import { Plug } from "../stores";
import Timers from "../stores/timers";
import { nowTimer } from "../helpers";

const on = true;
const off = false;

export default class HeatingController {
  device: Plug;
  timer: Timers;
  deviceName: string;

  constructor(device: string) {
    this.deviceName = device;
    this.device = new Plug(this.deviceName);
    this.timer = new Timers(this.deviceName);
  }

  async tick() {
    const log: boolean = false;

    if (log) console.log(`\n* ${this.deviceName} *`);

    const device = await this.device.getState();
    if (!device) return;

    if (device?.connected) {
      if (log) console.log(`${this.deviceName} connected`);

      const deviceOffTime = await this.timer.getTimer();
      if (!deviceOffTime) return;

      if (log) console.log(`${(deviceOffTime - nowTimer()) / 1000} Seconds remaining`);

      if (deviceOffTime && nowTimer() < deviceOffTime) {
        if (log) console.log("Device should be on!");

        if (device.state !== on) {
          if (log) console.log("Device is off...");

          if (log) console.log("So turn on the device");
          this.device.setState(on);
        } else {
          if (log) console.log("And it is :)");
        }
      } else {
        if (log) console.log("Device should be off!");

        if (device.state === on) {
          if (log) console.log("Device is on...");

          if (log) console.log("So turn off the device");
          this.device.setState(off);
        } else {
          if (log) console.log("And it is :)");
        }
      }
    } else {
      if (log) console.log(`${this.deviceName} not connected, oh dear`);
    }
  }
}
