import { DeviceConfig } from "./";
import { Plug } from "../stores";

export default class HeatingTimeSetter {
  deviceCongfig: DeviceConfig;
  floodlight: Plug;
  livingroomLamp: Plug;

  allLightState = true;

  constructor(deviceCongfig: DeviceConfig) {
    this.deviceCongfig = deviceCongfig;

    this.floodlight = new Plug("floodlight");
    this.livingroomLamp = new Plug("livingRoomLamp");
  }

  handleIncoming = async (topic: String, rawPayload: Object) => {
    if (topic !== this.deviceCongfig.topic) return;

    const payload = JSON.parse(rawPayload.toString());
    if (payload.action === "single") {
      const floodLightState = await this.floodlight.getState();
      this.floodlight.setState(!floodLightState.state);
    }

    if (payload.action === "double") {
      const livingroomLampstate = await this.livingroomLamp.getState();
      this.livingroomLamp.setState(!livingroomLampstate.state);
    }

    if (payload.action === "long") {
      this.floodlight.setState(!this.allLightState);
      this.livingroomLamp.setState(!this.allLightState);
      this.allLightState = !this.allLightState;
    }

    console.log(payload);
  };
}
