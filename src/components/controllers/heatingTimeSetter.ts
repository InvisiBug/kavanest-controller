import { Room, Timer } from "../stores";

export default class HeatingTimeSetter {
  rooms: Room;
  heating: Timer;
  name: string = "heating";

  constructor() {
    this.rooms = new Room();
    this.heating = new Timer("heating");
  }

  // need to get the `valveDelay` and `heating` timers
  // if `valveDelay` is over 10 mins ago <- maybe change this val later
  // and the heating timer is in the past
  // set heating timer to future

  async tick() {
    const anyDemand = await this.rooms.anyDemand();
    console.log(anyDemand);

    if (anyDemand) {
      this.heating.setTimer(9999);
    } else {
      // console.log("here");
      this.heating.setTimer(0);
    }
  }
}
