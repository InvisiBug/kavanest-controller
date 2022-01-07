import Sensor from "../../stores/sensors";
import Valve from "../../stores/valve";
import Setpoint from "../../stores/setpoint";
import Room from "../../stores/rooms";

const open = false;
const close = true;

export default class ValveController {
  valve: Valve;
  room: Room;

  // heating: any;
  roomName: string;

  constructor(roomName: string) {
    this.roomName = roomName;

    this.valve = new Valve(roomName);
    this.room = new Room(roomName);
  }

  async tick() {
    const valve = await this.valve.getState();
    const anyDemand = await this.room.anyDemand();
    const thisRoomDemand = await this.room.getDemand();

    const log = false;

    if (log) console.log(`\n* ${this.roomName} Valve *`);

    if (valve.connected) {
      if (log) console.log("Valve connected");

      if (anyDemand) {
        if (log) console.log("Any room in demand");

        if (thisRoomDemand) {
          if (log) console.log(this.roomName, "in demand");

          if (valve.state === close) {
            if (log) console.log("Valve is closed...");

            this.valve.setState(open);
            if (log) console.log("So open Valve");
          } else {
            if (log) console.log(this.roomName, "Valve already open");
          }
        } else if (valve.state === open) {
          if (log) console.log("Valve is open...");

          this.valve.setState(close);
          if (log) console.log("So close valve");
        }
      } else {
        if (log) console.log("No rooms in demand");

        if (valve.state === close) {
          if (log) console.log("Valve is closed...");

          this.valve.setState(open);
          if (log) console.log("So open Valve");
        }
      }
    }
  }
}
