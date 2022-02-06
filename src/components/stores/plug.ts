import { request, gql } from "graphql-request";
import { apiUrl } from "../helpers";

export default class Plug {
  name: string;

  constructor(name: string) {
    this.name = name;
    this.getState();
  }

  async getState(): Promise<{ name: string; state: boolean; connected: boolean }> {
    const gqlResponse = await request(
      apiUrl,
      gql`
        query ($name: String) {
          response: getPlug(name: $name) {
            name
            state
            connected
          }
        }
      `,
      { name: this.name },
    );

    return gqlResponse.response;
  }

  async setState(state: boolean): Promise<{ mane: string; state: boolean; connected: boolean; _id: number }> {
    const gqlResponse = await request(
      apiUrl,
      gql`
        mutation ($input: PlugInput) {
          response: updatePlug(input: $input) {
            name
            state
            connected
            _id
          }
        }
      `,
      {
        input: { name: this.name, state },
      },
    );

    return gqlResponse.response;
  }
}
