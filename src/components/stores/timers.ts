import { request, gql } from "graphql-request";
import { apiUrl } from "../helpers";

export default class Timers {
  name: string;
  constructor(name: string) {
    this.name = name;
  }

  async getTimer() {
    type Data = {
      response: {
        value: number | null;
      };
    };
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
      const gqlResponse: Data = await request(apiUrl, query, variables);

      return gqlResponse.response.value;
    } catch (error) {
      return null;
    }
  }

  async setTimer(value: number) {
    type Data = {
      response: {
        name: string;
        value: number;
      };
    };
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
      const gqlResponse: Data = await request(apiUrl, mutation, variables);

      return gqlResponse.response;
    } catch (error) {
      console.log(error);
    }
  }
}
