import { ButtonPayload, DeviceConfig } from "../../../../types";
import { Plug } from "../../../stores";

export default class LivingRoomButton {
  deviceCongfig: DeviceConfig;
  floodlight: Plug;
  livingRoomLamp: Plug;
  topic: string;

  allLightState = true;

  constructor(deviceCongfig: DeviceConfig) {
    this.deviceCongfig = deviceCongfig;
    this.topic = deviceCongfig.topic;

    this.floodlight = new Plug("floodlight");
    this.livingRoomLamp = new Plug("livingRoomLamp");
  }

  handleIncoming = async (topic: String, rawPayload: object) => {
    if (topic !== this.topic) return;

    const payload: ButtonPayload = JSON.parse(rawPayload.toString());

    if (payload.action === "single") {
      const floodLightState = await this.floodlight.getState();
      this.floodlight.setState(!floodLightState.state);
    }

    if (payload.action === "double") {
      const livingRoomLampstate = await this.livingRoomLamp.getState();
      this.livingRoomLamp.setState(!livingRoomLampstate.state);
    }

    if (payload.action === "long") {
      this.floodlight.setState(!this.allLightState);
      this.livingRoomLamp.setState(!this.allLightState);
      this.allLightState = !this.allLightState;
    }
  };
}
