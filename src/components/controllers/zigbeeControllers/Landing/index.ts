import { DeviceConfig, MotionPayload, ButtonPayload } from "../../../../types";
import { Bulb, RGBLight } from "../../../stores";

export default class Study {
  landingLight: Bulb;

  allLightState = true;

  motionTopic = "zigbee2mqtt/landingMotion";
  buttonTopic = "zigbee2mqtt/landingButton";

  armed = true;
  onByMotion = false;

  constructor() {
    this.landingLight = new Bulb("landingLight");
  }

  handleIncoming = async (topic: string, rawPayload: object) => {
    if (![this.motionTopic, this.buttonTopic].includes(topic)) return;
    console.log("Landing", topic);
    /*
     * Button
     */
    if (topic === this.buttonTopic) {
      const { action }: ButtonPayload = JSON.parse(rawPayload.toString());
      console.log("Button, action:", action);

      if (action === "single") {
        const landingLight = await this.landingLight.getState();
        this.landingLight.setState(!landingLight.state);
      }

      if (action === "double") {
        if (this.onByMotion && this.allLightState) {
          console.log("Turned on by motion, disarming");
          this.onByMotion = false;
          this.armed = false;

          // Make something flash here
          return;
        }

        // Lights are on, arm system and turn off lights
        if (this.allLightState) {
          this.armed = true;
          console.log("Lights are on, arming system and turning off the lights");
        }

        // Lights are off, disarm system and turn on lights
        if (!this.allLightState) {
          this.armed = false;
          console.log("Lights are off, disarming system and turning on the lights");
        }

        this.landingLight.setState(!this.allLightState);
        this.allLightState = !this.allLightState;
      }

      if (action === "long") {
      }
    }

    /*
     * Motion
     */
    if (topic === this.motionTopic) {
      const { occupancy }: MotionPayload = JSON.parse(rawPayload.toString());
      console.log("Motion, occupancy:", occupancy, "Armed:", this.armed);

      if (occupancy === true) {
        if (this.armed === false) return;

        this.onByMotion = true;

        this.landingLight.setState(true);
        this.allLightState = true;
      }

      if (occupancy === false) {
        if (this.armed === false) return;

        this.onByMotion = false;

        this.landingLight.setState(false);
        this.allLightState = false;
      }
    }
  };
}
