import { ButtonPayload, DeviceConfig } from "src/types";
import { Plug } from "src/components/stores";

export default class StudyButton {
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

  handleIncoming = async (topic: String, rawPayload: object) => {
    if (topic !== this.topic) return;

    const payload: ButtonPayload = JSON.parse(rawPayload.toString());

    if (payload.action === "single") {
      const eggChairState = await this.eggChair.getState();
      this.eggChair.setState(!eggChairState.state);
    }

    if (payload.action === "double") {
      this.eggChair.setState(!this.allLightState);
      this.studyLamp.setState(!this.allLightState);
      this.allLightState = !this.allLightState;
    }

    if (payload.action === "long") {
      const studyLampstate = await this.studyLamp.getState();
      this.studyLamp.setState(!studyLampstate.state);
    }

    console.log(topic, payload);
  };
}
