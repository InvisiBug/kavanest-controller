import { Button, TrainingRoomMotion, StudyButton } from "..";
import { ButtonPayload } from "../../../types";

import mqtt from "mqtt";

const zigbeeDevices: Array<Button | TrainingRoomMotion | StudyButton> = [];

export const zigbeeControllers = (client: mqtt.MqttClient) => {
  zigbeeDevices.push(
    new Button({ topic: "zigbee2mqtt/livingRoomButton" }),
    new StudyButton({ topic: "zigbee2mqtt/studyButton" }),
    new TrainingRoomMotion({ topic: "zigbee2mqtt/trainingRoomMotion" }),
  );

  client.on("message", (topic: string, rawPayload: object) => {
    if (topicExists(zigbeeDevices, topic)) {
      console.log("boop");
      try {
        const payload: ButtonPayload = JSON.parse(rawPayload.toString());

        for (let i = 0; i < zigbeeDevices.length; i++) {
          zigbeeDevices[i].handleIncoming(topic, payload);
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
