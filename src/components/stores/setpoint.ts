import { request, gql } from "graphql-request";
import { apiUrl, getCurrentSetpoint } from "../helpers";

export default class Setpoint {
  roomName: string;

  constructor(roomName: string) {
    this.roomName = roomName;
  }

  async getCurrentSetpoints() {
    const gqlData = await request(
      apiUrl,
      gql`
        query GetSetpoint($room: String) {
          response: getSetpoint(room: $room) {
            setpoints {
              weekend
              weekday
            }
            deadzone
          }
        }
      `,
      { room: this.roomName },
    );

    return gqlData.response;
  }

  async getCurrentTarget() {
    const gqlData = await request(
      apiUrl,
      gql`
        query GetSetpoint($room: String) {
          response: getSetpoint(room: $room) {
            setpoints {
              weekend
              weekday
            }
          }
        }
      `,
      { room: this.roomName },
    );

    // handle no data present
    if (!gqlData.response) {
      return null;
    } else {
      return getCurrentSetpoint(gqlData.response.setpoints);
    }
  }

  async getDeadzone() {
    const gqlData = await request(
      apiUrl,
      gql`
        query GetSetpoint($room: String) {
          response: getSetpoint(room: $room) {
            deadzone
          }
        }
      `,
      { room: this.roomName },
    );

    // Handle no deadzone present
    if (!gqlData.response) {
      return 0;
    } else {
      return gqlData.response.deadzone;
    }
  }
}
