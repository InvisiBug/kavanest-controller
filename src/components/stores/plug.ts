import { request, gql } from "graphql-request";
import { apiUrl } from "../helpers";

/*
  The Plug store
  This class is responsible for dealing with the plug data
*/
export default class Plug {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  async getState() {
    const query = gql`
      query ($name: String) {
        response: getPlug(name: $name) {
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
        connected: boolean;
      };
    };
  }

  async setState(state: boolean) {
    const mutation = gql`
      mutation ($input: PlugInput) {
        response: updatePlug(input: $input) {
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

    return response;

    type Data = {
      response: {
        name: string;
        state: boolean;
        connected: boolean;
        _id: number;
      };
    };
  }
}
