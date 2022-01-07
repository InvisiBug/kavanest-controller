import { request, gql } from "graphql-request";
import { apiUrl, mongoUrl } from "../helpers";

export default class Room {
  roomName: string;

  constructor(roomName: string) {
    this.roomName = roomName;
  }

  async anyDemand() {
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

  async getDemand() {
    const gqlResponse = await request(
      apiUrl,
      gql`
        query ($room: String) {
          response: getRoom(room: $room) {
            demand
          }
        }
      `,
      {
        room: this.roomName,
      },
    );
    console.log(gqlResponse);
    return gqlResponse.response;
  }

  async setDemand(state: boolean) {
    const gqlResponse = await request(
      apiUrl,
      gql`
        mutation ($input: RoomInput) {
          updateRoom(input: $input) {
            room
            demand
          }
        }
      `,
      {
        input: { name: this.roomName, state },
      },
    );
    console.log(gqlResponse);
    return gqlResponse.response;
  }
}
