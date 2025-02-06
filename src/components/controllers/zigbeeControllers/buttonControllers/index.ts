import { ButtonPayload, DeviceConfig } from "@/types";
import { Plug } from "@/components/stores";

export default class ButtonController {
  lamp: Plug;
  buttonTopic: string;

  constructor(buttonTopic: string, lampName: string) {
    this.lamp = new Plug(lampName);
    this.buttonTopic = buttonTopic;
  }

  handleIncoming = async (topic: String, rawPayload: object) => {
    if (topic == this.buttonTopic) {
      const payload: ButtonPayload = JSON.parse(rawPayload.toString());
      const { state: lampstate } = await this.lamp.getState();

      if (payload.action === "single") {
        this.lamp.setState(!lampstate);
      }

      if (payload.action === "double") {
        this.lamp.setState(!lampstate);
      }

      if (payload.action === "long") {
        this.lamp.setState(!lampstate);
      }
    }
  };
}
