import { request, gql } from "graphql-request";
import { apiUrl, mongoUrl } from "../../../../components/helpers";

export default class Sensor {
  roomName: string;

  constructor(roomName: string) {
    this.roomName = roomName;
  }

  async getState(locationToSave: any) {
    const query = gql`
      query GetSensor($room: String) {
        response: getSensor(room: $room) {
          room
          temperature
          connected
        }
      }
    `;

    const variables = {
      room: this.roomName,
    };

    const sensor = await request(apiUrl, query, variables);
    return sensor.response;
  }
}
