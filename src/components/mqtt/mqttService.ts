import { apiUrl } from "../helpers/urlGenerators";
import mqtt from "mqtt";

const options = {
  connectTimeout: 2 * 1000,
};

// const mqttUrl = "mqtt://kavanet.io";

export const connectToMQTT = () => {
  const client: mqtt.MqttClient = mqtt.connect(apiUrl, options);

  client.subscribe("#", (error) => {
    if (error) {
      console.log(error);
      console.log("⚠️  MQTT connect error... Restarting");
      process.exit();
    } else {
      console.log(`📡  Listening to ${apiUrl}`);
    }
  });

  return client;
};
