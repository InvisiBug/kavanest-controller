import { decamelize } from "../../helpers";
import Sensor from "../../stores/sensors";
import Valve from "../../stores/valve";
import Setpoint from "../../stores/setpoint";
import Room from "../../stores/rooms";

export default class RoomDemandSetter {
  sensor: Sensor;
  valve: Valve;
  setpoint: Setpoint;
  room: Room;

  heating: any;
  roomName: string;

  constructor(roomName: string) {
    this.roomName = roomName;

    this.sensor = new Sensor(roomName);
    this.valve = new Valve(roomName);
    this.setpoint = new Setpoint(roomName);
    this.room = new Room(roomName);

    this.tick();
  }

  async tick() {
    const sensor = await this.sensor.getState();
    const valve = await this.valve.getState();
    const deadzone = await this.setpoint.getDeadzone();
    const target = await this.setpoint.getCurrentTarget();

    // console.log(sensor.temperature, target);

    const log = false;

    if (log) console.log(`\n* ${decamelize(this.roomName)} Demand Setter *`);

    if (!target || target === "n/a") {
      if (log) console.log("No target temp set");
      return;
    }

    if (sensor?.connected && valve?.connected) {
      if (log) console.log(`${decamelize(this.roomName)} sensor and valve connected`);

      if (sensor.temperature < target - deadzone) {
        if (log) console.log(`${decamelize(this.roomName)} is wanting heat...`);

        this.room.setDemand(true);
        if (log) console.log(`So ${decamelize(this.roomName)} demand set to on`);
      } else if (sensor.temperature > target) {
        if (log) console.log(`${decamelize(this.roomName)} is not wanting heat \nCurrent: ${sensor.temperature} \t Target: ${target}`);

        this.room.setDemand(false);
        if (log) console.log(`So ${decamelize(this.roomName)} demand set to off`);
      }
    } else {
      if (log) console.log(`${decamelize(this.roomName)} sensor or valve disconnected`);
    }
  }
}
