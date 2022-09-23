import { Valve, Room } from "../stores";

const open = false;
const close = true;

const opened = false;
const closed = true;

export default class ValveController {
  roomName: string;
  valve: Valve;
  room: Room;

  constructor(roomName: string) {
    this.roomName = roomName;

    this.valve = new Valve(roomName);
    this.room = new Room(roomName);
  }

  async tick() {
    const log = false;

    if (log) console.log(`\n* ${this.roomName} Valve *`);

    const valve = await this.valve.getState();
    if (!valve) {
      if (log) console.log("Valve not found");
      return;
    }

    const { state, connected } = valve;

    if (connected) {
      if (log) console.log("Valve connected");

      const anyDemand = await this.room.anyDemand();
      if (anyDemand) {
        if (log) console.log("Some rooms are in demand");

        const thisRoomDemand = await this.room.getDemand();

        if (thisRoomDemand == 0) {
          if (log) console.log("This room is not in demand");
          if (log) console.log("Valve should be closed!");

          if (state === opened) {
            if (log) console.log("Valve is open...");
            if (log) console.log("So close valve");

            this.valve.setState(close);
          } else {
            if (log) console.log("And it is :)");
          }
        } else if (thisRoomDemand == 1) {
          if (log) console.log("This room is in demand");
          if (log) console.log("Valve should be open!");

          if (state === closed) {
            if (log) console.log("Valve is closed...");
            if (log) console.log("So open Valve");

            this.valve.setState(open);
          } else {
            if (log) console.log("And it is :)");
          }
        } else if (thisRoomDemand == 2) {
          if (log) console.log("This room is in maybe demand");
          if (log) console.log("Valve should be open!");

          if (state === closed) {
            if (log) console.log("Valve is closed...");
            if (log) console.log("So open Valve");

            this.valve.setState(open);
          } else {
            if (log) console.log("And it is :)");
          }
        }
      } else {
        if (log) console.log("No rooms in demand");
        if (log) console.log("So valve should be open!");

        if (state === closed) {
          if (log) console.log("Valve is closed...");
          if (log) console.log("So open Valve");

          this.valve.setState(open);
        } else {
          if (log) console.log("And it is :)");
        }
      }
    } else {
      if (log) console.log("Valve not connected");
    }
  }
}
