import { ButtonPayload, DeviceConfig } from "@/types";
import { Plug, RGBLight } from "@/components/stores";

// TODO (feat): Implement RBG stript, they are initilized but nothing happens when the button is pressed
// TODO (feat): figure out a way to add single and hold actions back in with the new array stored lights
// TODO (feat): persist lights state in mongo
export default class ButtonController {
  name: string;
  buttonTopic: string;

  lights: Plug[] = [];
  rgbStrips: RGBLight[] = [];

  constructor({ controllerName, buttonTopic, lights, rgbStrips }: Constructor) {
    this.name = controllerName;
    this.buttonTopic = buttonTopic;

    console.log(controllerName);

    lights &&
      lights.forEach((name) => {
        this.lights.push(new Plug(name));
      });

    rgbStrips &&
      rgbStrips.forEach((name) => {
        this.rgbStrips.push(new RGBLight(name));
      });
  }

  handleIncoming = async (topic: String, rawPayload: object) => {
    if (topic == this.buttonTopic) {
      const { action }: ButtonPayload = JSON.parse(rawPayload.toString());
      // const { state: lampstate } = await this.lamp.getState();

      if (action === "single") {
        this.lights.forEach(async (light) => {
          light.setState(true);
        });
      }

      if (action === "double") {
        this.lights.forEach(async (light) => {
          const { state } = await light.getState();
          light.setState(!state);
        });
      }

      if (action === "long") {
        this.lights.forEach(async (light) => {
          light.setState(false);
        });
      }
    }
  };
}

type Constructor = {
  controllerName: string;
  buttonTopic: string;
  lights: string[];
  rgbStrips?: string[];
};
