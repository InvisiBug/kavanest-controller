import { decamelize } from "../helpers";
import { Sensor, Valve, Setpoint, Room } from "../stores/";

const on = true;
const off = false;
export default class RoomDemandSetter {
  sensor: Sensor;
  valve: Valve;
  room: Room;

  heating: any;
  roomName: string;

  constructor(roomName: string) {
    this.roomName = roomName;

    this.sensor = new Sensor(roomName);
    this.valve = new Valve(roomName);
    this.room = new Room(roomName);

    this.tick();
  }

  async tick() {
    const log = true;

    if (log) console.log(`\n* ${decamelize(this.roomName)} Demand Setter *`);

    const sensor = await this.sensor.getState();
    if (!sensor) {
      if (log) console.log(`No sensor found`);
      return;
    }

    if (sensor?.connected) {
      const valve = await this.valve.getState();
      if (!valve) {
        if (log) console.log(`No valve found`);
        return;
      }

      if (valve?.connected) {
        if (log) console.log(`Sensor and valve connected`);

        const roomData = await this.room.getRoomData();
        const deadzone = roomData?.deadzone || 0;
        const target = await this.room.getCurrentTarget();

        if (log) console.log(`Current: ${sensor.temperature} \t Target: ${target}`);
        if (sensor.temperature < target - deadzone) {
          if (log) console.log("Wanting heat...");
          if (log) console.log(`So set demand to on`);

          this.room.setDemand(on);
        } else if (sensor.temperature > target) {
          if (log) console.log(`Not wanting heat`);
          if (log) console.log(`So set demand to off`);

          this.room.setDemand(off);
        } else {
          if (log) console.log(`Within deadzone... do nothing`);
        }
      } else {
        if (log) console.log(`Valve disconnected`);
      }
    } else {
      if (log) console.log(`Sensor disconnected`);
      const valve = await this.valve.getState();
      if (!valve) {
        if (log) console.log(`No valve found`);
      }

      if (valve?.connected) {
        if (log) console.log(`Valve Connected`);

        const target = await this.room.getCurrentTarget();
        if (target === 0) {
          if (log) console.log(`Target is 0`);
          if (log) console.log(`Set demand to off`);

          this.room.setDemand(off);
        } else {
          if (log) console.log(`Target exists... `);
          if (log) console.log(`Continue as you are`);
        }
      } else {
        if (log) console.log("Valve disconnected");
      }
    }
  }
}
