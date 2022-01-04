import Mongo from "./mongo";
import { mongoUrl } from "../helpers";

const db = "devices";
console.log("🔗 Connecting to ", mongoUrl, "\n🔗 successful database connections made to the following");

export const rgbLightStore = new Mongo(db, "rgbLights").collection;
export const radiatorStore = new Mongo(db, "radiators").collection;
export const offsetStore = new Mongo(db, "offsets").collection;
export const sensorStore = new Mongo(db, "sensors").collection;
export const valveStore = new Mongo(db, "valves").collection;
export const plugStore = new Mongo(db, "plugs").collection;

export const specialsStore = new Mongo(db, "specials").collection;
export const options = { new: true, upsert: true };
