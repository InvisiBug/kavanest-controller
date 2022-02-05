import { Room, Timer } from "../stores";

export default class HeatingTimeSetter {
  rooms: Room;
  timers: Timer;
  name: string = "heating";

  constructor() {
    this.rooms = new Room();
    this.timers = new Timer("heating");
  }

  async tick() {
    const anyDemand = await this.rooms.anyDemand();

    if (anyDemand) {
      this.timers.setTimer(9999);
    } else {
      this.timers.setTimer(0);
    }
  }
}
