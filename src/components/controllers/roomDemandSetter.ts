import { decamelize } from "../helpers";
import Sensor from "../stores/sensors";
import Valve from "../stores/valve";
import Setpoint from "../stores/setpoint";
import Room from "../stores/rooms";

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
    const log = false;

    if (log) console.log(`\n* ${decamelize(this.roomName)} Demand Setter *`);

    const target = await this.setpoint.getCurrentTarget();
    if (!target || target === "n/a") {
      if (log) console.log("No target temp set");
      return;
    }

    const sensor = await this.sensor.getState();

    if (sensor?.connected) {
      const valve = await this.valve.getState();

      if (valve?.connected) {
        if (log) console.log(`Sensor and valve connected`);

        const deadzone = await this.setpoint.getDeadzone();
        if (sensor.temperature < target - deadzone) {
          if (log) console.log(`Wanting heat...`);

          this.room.setDemand(true);
          if (log) console.log(`So demand set to on`);
        } else if (sensor.temperature > target) {
          if (log) console.log(`Not wanting heat \nCurrent: ${sensor.temperature} \t Target: ${target}`);

          this.room.setDemand(false);
          if (log) console.log(`So demand set to off`);
        }
      } else {
        if (log) console.log(`Valve disconnected`);
      }
    } else {
      if (log) console.log(`Sensor disconnected`);
      //! May want to set the demand off herre
    }
  }
}

// const checkTempAndSetRoomDemand = (room) => {
//   let setpoint = getRoomSetpoints(camelRoomName(room));
//   let currentTemp = getRoomTemperature(camelRoomName(room));
//   const hysteresis = 0.5;

//   if (isValveConnected(camelRoomName(room))) {
//     //? A rooms demand will be set to false if that rooms valve disconnects
//     //? A rooms demand will also be set to false if the sensor drops off the network
//     if (currentTemp < setpoint[hour()] - hysteresis && currentTemp > 0) {
//       setZonesDemand(room, true);
//     } else if (currentTemp > setpoint[hour()]) {
//       setZonesDemand(room, false);
//     }
//   } else {
//     setZonesDemand(room, false);
//   }
// };
