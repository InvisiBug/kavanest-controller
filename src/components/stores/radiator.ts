import { request, gql } from "graphql-request";
import { apiUrl } from "../helpers";

export default class Radiator {
  room: string;
  constructor(room: string) {
    this.room = room;
  }

  async getTemp() {
    type Data = {
      response: {
        inlet: number;
        outlet: number;
      };
    };

    const query = gql`
      query GetRadiator($room: String) {
        response: getRadiator(room: $room) {
          inlet
          outlet
        }
      }
    `;

    const variables = {
      room: this.room,
    };

    const gqlResponse: Data = await request(apiUrl, query, variables);

    return gqlResponse.response;
  }
}
