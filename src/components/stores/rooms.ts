import { request, gql } from "graphql-request";
import { apiUrl, mongoUrl } from "../helpers";

export default class Room {
  roomName: string;

  constructor(roomName: string = "") {
    this.roomName = roomName;
  }

  async anyDemand() {
    const gqlResponse = await request(
      apiUrl,
      gql`
        query {
          response: getRooms {
            demand
          }
        }
      `,
    );

    let anyDemand = false;

    gqlResponse.response.forEach((room: any) => {
      if (room.demand === true) {
        anyDemand = true;
      }
    });

    return anyDemand;
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
    return gqlResponse.response;
  }
}
