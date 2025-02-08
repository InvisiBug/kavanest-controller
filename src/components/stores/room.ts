import { graphql } from "graphql";
import { request, gql } from "graphql-request";
import { apiUrl, getCurrentSetpoint } from "../helpers";

/*
  * Available functions
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
    const query = gql`
      query ($name: String) {
        response: getRoom(name: $name) {
          setpoints {
            weekend
            weekday
          }
          demand
          overrideTime
          overrideType
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

    type Data = {
      response: {
        setpoints: {
          weekend: Record<string, string>;
          weekday: Record<string, string>;
        };
        demand: number | null;
        overrideTime: number | null;
        overrideType: string | null;
        disabled: boolean | null;
        deadzone: number | null;
      };
    };
  }

  async getDisabled() {
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

    type Data = {
      response: {
        disabled: boolean | null;
      };
    };
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

    const gqlData: Data = await request(apiUrl, query, { name: this.roomName });

    if (!gqlData.response) {
      return 0;
    } else {
      return getCurrentSetpoint(gqlData.response.setpoints);
    }

    type Data = {
      response: {
        setpoints: {
          weekend: Record<string, string>;
          weekday: Record<string, string>;
        };
      };
    };
  }

  async anyDemand() {
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

    type Data = {
      response: [
        {
          demand: number;
        },
      ];
    };
  }

  async getDemand() {
    const query = gql`
      query ($name: String) {
        response: getRoom(name: $name) {
          demand
        }
      }
    `;

    const variables = { name: this.roomName };

    const gqlData: Data = await request(apiUrl, query, variables);

    // TODO: (investigation): Is this needed for first boot when there are no data points in mongo?
    if (!gqlData.response) {
      return;
    } else {
      return gqlData.response.demand;
    }

    type Data = {
      response: {
        demand: number | null;
      };
    };
  }

  async setDemand(demand: number) {
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

    type Data = {
      response: {
        name: string;
        demand: number;
      };
    };
  }
}
