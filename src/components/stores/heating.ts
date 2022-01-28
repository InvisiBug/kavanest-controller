import { request, gql } from "graphql-request";
import { apiUrl } from "../helpers";

export default class Heating {
  constructor() {
    this.getState();
  }

  async getState() {
    const gqlResponse = await request(
      apiUrl,
      gql`
        query ($name: String) {
          response: getPlug(name: $name) {
            state
            connected
          }
        }
      `,
      { name: "heating" },
    );
    return gqlResponse.response;
  }

  async setState(state: boolean) {
    const gqlResponse = await request(
      apiUrl,
      gql`
        mutation ($input: PlugInput) {
          updatePlug(input: $input) {
            name
            state
            connected
            _id
          }
        }
      `,
      {
        input: { name: "heating", state },
      },
    );
    return gqlResponse.response;
  }

  // async setDemand(state:boolean) {
  //   const valve = await request(
  //     apiUrl,
  //     gql`
  //       query GetSensor($room: String) {
  //         response: getValve(room: $room) {
  //           state
  //           demand
  //           connected
  //           _id
  //         }
  //       }
  //     `,
  //     { room: this.roomName },
  //   );
  // }
}
