import { logger } from "@elizaos/core";
import { JobDefinitions, JobRequest } from "./types";

export class FutureHouseClient {
  private BASE_URL: string = "https://api.platform.futurehouse.org";
  private API_KEY: string;
  private accessToken: string | undefined;
  private authPromise: Promise<string>;

  constructor(apiKey: string) {
    this.API_KEY = apiKey;
    console.log(`FutureHouse API Key: ${this.API_KEY}`);
    this.authPromise = this._getAuthToken();
    this.authPromise.then((token) => {
      this.accessToken = token;
      console.log(`Access Token: ${this.accessToken}`);
    });
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
      if (!this.accessToken) {
        this.accessToken = await this.authPromise;
      }

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
      const authResponseObject = await fetch(`${this.BASE_URL}/auth/login`, {
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ api_key: this.API_KEY }),
        method: "POST",
      });
      const authResponseJson = await authResponseObject.json();
      return authResponseJson["access_token"];
    } catch (err) {
      logger.error("Error in FutureHouse API Auth", err);
      throw err;
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
