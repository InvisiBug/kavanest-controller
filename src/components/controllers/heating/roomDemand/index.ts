import { decamelize, nowTimer } from "@/components/helpers";
import { Sensor, Room, Radiator } from "@/components/stores";
import { checkOverride } from "./checkOverride";
import { sensorConnectedDemandSetter } from "./sensorConnectedDemandSetter";
import { sensorDisconnectedDemandSetter } from "./sensorDisconnectedDemandSetter";

/*
  Sumamry
  - Override happens before anything else (rooms sensor and radiator can be disconnected)
*/

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

    const roomData = await this.room.getRoomData();
    if (!roomData) {
      if (log) console.log(`No room data found`);
      return;
    }

    //* //////////////
    //* Override
    const overrideActive = await checkOverride({ room: this.room, log, roomData }); // Override function returns true if override is active
    if (overrideActive) {
      return;
    }

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

        //* //////////////
        //* Sensor Connected controller

        sensorConnectedDemandSetter({
          sensor,
          room: this.room,
          log,
          roomData,
        });

        return;
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

        //* //////////////
        //* Sensor disonnected controller
        sensorDisconnectedDemandSetter({
          room: this.room,
          log,
        });

        return;
      } else {
        if (log) console.log("Radiator disconnected");
        return;
      }
    }
  }
}
