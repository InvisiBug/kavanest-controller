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

    if (!target || target === "n/a") return;

    if (sensor.connected && valve.connected) {
      if (sensor.temperature < target - deadzone) {
        this.room.setDemand(true);
      } else if (sensor.temperature > target) {
        this.room.setDemand(false);
      }
    }
  }
}
