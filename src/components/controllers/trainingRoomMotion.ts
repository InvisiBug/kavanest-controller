import { DeviceConfig } from "./";
import { Plug, RGBLight } from "../stores";

export default class TrainingRoomMotion {
  deviceCongfig: DeviceConfig;
  rgbStrip: RGBLight;

  allLightState = true;

  constructor(deviceCongfig: DeviceConfig) {
    this.deviceCongfig = deviceCongfig;

    this.rgbStrip = new RGBLight("kitchenStrip");
  }

  handleIncoming = async (topic: String, rawPayload: Object) => {
    if (topic !== this.deviceCongfig.topic) return;

    const payload = JSON.parse(rawPayload.toString());

    if (payload.occupancy === true) {
      this.rgbStrip.setState(true);
    }

    if (payload.occupancy === false) {
      this.rgbStrip.setState(false);
    }

    console.log(payload);
  };
}
