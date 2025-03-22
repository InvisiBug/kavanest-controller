import ButtonController from "./buttonControllers";
import MotionControllers from "./motionControllers";
import { MqttClient } from "mqtt";

export const zigbeeControllers = (client: MqttClient) => {
  const motionSensors: MotionControllers[] = [];
  const buttons: ButtonController[] = [];

  const config = {
    motionSensors: [
      {
        controllerName: "trainingRoom",
        motionTopic: "zigbee2mqtt/trainingRoomMotion",
        buttonTopic: "zigbee2mqtt/kitchenButton",
        lights: ["trainingRoomLamp", "kitchenLamp"],
        rgbStrips: ["kitchenStrip"],
      },
      {
        controllerName: "landing",
        motionTopic: "zigbee2mqtt/landingMotion",
        bulbs: ["landingLight"],
      },
      {
        controllerName: "printerRoom",
        motionTopic: "zigbee2mqtt/printerRoomMotion",
        bulbs: ["printerRoomLight"],
      },

      {
        controllerName: "bedRoom",
        buttonTopic: "zigbee2mqtt/bedRoomButton",
        lights: ["bedRoomLamp"],
      },
      {
        controllerName: "study",
        buttonTopic: "zigbee2mqtt/studyButton",
        motionTopic: "zigbee2mqtt/studyMotion",
        lights: ["studyLamp", "eggChair"],
      },
      {
        controllerName: "livingRoom",
        buttonTopic: "zigbee2mqtt/livingRoomButton",
        lights: ["livingRoomLamp", "floodlight"],
      },
    ],
  };

  //* Simple button controllers (no motion)

  config.motionSensors.forEach((motionSensor) => {
    motionSensors.push(new MotionControllers(motionSensor));
  });

  client.on("message", (topic: string, rawPayload: object) => {
    try {
      motionSensors.forEach((motionSensor) => {
        motionSensor.handleIncoming(topic, rawPayload);
      });

      buttons.forEach((button) => {
        button.handleIncoming(topic, rawPayload);
      });
    } catch (error: unknown) {
      console.log("Error:", error);
    }
  });
};
