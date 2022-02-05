import { decamelize } from "../helpers";
import { Sensor, Valve, Setpoint, Demand } from "../stores/";

export default class RoomDemandSetter {
  sensor: Sensor;
  valve: Valve;
  setpoint: Setpoint;
  demand: Demand;

  heating: any;
  roomName: string;

  constructor(roomName: string) {
    this.roomName = roomName;

    this.sensor = new Sensor(roomName);
    this.valve = new Valve(roomName);
    this.setpoint = new Setpoint(roomName);
    this.demand = new Demand(roomName);

    this.tick();
  }

  async tick() {
    const log = false;

    if (log) console.log(`\n* ${decamelize(this.roomName)} Demand Setter *`);

    const target = await this.setpoint.getCurrentTarget();
    if (!target) {
      if (log) console.log("No target temp set");
      return;
    }

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

        const deadzone = await this.setpoint.getDeadzone();

        if (sensor.temperature < target - deadzone) {
          if (log) console.log(`Wanting heat...\nCurrent: ${sensor.temperature} \t Target: ${target}`);

          this.demand.setDemand(true);
          if (log) console.log(`So demand set to on`);
        } else if (sensor.temperature > target) {
          if (log) console.log(`Not wanting heat \nCurrent: ${sensor.temperature} \t Target: ${target}`);

          this.demand.setDemand(false);
          if (log) console.log(`So demand set to off`);
        } else {
          if (log) console.log(`Within deadzone... do nothing`);
        }
      } else {
        if (log) console.log(`Valve disconnected`);
      }
    } else {
      if (log) console.log(`Sensor disconnected`);
      //! May want to set the demand off here
    }
  }
}
