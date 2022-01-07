import { request, gql } from "graphql-request";
import { apiUrl } from "../helpers";

export default class Timers {
  constructor() {}

  async getTimer(timer: string) {
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
      { timer },
    );
    return gqlResponse.response.value;
  }

  // !not working yet
  // async getAllTimers(timer: string) {
  //   const gqlResponse = await request(
  //     apiUrl,
  //     gql`
  //       query {
  //         getTimers {
  //           timer
  //           value
  //         }
  //       }
  //     `,
  //     { timer },
  //   );
  //   console.log(gqlResponse);
  //   // return gqlResponse.response.value;
  // }

  async setTimer(timer: string, value: number) {
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
        input: { timer, value },
      },
    );
    return gqlResponse.response;
  }
}
