import { request, gql } from "graphql-request";
import { apiUrl } from "../helpers";

export default class Sensor {
  roomName: string;

  constructor(roomName: string) {
    this.roomName = roomName;
  }

  async getState(): Promise<{ temperature: number; connected: boolean }> {
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
