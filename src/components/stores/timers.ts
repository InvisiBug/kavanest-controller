import { request, gql } from "graphql-request";
import { apiUrl } from "../helpers";

export default class Timers {
  name: string;
  constructor(name: string) {
    this.name = name;
  }

  async getTimer(): Promise<number | null> {
    const query = gql`
      query ($name: String) {
        response: getTimer(name: $name) {
          value
        }
      }
    `;

    const variables = {
      name: this.name,
    };

    try {
      const gqlResponse = await request(apiUrl, query, variables);

      return gqlResponse.response.value;
    } catch (error) {
      // console.log(`${this.name} timer:\n`, error);
      return null;
    }
  }

  async setTimer(value: number) {
    const mutation = gql`
      mutation ($input: TimerInput) {
        response: updateTimer(input: $input) {
          name
          value
        }
      }
    `;

    const variables = {
      input: {
        name: this.name,
        value,
      },
    };

    try {
      const gqlResponse = await request(apiUrl, mutation, variables);

      console.log(gqlResponse);

      return gqlResponse.response;
    } catch (error) {
      console.log(error);
    }
  }
}
