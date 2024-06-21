import TrainingRoom from "./trainingRoom";
import Bedroom from "./bedRoom";
import LivingRoom from "./livingRoom";
import Study from "./study";
import Landing from "./Landing";

import mqtt from "mqtt";

export const zigbeeControllers = (client: mqtt.MqttClient) => {
  const study = new Study();
  const trainingRoom = new TrainingRoom();
  const bedroom = new Bedroom();
  const livingRoom = new LivingRoom();
  const landing = new Landing();

  client.on("message", (topic: string, rawPayload: object) => {
    try {
      study.handleIncoming(topic, rawPayload);
      trainingRoom.handleIncoming(topic, rawPayload);
      bedroom.handleIncoming(topic, rawPayload);
      livingRoom.handleIncoming(topic, rawPayload);
      landing.handleIncoming(topic, rawPayload);
    } catch (error: unknown) {
      console.log("Error:", error);
    }
  });
};
