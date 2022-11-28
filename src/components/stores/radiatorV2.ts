import { request, gql } from "graphql-request";
import { apiUrl } from "../helpers";

export default class RadiatorV2 {
  name: string;
  constructor(name: string) {
    this.name = name;
  }

  async getData() {
    type Data = {
      response: {
        valve: boolean;
        fan: boolean | null;
        temperature: number | null;
        connected: boolean;
      };
    };

    const query = gql`
      query GetRadiator($name: String) {
        response: getRadiator(name: $name) {
          valve
          fan
          temperature
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

  setValveState = async (state: boolean) => {
    type Data = {
      response: {
        name: string;
        valve: boolean;
        fan: boolean | null;
        temperature: number | null;
      };
    };

    const query = gql`
      mutation ($input: RadiatorInput) {
        updateRadiator(input: $input) {
          name
          valve
        }
      }
    `;

    const variables = {
      input: {
        name: this.name,
        valve: state,
      },
    };

    const gqlResponse: Data = await request(apiUrl, query, variables);

    return gqlResponse.response;
  };

  setFanState = async (state: boolean) => {
    type Data = {
      response: {
        name: string;
        valve: boolean;
        fan: boolean | null;
        temperature: number | null;
      };
    };

    const query = gql`
      mutation ($input: RadiatorInput) {
        updateRadiator(input: $input) {
          name
          fan
        }
      }
    `;

    const variables = {
      input: {
        name: this.name,
        fan: state,
      },
    };

    const gqlResponse: Data = await request(apiUrl, query, variables);

    return gqlResponse.response;
  };
}
