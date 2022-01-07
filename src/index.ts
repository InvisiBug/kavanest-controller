import { apiUrl, mongoUrl } from "./components/helpers";
import { request, gql } from "graphql-request";
import { RoomDemandSetter, ValveController, TimeSetter, Heating } from "./components/controllers";

const query = gql`
  query {
    getValves {
      room
      state
      demand
      connected
      _id
    }
  }
`;

// request(apiUrl, query).then((data) => {
//   const valves = data.getValves;

//   valves.forEach((valve: any) => {
//     new RoomController(valve.room);
//   });
//   // console.log(valves);
// });

new RoomDemandSetter("frontStudy");
new ValveController("frontStudy");

new TimeSetter();

new Heating();
