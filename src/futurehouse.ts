import { logger } from "@elizaos/core";
import { JobDefinitions, JobRequest } from "./types";

export class FutureHouseClient {
  private BASE_URL: string = "https://api.platform.futurehouse.org";
  private API_KEY: string;
  private accessToken: string;

  constructor(apiKey: string) {
    this.API_KEY = apiKey;
    this._getAuthToken().then((v) => (this.accessToken = v));
  }

  private formRequestBody(jobType: JobDefinitions, query: string): string {
    const jobRequestObject: JobRequest = {
      name: jobType,
      query,
    };
    return JSON.stringify(jobRequestObject);
  }

  private async researchRequest(jobType: JobDefinitions, query: string) {
    try {
      logger.info("Making request to FutureHouse");
      return await fetch(`${this.BASE_URL}/v0.1/crows`, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "Content-Type": "application/json",
        },
        body: this.formRequestBody(jobType, query),
        method: "POST",
      });
    } catch (err) {
      logger.error("Error in making request to FutureHouse", err);
    }
  }

  private async _getAuthToken(): Promise<string> {
    try {
      logger.info("Getting authtoken from FutureHouse");
      const authResponse = await fetch(`${this.BASE_URL}/auth/login`, {
        headers: {
          Accept: "*/*",
        },
        body: JSON.stringify({ api_key: this.API_KEY }),
        method: "POST",
      });
      return authResponse["access_token"];
    } catch (err) {
      logger.error("Error in FutureHouse API Auth", err);
    }
  }

  async crow(query: string) {
    return await this.researchRequest(JobDefinitions.Crow, query);
  }
  async falcon(query: string) {
    return await this.researchRequest(JobDefinitions.Falcon, query);
  }
  async owl(query: string) {
    return await this.researchRequest(JobDefinitions.Owl, query);
  }
  async phoenix(query: string) {
    return await this.researchRequest(JobDefinitions.Phoenix, query);
  }
}
