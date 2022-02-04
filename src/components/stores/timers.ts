import { request, gql } from "graphql-request";
import { apiUrl } from "../helpers";

export default class Timers {
  name: string;
  constructor(name: string) {
    this.name = name;
  }

  async getTimer() {
    try {
      const gqlResponse = await request(
        apiUrl,
        gql`
          query ($timer: String) {
            response: getTimer(timer: $timer) {
              timer
              value
            }
          }
        `,
        { timer: this.name },
      );
      return gqlResponse.response.value;
    } catch (error) {
      console.log(error);
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
              timer
              value
            }
          }
        `,
        {
          input: { timer: this.name, value },
        },
      );
      return gqlResponse.response;
    } catch (error) {
      console.log(error);
    }
  }
}
