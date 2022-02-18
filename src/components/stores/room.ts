import { request, gql } from "graphql-request";
import { apiUrl, getCurrentSetpoint } from "../helpers";

export default class Demand {
  roomName: string;

  constructor(roomName: string = "") {
    this.roomName = roomName;
  }

  async getRoomData() {
    const query = gql`
      query ($name: String) {
        response: getRoom(name: $name) {
          setpoints {
            weekend
            weekday
          }
          demand
          overrideTime
          disabled
          deadzone
        }
      }
    `;
    const gqlData = await request(apiUrl, query, { name: this.roomName });

    if (!gqlData.response) {
      return;
    } else {
      return gqlData.response;
    }
  }

  async getDisabled() {
    const query = gql`
      query ($name: String) {
        response: getRoom(name: $name) {
          disabled
        }
      }
    `;
    const gqlData = await request(apiUrl, query, { name: this.roomName });

    if (!gqlData.response) {
      return;
    } else {
      return gqlData.response;
    }
  }

  async getCurrentTarget() {
    const query = gql`
      query ($name: String) {
        response: getRoom(name: $name) {
          setpoints {
            weekend
            weekday
          }
        }
      }
    `;
    const gqlData = await request(apiUrl, query, { name: this.roomName });

    if (!gqlData.response) {
      return 0;
    } else {
      return getCurrentSetpoint(gqlData.response.setpoints);
    }
  }

  async anyDemand(): Promise<boolean> {
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
      query ($name: String) {
        response: getRoom(name: $name) {
          demand
        }
      }
    `;
    const gqlData = await request(apiUrl, query, { name: this.roomName });

    if (!gqlData.response) {
      return;
    } else {
      return gqlData.response.demand;
    }
  }

  async setDemand(demand: boolean) {
    const gqlResponse = await request(
      apiUrl,
      gql`
        mutation ($input: RoomInput) {
          updateRoom(input: $input) {
            name
            demand
          }
        }
      `,
      {
        input: { name: this.roomName, demand },
      },
    );
    return gqlResponse.response;
  }
}
