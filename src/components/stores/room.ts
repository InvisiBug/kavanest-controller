import { graphql } from "graphql";
import { request, gql } from "graphql-request";
import { apiUrl, getCurrentSetpoint } from "../helpers";

/*
  Available functions
  getRoomData()
  getDisabled();
  gerCurrentTarget();
  anyDemand();
  getDemand();
  setDemand();
*/
export default class Demand {
  roomName: string;

  constructor(roomName: string = "") {
    this.roomName = roomName;
  }

  async getRoomData() {
    type Data = {
      response: {
        setpoints: {
          weekend: Record<string, string>;
          weekday: Record<string, string>;
        };
        demand: number | null;
        overrideTime: string | null;
        disabled: boolean | null;
        deadzone: number | null;
      };
    };

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

    const variables = {
      name: this.roomName,
    };

    const gqlData: Data = await request(apiUrl, query, variables);

    if (!gqlData.response) {
      return;
    } else {
      return gqlData.response;
    }
  }

  async getDisabled() {
    type Data = {
      response: {
        disabled: boolean | null;
      };
    };

    const query = gql`
      query ($name: String) {
        response: getRoom(name: $name) {
          disabled
        }
      }
    `;

    const variables = {
      name: this.roomName,
    };

    const gqlData: Data = await request(apiUrl, query, variables);

    if (!gqlData.response) {
      return;
    } else {
      return gqlData.response;
    }
  }

  async getCurrentTarget() {
    type Data = {
      response: {
        setpoints: {
          weekend: Record<string, string>;
          weekday: Record<string, string>;
        };
      };
    };

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

    const gqlData: Data = await request(apiUrl, query, { name: this.roomName });

    if (!gqlData.response) {
      return 0;
    } else {
      return getCurrentSetpoint(gqlData.response.setpoints);
    }
  }

  async anyDemand() {
    type Data = {
      response: [
        {
          demand: number;
        },
      ];
    };

    const query = gql`
      query {
        response: getRooms {
          demand
        }
      }
    `;

    const gqlResponse: Data = await request(apiUrl, query);

    let anyDemand = false;

    gqlResponse.response.forEach((room: any) => {
      if (room.demand == 1) {
        anyDemand = true;
      }
    });

    return anyDemand;
  }

  async getDemand() {
    type Data = {
      response: {
        demand: number | null;
      };
    };

    const query = gql`
      query ($name: String) {
        response: getRoom(name: $name) {
          demand
        }
      }
    `;

    const variables = { name: this.roomName };

    const gqlData: Data = await request(apiUrl, query, variables);

    if (!gqlData.response) {
      return;
    } else {
      return gqlData.response.demand;
    }
  }

  async setDemand(demand: number) {
    type Data = {
      response: {
        name: string;
        demand: number;
      };
    };

    const mutation = gql`
      mutation ($input: RoomInput) {
        response: updateRoom(input: $input) {
          name
          demand
        }
      }
    `;

    const variables = {
      input: { name: this.roomName, demand },
    };

    const gqlResponse: Data = await request(apiUrl, mutation, variables);

    return gqlResponse.response;
  }
}
