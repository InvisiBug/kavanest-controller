import * as dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";
var myEnv = dotenv.config();
dotenvExpand(myEnv);

export const mongoUrl: string = process.env.MONGO ?? "";
export const apiUrl: string = process.env.API ?? "";