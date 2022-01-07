import { request, gql } from "graphql-request";
import { apiUrl } from "../helpers";

export default class valve {
  roomName: string;

  constructor(roomName: string) {
    this.roomName = roomName;
  }

  async getState() {
    const valve = await request(
      apiUrl,
      gql`
        query GetSensor($room: String) {
          response: getValve(room: $room) {
            state
            demand
            connected
            _id
          }
        }
      `,
      { room: this.roomName },
    );
    return valve.response;
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
