import { DeviceConfig, MotionPayload } from "../../../../types";
import { Plug, RGBLight } from "../../../stores";

export default class TrainingRoomMotion {
  deviceCongfig: DeviceConfig;
  rgbStrip: RGBLight;
  topic: string;

  allLightState = true;

  constructor(deviceCongfig: DeviceConfig) {
    this.deviceCongfig = deviceCongfig;
    this.topic = deviceCongfig.topic;

    this.rgbStrip = new RGBLight("kitchenStrip");
  }

  handleIncoming = async (topic: String, rawPayload: object) => {
    if (topic !== this.topic) return;

    const payload: MotionPayload = JSON.parse(rawPayload.toString());

    if (payload.occupancy === true) {
      this.rgbStrip.setState(true);
    }

    if (payload.occupancy === false) {
      this.rgbStrip.setState(false);
    }
  };
}
