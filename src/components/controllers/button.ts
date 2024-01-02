import { DeviceConfig } from "./";
import { Plug } from "../stores";

export default class HeatingTimeSetter {
  deviceCongfig: DeviceConfig;
  floodlight: Plug;

  constructor(deviceCongfig: DeviceConfig) {
    this.deviceCongfig = deviceCongfig;

    this.floodlight = new Plug("floodlight");
  }

  handleIncoming = async (topic: String, rawPayload: Object) => {
    if (topic !== this.deviceCongfig.topic) return;

    const payload = JSON.parse(rawPayload.toString());
    if (payload.action === "single") {
      const floodLightState = await this.floodlight.getState();
      this.floodlight.setState(!floodLightState.state);
    }

    if (payload.action === "double") {
      const floodLightState = await this.floodlight.getState();
      this.floodlight.setState(!floodLightState.state);
    }

    if (payload.action === "long") {
      const floodLightState = await this.floodlight.getState();
      this.floodlight.setState(!floodLightState.state);
    }

    console.log(payload);
  };
}
