import { ButtonPayload, DeviceConfig } from "src/types";
import { Plug } from "src/components/stores";

export default class HeatingTimeSetter {
  deviceCongfig: DeviceConfig;
  eggChair: Plug;
  studyLamp: Plug;
  topic: string;

  allLightState = true;

  constructor(deviceCongfig: DeviceConfig) {
    this.deviceCongfig = deviceCongfig;
    this.topic = deviceCongfig.topic;

    this.eggChair = new Plug("eggChair");
    this.studyLamp = new Plug("studyLamp");
  }

  handleIncoming = async (topic: String, payload: ButtonPayload) => {
    if (topic !== this.topic) return;

    if (payload.action === "single") {
      const eggChairState = await this.eggChair.getState();
      this.eggChair.setState(!eggChairState.state);
    }

    if (payload.action === "double") {
      const studyLampstate = await this.studyLamp.getState();
      this.studyLamp.setState(!studyLampstate.state);
    }

    if (payload.action === "long") {
      this.eggChair.setState(!this.allLightState);
      this.studyLamp.setState(!this.allLightState);
      this.allLightState = !this.allLightState;
    }

    console.log(topic, payload);
  };
}
