import { request, gql } from "graphql-request";
import { apiUrl } from "../helpers";

export default class MotionControllers {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  async getMotionController() {
    type Data = {
      response: {
        motionTriggered: boolean | null;
        armed: boolean | null;
        allLights: boolean | null;
      };
    };

    const query = gql`
      query ($name: String) {
        response: getMotionController(name: $name) {
          motionTriggered
          armed
          allLights
        }
      }
    `;

    const variables = {
      name: this.name,
    };

    try {
      const { response }: Data = await request(apiUrl, query, variables);

      return response;
    } catch (error) {
      return null;
    }
  }

  async setMotionController({ motionTriggered, armed, allLights }: { motionTriggered?: boolean; armed?: boolean; allLights?: boolean }) {
    type Data = {
      response: {
        name: string;
        motionTriggered: boolean;
        armed: boolean;
        allLights: boolean;
      };
    };

    const mutation = gql`
      mutation ($input: MotionControllerInput) {
        response: updateMotionController(input: $input) {
          name
          motionTriggered
          armed
          allLights
        }
      }
    `;

    const variables = {
      input: {
        name: this.name,
        motionTriggered,
        armed,
        allLights,
      },
    };

    try {
      const { response }: Data = await request(apiUrl, mutation, variables);

      return response;
    } catch (error) {
      console.log(error);
    }
  }
}
