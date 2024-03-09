import { DeviceConfig, MotionPayload, ButtonPayload } from "../../../../types";
import { Plug, RGBLight } from "../../../stores";

export default class Study {
  eggChair: Plug;
  studyLamp: Plug;

  allLightState = true;

  motionTopic = "zigbee2mqtt/studyMotion";
  buttonTopic = "zigbee2mqtt/studyButton";

  armed = true;
  onByMotion = false;

  constructor() {
    this.eggChair = new Plug("eggChair");
    this.studyLamp = new Plug("studyLamp");
  }

  handleIncoming = async (topic: string, rawPayload: object) => {
    // if (topic !== this.buttonTopic || topic !== this.motionTopic) return;

    if (![this.motionTopic, this.buttonTopic].includes(topic)) return;

    /*
     * Button
     */
    if (topic === this.buttonTopic) {
      const { action }: ButtonPayload = JSON.parse(rawPayload.toString());
      console.log("Button, action:", action);

      if (action === "single") {
        const eggChairState = await this.eggChair.getState();
        this.eggChair.setState(!eggChairState.state);
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

        this.eggChair.setState(!this.allLightState);
        this.studyLamp.setState(!this.allLightState);
        this.allLightState = !this.allLightState;
      }

      if (action === "long") {
        const studyLampstate = await this.studyLamp.getState();
        this.studyLamp.setState(!studyLampstate.state);
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

        this.eggChair.setState(true);
        this.studyLamp.setState(true);
        this.allLightState = true;
      }

      if (occupancy === false) {
        if (this.armed === false) return;

        this.onByMotion = false;

        this.eggChair.setState(false);
        this.studyLamp.setState(false);
        this.allLightState = false;
      }
    }
  };
}
