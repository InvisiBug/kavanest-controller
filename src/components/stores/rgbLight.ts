import { request, gql } from "graphql-request";
import { apiUrl } from "../helpers";

export default class RGBLight {
  name: string;

  constructor(name: string) {
    this.name = name;
    this.getState();
  }

  async getState() {
    const query = gql`
      query ($name: String) {
        response: getPlug(name: $name) {
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
        state: boolean;
        connected: boolean;
      };
    };
  }

  async setState(state: boolean) {
    const mutation = gql`
      mutation ($input: RGBLightInput) {
        updateRGBLights(input: $input) {
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
        _id: string;
      };
    };
  }
}
