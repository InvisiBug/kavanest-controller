import { DeviceConfig, MotionPayload } from "src/types";
import { Plug, RGBLight } from "src/components/stores";

export default class TrainingRoomMotion {
  deviceCongfig: DeviceConfig;
  rgbStrip: RGBLight;
  trainingRoomPlug: Plug;
  topic: string;

  allLightState = true;

  constructor(deviceCongfig: DeviceConfig) {
    this.deviceCongfig = deviceCongfig;
    this.topic = deviceCongfig.topic;

    this.rgbStrip = new RGBLight("kitchenStrip");
    this.trainingRoomPlug = new Plug("trainingRoomPlug");
  }

  handleIncoming = async (topic: String, rawPayload: object) => {
    if (topic !== this.topic) return;

    const payload: MotionPayload = JSON.parse(rawPayload.toString());

    if (payload.occupancy === true) {
      this.rgbStrip.setState(true);
      this.trainingRoomPlug.setState(true);
    }

    if (payload.occupancy === false) {
      this.rgbStrip.setState(false);
      this.trainingRoomPlug.setState(false);
    }
  };
}
