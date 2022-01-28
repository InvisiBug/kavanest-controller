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
    const query = gql`
      query ($room: String) {
        response: getRoom(room: $room) {
          demand
        }
      }
    `;
    const gqlData = await request(apiUrl, query, { room: this.roomName });

    if (!gqlData.response) {
      return;
    } else {
      return gqlData.response.demand;
    }
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
