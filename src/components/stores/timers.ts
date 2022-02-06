import { request, gql } from "graphql-request";
import { apiUrl } from "../helpers";

export default class Timers {
  name: string;
  constructor(name: string) {
    this.name = name;
  }

  async getTimer(): Promise<number | null> {
    try {
      const gqlResponse = await request(
        apiUrl,
        gql`
          query ($timer: String) {
            response: getTimer(timer: $timer) {
              value
            }
          }
        `,
        { name: this.name },
      );
      return gqlResponse.response.value;
    } catch (error) {
      console.log(`${this.name} timer:\n`, error);
      // return null;
      return null;
    }
  }

  async setTimer(value: number) {
    try {
      const gqlResponse = await request(
        apiUrl,
        gql`
          mutation ($input: TimerInput) {
            updateTimer(input: $input) {
              name
              value
            }
          }
        `,
        {
          input: { name: this.name, value },
        },
      );
      return gqlResponse.response;
    } catch (error) {
      console.log(error);
    }
  }
}
