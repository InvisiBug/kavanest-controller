import LivingRoomButton from "./buttons/LivingRoomButton";
import StudyButton from "./buttons/studyButton";
import TrainingRoomMotion from "./motion/trainingRoomMotion";

import { ButtonPayload, MotionPayload } from "../../../types";

import mqtt from "mqtt";

const zigbeeDevices: Array<LivingRoomButton | TrainingRoomMotion | StudyButton> = [];

export const zigbeeControllers = (client: mqtt.MqttClient) => {
  zigbeeDevices.push(
    new LivingRoomButton({ topic: "zigbee2mqtt/livingRoomButton" }),
    new StudyButton({ topic: "zigbee2mqtt/studyButton" }),
    new TrainingRoomMotion({ topic: "zigbee2mqtt/trainingRoomMotion" }),
  );

  client.on("message", (topic: string, rawPayload: object) => {
    if (topicExists(zigbeeDevices, topic)) {
      try {
        for (let i = 0; i < zigbeeDevices.length; i++) {
          zigbeeDevices[i].handleIncoming(topic, rawPayload);
        }
      } catch (error: unknown) {
        console.log("Error:", error);
      }
    }
  });
};

function topicExists(devices: typeof zigbeeDevices, givenTopic: string) {
  for (let device in devices) {
    if (devices[device].topic === givenTopic) {
      return true;
    }
  }
  return false;
}
