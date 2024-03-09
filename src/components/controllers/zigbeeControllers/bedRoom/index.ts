import { ButtonPayload, DeviceConfig } from "../../../../types";
import { Plug } from "../../../stores";

export default class BedroomButtons {
  lamp: Plug;
  allLightState = true;

  buttonTopic = "zigbee2mqtt/bedRoomButton";

  constructor() {
    this.lamp = new Plug("bedRoomLamp");
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
