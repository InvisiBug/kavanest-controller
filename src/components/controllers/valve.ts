// import Valve from "../stores/valve";
import Room from "../stores/demand";
import { Valve, Demand } from "../stores";

const open = false;
const close = true;

export default class ValveController {
  valve: Valve;
  demand: Room;

  // heating: any;
  roomName: string;

  constructor(roomName: string) {
    this.roomName = roomName;

    this.valve = new Valve(roomName);
    this.demand = new Demand(roomName);
  }

  async tick() {
    const log = false;

    if (log) console.log(`\n* ${this.roomName} Valve *`);

    const valve = await this.valve.getState();
    if (valve?.connected) {
      if (log) console.log("Valve connected");

      const anyDemand = await this.demand.anyDemand();
      if (anyDemand) {
        if (log) console.log("Some rooms are in demand");

        const thisRoomDemand = await this.demand.getDemand();
        if (thisRoomDemand) {
          if (log) console.log("This room is in demand");

          if (log) console.log("Valve should be open!");

          if (valve?.state === close) {
            if (log) console.log("Valve is closed...");

            if (log) console.log("So open Valve");
            this.valve.setState(open);
          } else {
            if (log) console.log("And it is :)");
          }
        } else {
          if (log) console.log("This room is not in demand");

          if (log) console.log("Valve should be closed!");

          if (valve.state === open) {
            if (log) console.log("Valve is open...");

            if (log) console.log("So close valve");
            this.valve.setState(close);
          } else {
            if (log) console.log("And it is :)");
          }
        }
      } else {
        if (log) console.log("No rooms in demand");

        if (log) console.log("So valve should be open!");

        if (valve.state === close) {
          if (log) console.log("Valve is closed...");

          if (log) console.log("So open Valve");
          this.valve.setState(open);
        } else {
          if (log) console.log("And it is :)");
        }
      }
    }
  }
}
