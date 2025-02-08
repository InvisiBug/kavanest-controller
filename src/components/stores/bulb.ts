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

    const { response }: Data = await request(apiUrl, query, variables);

    return response;

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

    const { response }: Data = await request(apiUrl, mutation, variables);

    return { response };
  }
}
