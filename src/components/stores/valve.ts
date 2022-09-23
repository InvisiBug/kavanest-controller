import { request, gql } from "graphql-request";
import { apiUrl } from "../helpers";

export default class valve {
  roomName: string;

  constructor(roomName: string) {
    this.roomName = roomName;
  }

  async getState() {
    type Data = {
      response: {
        state: boolean;
        connected: boolean;
      };
    };

    const query = gql`
      query GetSensor($room: String) {
        response: getValve(room: $room) {
          state
          connected
        }
      }
    `;

    const variables = {
      room: this.roomName,
    };

    const valve: Data = await request(apiUrl, query, variables);

    return valve.response;
  }

  async setState(state: boolean) {
    type Data = {
      response: {
        room: string;
        state: boolean;
      };
    };

    const query = gql`
      mutation ($input: ValveInput) {
        updateValve(input: $input) {
          room
          state
        }
      }
    `;

    const variables = {
      input: {
        name: this.roomName,
        state,
      },
    };

    const gqlResponse: Data = await request(apiUrl, query, variables);

    return gqlResponse.response;
  }
}
