import Room from "../stores/demand";
import { offsetTimeMins } from "../helpers";
import Timers from "../stores/timers";

export default class Timer {
  rooms: Room;
  timers: Timers;
  name: string = "heating";

  constructor() {
    this.rooms = new Room();
    this.timers = new Timers();
  }

  async tick() {
    const anyDemand = await this.rooms.anyDemand();

    if (anyDemand) {
      this.timers.setTimer(this.name, offsetTimeMins(9999));
    } else {
      this.timers.setTimer(this.name, offsetTimeMins(0));
    }
  }
}
