import TrainingRoom from "./trainingRoom";
import Bedroom from "./bedRoom";
import LivingRoom from "./livingRoom";
import Study from "./study";
import Landing from "./Landing";
import ButtonController from "./buttonControllers";
import MotionControllers from "./motionControllers";

import { MqttClient } from "mqtt";

export const zigbeeControllers = (client: MqttClient) => {
  const study = new Study();
  const livingRoom = new LivingRoom();
  const landing = new Landing();

  const motionSensors: MotionControllers[] = [];

  motionSensors.push(
    new MotionControllers({
      controllerName: "trainingRoom",
      motionTopic: "zigbee2mqtt/trainingRoomMotion",
      buttonTopic: "zigbee2mqtt/kitchenButton",
      lights: ["trainingRoomLamp", "kitchenLamp"],
      rgbStrips: ["kitchenStrip"],
    }),
  );

  //* Simple button controllers (no motion)
  const bedroom = new ButtonController("zigbee2mqtt/bedRoomButton", "bedRoomLamp");

  client.on("message", (topic: string, rawPayload: object) => {
    try {
      study.handleIncoming(topic, rawPayload);
      // trainingRoom.handleIncoming(topic, rawPayload);
      bedroom.handleIncoming(topic, rawPayload);
      livingRoom.handleIncoming(topic, rawPayload);
      landing.handleIncoming(topic, rawPayload);

      motionSensors.forEach((motionSensor) => {
        motionSensor.handleIncoming(topic, rawPayload);
      });
    } catch (error: unknown) {
      console.log("Error:", error);
    }
  });
};
