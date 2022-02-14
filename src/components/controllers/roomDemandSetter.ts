import { decamelize } from "../helpers";
import { Sensor, Valve, Setpoint, Room } from "../stores/";

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

        if (sensor.temperature < target - deadzone) {
          if (log) console.log(`Wanting heat...\nCurrent: ${sensor.temperature} \t Target: ${target}`);

          this.room.setDemand(true);
          if (log) console.log(`So demand set to on`);
        } else if (sensor.temperature > target) {
          if (log) console.log(`Not wanting heat \nCurrent: ${sensor.temperature} \t Target: ${target}`);

          this.room.setDemand(false);
          if (log) console.log(`So demand set to off`);
        } else {
          if (log) console.log(`Within deadzone... do nothing`);
        }
      } else {
        if (log) console.log(`Valve disconnected`);
      }
    } else {
      if (log) console.log(`Sensor disconnected`);
      const target = await this.room.getCurrentTarget();
      const valve = await this.valve.getState();

      if (valve?.connected) {
        if (log) console.log(`Valve Connected`);

        if (target === 0) {
          if (log) console.log(`Target is 0`);

          if (log) console.log(`Set demand to false`);
          this.room.setDemand(false);
        } else {
          if (log) console.log(`Target exists... `);
          if (log) console.log(`Continue as you are`);
        }
      }
      //! May want to set the demand off here
    }
  }
}
