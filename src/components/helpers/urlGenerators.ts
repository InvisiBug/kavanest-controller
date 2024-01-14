import * as dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";

var myEnv = dotenv.config();
dotenvExpand(myEnv);

export const apiUrl = String(process.env.API);
export const mqttUrl = String(process.env.MQTT);
