import { apiUrl, mongoUrl } from "./components/helpers";
import { request, gql } from "graphql-request";
import { RoomDemandSetter, Valve, TimeSetter, Heating } from "./components/controllers";

let devices: Array<any> = [];

request(
  apiUrl,
  gql`
    query {
      response: getValves {
        room
        state
        demand
        connected
        _id
      }
    }
  `,
).then((data) => {
  data.response.forEach((valve: any) => {
    // console.log(valve.room);
    devices.push(new RoomDemandSetter(valve.room));
    devices.push(new Valve(valve.room));
  });
});

devices.push(new TimeSetter());
devices.push(new Heating());

setInterval(() => {
  try {
    for (let i = 0; i < devices.length; i++) {
      devices[i].tick();
    }
  } catch (error: unknown) {
    console.log(error);
  }
}, 2 * 1000);

console.log("Hello from Skippy");
