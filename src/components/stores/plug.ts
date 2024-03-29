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
    this.getState();
  }

  async getState() {
    type Data = {
      response: {
        name: string;
        state: boolean;
        connected: boolean;
      };
    };

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

    const gqlResponse: Data = await request(apiUrl, mutation, variables);

    return gqlResponse.response;
  }
}
