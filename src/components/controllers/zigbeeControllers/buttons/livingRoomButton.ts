import { ButtonPayload, DeviceConfig } from "src/types";
import { Plug } from "src/components/stores";

export default class HeatingTimeSetter {
  deviceCongfig: DeviceConfig;
  floodlight: Plug;
  livingroomLamp: Plug;
  topic: string;

  allLightState = true;

  constructor(deviceCongfig: DeviceConfig) {
    this.deviceCongfig = deviceCongfig;
    this.topic = deviceCongfig.topic;

    this.floodlight = new Plug("floodlight");
    this.livingroomLamp = new Plug("livingRoomLamp");
  }

  handleIncoming = async (topic: String, payload: ButtonPayload) => {
    if (topic !== this.topic) return;

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
