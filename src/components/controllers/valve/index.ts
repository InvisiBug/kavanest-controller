import { decamelize } from "../../helpers";
import Valve from "../../stores/valve";
import Room from "../../stores/rooms";

const open = false;
const close = true;
export default class ValveController {
  valve: Valve;
  room: Room;

  roomName: string;

  constructor(roomName: string) {
    console.log("hello from ", roomName);
    this.roomName = roomName;

    this.valve = new Valve(roomName);
    this.room = new Room(roomName);
  }

  async tick() {
    const valve = await this.valve.getState();
    const anyDemand = await this.room.anyDemand();
    const thisRoomDemand = await this.room.getDemand();

    console.log("dslkjdalskj");

    const log = true;

    if (log) console.log(`\n* ${decamelize(this.roomName)} Valve *`);

    if (valve.connected) {
      if (log) console.log("Valve connected");

      if (anyDemand) {
        if (thisRoomDemand) {
          if (log) console.log("Room in demand, this valve should be open");

          if (valve.state === close) {
            if (log) console.log("Valve is closed... opening valve");

            this.valve.setState(open);
          } else {
            if (log) console.log("and it is");
          }
        } else {
          if (log) console.log("Room not in demand, this valve should be closed");

          if (valve.state === open) {
            if (log) console.log("Valve is open... closing valve");

            this.valve.setState(close);
          } else {
            if (log) console.log("and it is");
          }
        }
      } else {
        if (log) console.log("No rooms in demand, valve should be open...");

        if (valve.state === close) {
          if (log) console.log("Valve is closed... opening valve");
          this.valve.setState(open);
        } else {
          if (log) console.log("and it is");
        }
      }
    } else {
      if (log) console.log("Valve not connected");
    }
  }
}
