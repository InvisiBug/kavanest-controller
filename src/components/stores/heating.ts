import { request, gql } from "graphql-request";
import { apiUrl } from "../helpers";

export default class Heating {
  constructor() {
    this.getState();
  }

  async getState() {
    type Data = {
      response: {
        state: boolean;
        connected: boolean;
      };
    };

    const query = gql`
      query ($name: String) {
        response: getPlug(name: $name) {
          state
          connected
        }
      }
    `;

    const variables = {
      name: "heating",
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
        _id: string;
      };
    };

    const mutation = gql`
      mutation ($input: PlugInput) {
        updatePlug(input: $input) {
          name
          state
          connected
          _id
        }
      }
    `;

    const variables = {
      input: {
        name: "heating",
        state,
      },
    };

    const gqlResponse: Data = await request(apiUrl, mutation, variables);

    return gqlResponse.response;
  }
}
