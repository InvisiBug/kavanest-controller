import { decamelize, nowTimer } from "../../helpers";
import { Sensor, Room, Radiator } from "../../stores";

const off = 0;
const on = 1;
const maybe = 2;
export default class RoomDemandSetter {
  sensor: Sensor;
  room: Room;
  radiator: Radiator;
  roomName: string;

  constructor(roomName: string) {
    this.roomName = roomName;

    this.sensor = new Sensor(roomName);
    this.radiator = new Radiator(roomName);
    this.room = new Room(roomName);

    this.tick();
  }

  async tick() {
    const log = false;

    if (log) console.log(`\n* ${decamelize(this.roomName)} Demand Setter *`);

    const sensor = await this.sensor.getState();
    if (!sensor) {
      if (log) console.log(`No sensor found`);
      return;
    }

    if (sensor?.connected) {
      const radiator = await this.radiator.getData();
      if (!radiator) {
        if (log) console.log(`No radiator found`);
        return;
      }

      if (radiator?.connected) {
        if (log) console.log(`Sensor and radiator connected`);

        const target = await this.room.getCurrentTarget();
        const roomData = await this.room.getRoomData();
        const overrideTime = roomData?.overrideTime;
        const overrideType = roomData?.overrideType;
        const deadzone = roomData?.deadzone || 0;
        const maybeDeadzone = 0.2;

        //* //////////////
        //* Override
        if (overrideTime && nowTimer() < overrideTime) {
          if (log) console.log("Override");

          if (overrideType === "heating-on") {
            if (log) console.log("Heating on override");
            if (log) console.log(`So set demand to on`);

            this.room.setDemand(on);
            return;
          } else if (overrideType === "heating-off") {
            if (log) console.log("Heating off override");
            if (log) console.log(`So set demand to off`);

            this.room.setDemand(off);
            return;
          }
        }

        // if (log) console.log(deadzone);

        if (log) console.log(`Temperature: ${sensor.temperature} \t Target: ${target}`);
        if (sensor.temperature > target) {
          if (log) console.log(`Not wanting heat`);
          if (log) console.log(`So set demand to off`);

          this.room.setDemand(off);
          return;
        } else if (sensor.temperature < target - deadzone) {
          if (log) console.log("Wanting heat...");
          if (log) console.log(`So set demand to on`);

          this.room.setDemand(on);
          return;
        } else {
          const anyDemand = await this.room.anyDemand();
          const thisRoomDemand = await this.room.getDemand();

          if (anyDemand && thisRoomDemand != 1 && sensor.temperature < target - maybeDeadzone) {
            if (log) console.log("Another room is wanting heat");

            if (log) console.log(`So set demand to maybe`);
            this.room.setDemand(maybe);
            return;
          } else {
            if (log) console.log("No other rooms wanting heat");
            if (log) console.log(`Within deadzone... do nothing`);
            return;
          }
        }
      } else {
        if (log) console.log(`Radiator disconnected`);
        return;
      }
    } else {
      if (log) console.log(`Sensor disconnected`);

      const radiator = await this.radiator.getData();
      if (!radiator) {
        if (log) console.log(`No radiator found`);
        return;
      }

      if (radiator?.connected) {
        if (log) console.log(`Radiator Connected`);

        const target = await this.room.getCurrentTarget();
        if (target === 0) {
          if (log) console.log(`Target is 0`);
          if (log) console.log(`Set demand to off`);

          this.room.setDemand(off);
          return;
        } else {
          if (log) console.log(`Target exists... `);
          if (log) console.log(`Set demand to maybe`);
          this.room.setDemand(maybe);
          return;
        }
      } else {
        if (log) console.log("Radiator disconnected");
        return;
      }
    }
  }
}
