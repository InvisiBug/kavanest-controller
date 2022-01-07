import { apiUrl, mongoUrl } from "./components/helpers";
import { request, gql } from "graphql-request";
import { RoomDemandSetter, ValveController, TimeSetter, Heating } from "./components/controllers";

const query = gql`
  query {
    response: getValves {
      room
      state
      demand
      connected
      _id
    }
  }
`;

// new TimeSetter();
// new Heating();

let devices: Array<any> = [];
request(apiUrl, query).then((data) => {
  data.response.forEach((valve: any) => {
    console.log(valve.room);
    devices.push(new RoomDemandSetter(valve.room));
    devices.push(new ValveController(valve.room));
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
}, 5);
