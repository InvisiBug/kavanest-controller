import Sensor from "./components/sensors";
import Valve from "./components/valve";

export default class RoomController {
  sensor: any;
  valve: any;
  heating: any;

  constructor(roomName: string) {
    this.sensor = new Sensor(roomName);
    this.valve = new Valve(roomName);
    // this.heating = new Heating()

    this.tick();
  }

  async tick() {
    const sensorState = await this.sensor.getState();
    const valveState = await this.valve.getState();

    console.log(valveState);
    console.log(sensorState);
    // console.log(await this.sensor.getValues());
  }
}
