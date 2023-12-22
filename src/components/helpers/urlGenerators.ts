import * as dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";

var myEnv = dotenv.config();
dotenvExpand(myEnv);
console.log(process.env.API);
export const apiUrl = String(process.env.API);
