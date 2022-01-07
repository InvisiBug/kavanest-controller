import { request, gql } from "graphql-request";
import { apiUrl, mongoUrl } from "../helpers";

export default class Sensor {
  roomName: string;

  constructor(roomName: string) {
    this.roomName = roomName;
  }

  async getState() {
    const sensor = await request(
      apiUrl,
      gql`
        query GetSensor($room: String) {
          response: getSensor(room: $room) {
            temperature
            connected
          }
        }
      `,
      {
        room: this.roomName,
      },
    );
    return sensor.response;
  }
}
