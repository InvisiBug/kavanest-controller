import { request, gql } from "graphql-request";
import { apiUrl } from "../helpers";

export default class Sensor {
  roomName: string;

  constructor(roomName: string) {
    this.roomName = roomName;
  }

  async getState() {
    const query = gql`
      query GetSensor($room: String) {
        response: getSensor(room: $room) {
          temperature
          connected
        }
      }
    `;

    const variables = {
      room: this.roomName,
    };

    const { response }: Data = await request(apiUrl, query, variables);

    return response;

    type Data = {
      response: {
        temperature: number;
        connected: boolean;
      };
    };
  }
}
