import { Room, Radiator } from "../stores";
import { decamelize } from "../helpers";

const open = false;
const close = true;

const opened = false;
const closed = true;

export default class ValveController {
  roomName: string;
  room: Room;
  radiator: Radiator;

  constructor(roomName: string) {
    this.roomName = roomName;

    this.radiator = new Radiator(roomName);
    this.room = new Room(roomName);
  }

  async tick() {
    const log = true;

    const on = true;
    const off = false;

    if (log) console.log(`\n* ${decamelize(this.roomName)} Radiator Controller *`);

    const radiator = await this.radiator.getData();
    if (!radiator) {
      if (log) console.log("Radiator object not found");
      return;
    }

    const { connected, valve, fan, temperature } = radiator;

    if (connected) {
      if (log) console.log("Radiator connected");

      ///////////////
      // Radiator Fan
      if (temperature) {
        if (log) console.log("Radiator has a fan");

        const setpoint = 25;
        const deadzone = 0.5;

        if (log) console.log("Radiator temp:", temperature, "Setpoint:", setpoint, "Deadzone", deadzone);

        if (temperature > setpoint) {
          if (log) console.log("Fan should be on!");

          if (!fan) {
            if (log) console.log("Fan is off...");
            if (log) console.log("So turn fan on");

            this.radiator.setFanState(on);
          } else {
            if (log) console.log("And it is :)");
          }
        } else if (temperature < setpoint - deadzone) {
          if (log) console.log("Fan should be off!");

          if (fan) {
            if (log) console.log("Fan is on...");
            if (log) console.log("So turn fan off");

            this.radiator.setFanState(off);
          } else {
            if (log) console.log("And it is :)");
          }
        } else {
          if (log) console.log("Within deadzone, do nothing!");
        }
      }

      /////////////////
      // Radiator Valve
      const anyDemand = await this.room.anyDemand();
      if (anyDemand) {
        if (log) console.log("Some rooms are in demand");

        const thisRoomDemand = await this.room.getDemand();

        if (thisRoomDemand == 0) {
          if (log) console.log("This room is not in demand");
          if (log) console.log("Valve should be closed!");

          if (valve === opened) {
            if (log) console.log("Valve is open...");
            if (log) console.log("So close valve");

            this.radiator.setValveState(close);
          } else {
            if (log) console.log("And it is :)");
          }
        } else if (thisRoomDemand == 1) {
          if (log) console.log("This room is in demand");
          if (log) console.log("Valve should be open!");

          if (valve === closed) {
            if (log) console.log("Valve is closed...");
            if (log) console.log("So open Valve");

            this.radiator.setValveState(open);
          } else {
            if (log) console.log("And it is :)");
          }
        } else if (thisRoomDemand == 2) {
          if (log) console.log("This room is in maybe demand");
          if (log) console.log("Valve should be open!");

          if (valve === closed) {
            if (log) console.log("Valve is closed...");
            if (log) console.log("So open Valve");

            this.radiator.setValveState(open);
          } else {
            if (log) console.log("And it is :)");
          }
        }
      } else {
        if (log) console.log("No rooms in demand");
        if (log) console.log("So valve should be open!");

        if (valve === closed) {
          if (log) console.log("Valve is closed...");
          if (log) console.log("So open Valve");

          this.radiator.setValveState(open);
        } else {
          if (log) console.log("And it is :)");
        }
      }
    } else {
      if (log) console.log("Valve not connected");
    }
  }
}
