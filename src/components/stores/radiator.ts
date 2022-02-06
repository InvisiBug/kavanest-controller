import { request, gql } from "graphql-request";
import { apiUrl } from "../helpers";

export default class Radiator {
  room: string;
  constructor(room: string) {
    this.room = room;
  }

  async getTemp(): Promise<{ inlet: number; outlet: number }> {
    const gqlResponse = await request(
      apiUrl,
      gql`
        query GetRadiator($room: String) {
          response: getRadiator(room: $room) {
            inlet
            outlet
          }
        }
      `,
      { room: this.room },
    );
    return gqlResponse.response;
  }
}
