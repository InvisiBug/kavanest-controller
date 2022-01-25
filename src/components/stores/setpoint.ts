import { request, gql } from "graphql-request";
import { apiUrl, getCurrentSetpoint } from "../helpers";

export default class Setpoint {
  roomName: string;

  constructor(roomName: string) {
    this.roomName = roomName;
  }

  async getCurrentSetpoints() {
    const query = gql`
      query GetSetpoint($room: String) {
        response: getSetpoint(room: $room) {
          setpoints {
            weekend
            weekday
          }
          deadzone
        }
      }
    `;

    const gqlData = await request(apiUrl, query, { room: this.roomName });
    return gqlData.response;
  }

  async getCurrentTarget() {
    const query = gql`
      query GetSetpoint($room: String) {
        response: getSetpoint(room: $room) {
          setpoints {
            weekend
            weekday
          }
        }
      }
    `;

    const gqlData = await request(apiUrl, query, { room: this.roomName });
    // handle no data present
    if (!gqlData.response) {
      return;
    } else {
      return getCurrentSetpoint(gqlData.response.setpoints);
    }
  }

  async getDeadzone() {
    const query = gql`
      query GetSetpoint($room: String) {
        response: getSetpoint(room: $room) {
          deadzone
        }
      }
    `;

    const gqlData = await request(apiUrl, query, { room: this.roomName });
    // Handle no deadzone present
    if (!gqlData.response) {
      return 0;
    } else {
      return gqlData.response.deadzone;
    }
  }
}
