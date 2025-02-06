import { DeviceConfig, MotionPayload, ButtonPayload } from "@/types";
import { Plug, RGBLight, MotionController } from "@/components/stores";
import { decamelize } from "@/components/helpers";

const log = false;

/**
 * This motion controller requires a button, a motion sensor and a light
 *
 */
export default class MotionControllers {
  name: string;
  lights: Plug[] = [];
  rgbStrips: RGBLight[] = [];

  motionTopic: string;
  buttonTopic: string;

  motionController: MotionController;

  constructor({ controllerName, motionTopic, buttonTopic, lights, rgbStrips }: Constructor) {
    this.name = controllerName;
    this.motionTopic = motionTopic;
    this.buttonTopic = buttonTopic;

    lights &&
      lights.forEach((name) => {
        this.lights.push(new Plug(name));
      });

    rgbStrips &&
      rgbStrips.forEach((name) => {
        this.rgbStrips.push(new RGBLight(name));
      });

    this.motionController = new MotionController(controllerName);
  }

  handleIncoming = async (topic: string, rawPayload: object) => {
    if (![this.motionTopic, this.buttonTopic].includes(topic)) return; // Return if the incoming topic isnt this rooms motion or button topic

    if (log) console.log("🚀 ~ MotionControllers ~ handleIncoming= ~ topic:", topic);

    if (log) console.log(`\n* ${decamelize(this.name)} Motion Controller *`);

    // Checks to see if a motion controller object exists, if not it creates one
    if ((await this.motionController.getMotionController()) === null) {
      if (log) console.log("Motion controller object not found in the mongo store, creating...");
      this.motionController.setMotionController({
        motionTriggered: false,
        allLights: false,
        armed: true,
      });
    }

    const { motionTriggered, armed, allLights } = (await this.motionController.getMotionController()) || {};

    if (log) console.log("motionTriggered: ", motionTriggered, "armed: ", armed, "allLights: ", allLights);

    if (motionTriggered === null || armed === null || allLights === null) {
      if (log) console.log("Motion controller object not found");
      return;
    }

    /*
     * Button
     */
    if (topic === this.buttonTopic) {
      const { action }: ButtonPayload = JSON.parse(rawPayload.toString());

      if (log) console.log("Button action:", action);

      if (action === "single") {
        this.lights.forEach(async (light) => {
          const lightState = await light.getState();
          light.setState(!lightState.state);
        });
      }

      if (action === "double") {
        if (motionTriggered && allLights) {
          if (log) console.log("Turned on by motion then button was pressed, disarming");
          this.motionController.setMotionController({
            motionTriggered: false,
            armed: false,
          });
          // Make something flash here
          return;
        }

        // Lights are on, arm system and turn off lights
        if (allLights) {
          if (log) console.log("Lights are on, arming system and turning off the lights");

          this.lights.forEach((light) => {
            light.setState(false);
          });

          this.rgbStrips.forEach((rgbStrip) => {
            rgbStrip.setState(false);
          });

          this.motionController.setMotionController({
            allLights: false,
            armed: true,
          });
        }
        //     // Lights are off, disarm system and turn on lights
        if (!allLights) {
          if (log) console.log("Lights are off, disarming system and turning on the lights");

          this.lights.forEach((light) => {
            light.setState(true);
          });

          this.rgbStrips.forEach((rgbStrip) => {
            rgbStrip.setState(true);
          });

          this.motionController.setMotionController({
            allLights: true,
            armed: false,
          });
        }
      }
    }

    /*
     * Motion
     */
    if (topic === this.motionTopic) {
      const { occupancy }: MotionPayload = JSON.parse(rawPayload.toString());
      if (log) console.log("Motion, occupancy:", occupancy);

      if (occupancy) {
        if (!armed) return;

        this.lights.forEach(async (light) => {
          light.setState(true);
        });

        this.rgbStrips.forEach(async (rgb) => {
          rgb.setState(true);
        });

        this.motionController.setMotionController({
          motionTriggered: true,
          allLights: true,
        });
      }

      if (!occupancy) {
        if (!armed) return;

        this.lights.forEach(async (light) => {
          light.setState(false);
        });

        this.rgbStrips.forEach(async (rgb) => {
          rgb.setState(false);
        });

        this.motionController.setMotionController({
          motionTriggered: false,
          allLights: false,
        });
      }
    }
  };
}

type Constructor = {
  controllerName: string;
  motionTopic: string;
  buttonTopic: string;
  lights: string[];
  rgbStrips: string[];
};
