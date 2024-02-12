import { DeviceConfig, MotionPayload, ButtonPayload } from "../../../../types";
import { Plug, RGBLight } from "../../../stores";

export default class TrainingRoom {
  trainingRoomPlug: Plug;
  rgbStrip: RGBLight;

  allLightState = true;

  motionTopic = "zigbee2mqtt/trainingRoomMotion";
  buttonTopic = "zigbee2mqtt/kitchenButton";

  motionArmed = true;
  onByMotion = false;

  constructor() {
    this.trainingRoomPlug = new Plug("trainingRoomLamp");
    this.rgbStrip = new RGBLight("kitchenStrip");
  }

  handleIncoming = async (topic: string, rawPayload: object) => {
    // if (topic !== this.buttonTopic || topic !== this.motionTopic) return;
    // console.log(topic);

    if (![this.motionTopic, this.buttonTopic].includes(topic)) return;
    console.log(topic);

    /*
     * Button
     */
    if (topic === this.buttonTopic) {
      const { action }: ButtonPayload = JSON.parse(rawPayload.toString());
      console.log("Button, action:", action);

      if (action === "single") {
        const plugState = await this.trainingRoomPlug.getState();
        this.trainingRoomPlug.setState(!plugState.state);
      }

      if (action === "double") {
        if (this.onByMotion && this.allLightState) {
          console.log("Turned on by motion, disarming");
          this.onByMotion = false;
          this.motionArmed = false;

          // Make something flash here
          return;
        }

        // Lights are on, arm system and turn off lights
        if (this.allLightState) {
          this.motionArmed = true;
          console.log("Lights are on, arming system and turning off the lights");
        }

        // Lights are off, disarm system and turn on lights
        if (!this.allLightState) {
          this.motionArmed = false;
          console.log("Lights are off, disarming system and turning on the lights");
        }

        this.trainingRoomPlug.setState(!this.allLightState);
        this.rgbStrip.setState(!this.allLightState);

        this.allLightState = !this.allLightState;
      }
    }

    /*
     * Motion
     */
    if (topic === this.motionTopic) {
      const { occupancy }: MotionPayload = JSON.parse(rawPayload.toString());
      console.log("Motion, occupancy:", occupancy);

      if (occupancy === true) {
        if (this.motionArmed === false) return;

        this.onByMotion = true;

        this.trainingRoomPlug.setState(true);
        this.rgbStrip.setState(true);
        this.allLightState = true;
      }

      if (occupancy === false) {
        if (this.motionArmed === false) return;

        this.onByMotion = false;

        this.trainingRoomPlug.setState(false);
        this.rgbStrip.setState(false);
        this.allLightState = false;
      }
    }
  };
}
