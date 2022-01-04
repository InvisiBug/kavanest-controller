import { request, gql } from "graphql-request";
import { apiUrl, mongoUrl } from "../../../../components/helpers";

export default class valve {
  roomName: string;

  constructor(roomName: string) {
    this.roomName = roomName;
  }

  async getState(locationToSave: any) {
    const query = gql`
      query GetSensor($room: String) {
        response: getValve(room: $room) {
          state
          demand
          connected
          _id
        }
      }
    `;

    const variables = {
      room: this.roomName,
    };

    const valve = await request(apiUrl, query, variables);
    return valve.response;
  }
}
