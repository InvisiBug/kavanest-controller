import { request, gql } from "graphql-request";
import { apiUrl } from "../helpers";

/*
  The Bulb store
  This class is responsible for dealing with the Bulb data
*/
export default class Bulb {
  name: string;

  constructor(name: string) {
    this.name = name;
    this.getState();
  }

  async getState() {
    type Data = {
      response: {
        name: string;
        state: boolean;
        brightness: number;
        colour_mode: string;
        colour_temp: number;
        connected: boolean;
        linkQuality: number;
        room: string;
        type: string;
      };
    };

    const query = gql`
      query ($name: String) {
        response: getBulb(name: $name) {
          name
          state
          connected
        }
      }
    `;

    const variables = {
      name: this.name,
    };

    const gqlResponse: Data = await request(apiUrl, query, variables);

    return gqlResponse.response;
  }

  async setState(state: boolean) {
    type Data = {
      response: {
        name: string;
        state: boolean;
        connected: boolean;
        _id: number;
      };
    };

    const mutation = gql`
      mutation ($input: BulbInput) {
        response: updateBulb(input: $input) {
          name
          state
          connected
          _id
        }
      }
    `;

    const variables = {
      input: {
        name: this.name,
        state,
      },
    };

    const gqlResponse: Data = await request(apiUrl, mutation, variables);

    return gqlResponse.response;
  }
}
