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

    const log = false;

    if (log) console.log(`\n* ${decamelize(this.roomName)} Demand Setter *`);

    if (log) console.log(target, sensor.temperature, deadzone);

    if (!target || target === "n/a") {
      if (log) console.log("No target temp set");
      return;
    }

    if (sensor?.connected && valve?.connected) {
      if (log) console.log(`Sensor and valve connected`);

      if (sensor.temperature < target - deadzone) {
        if (log) console.log(`Wanting heat...`);

        this.room.setDemand(true);
        if (log) console.log(`So demand set to on`);
      } else {
        if (log) console.log(`Not wanting heat \nCurrent: ${sensor.temperature} \t Target: ${target}`);

        this.room.setDemand(false);
        if (log) console.log(`So demand set to off`);
      }
    } else {
      if (log) console.log(`Sensor or valve disconnected`);
      //! May want to set the demand off herre
    }
  }
}
