import type { Plugin } from "@elizaos/core";
import {
  type Action,
  type Content,
  type GenerateTextParams,
  type HandlerCallback,
  type IAgentRuntime,
  type Memory,
  ModelType,
  type Provider,
  type ProviderResult,
  Service,
  type State,
  logger,
} from "@elizaos/core";
import { z } from "zod";
import starterTestSuite from "./tests";
import { crow } from "./actions";

/**
 * Define the configuration schema for the plugin with the following properties:
 *
 * @param {string} EXAMPLE_PLUGIN_VARIABLE - The name of the plugin (min length of 1, optional)
 * @returns {object} - The configured schema object
 */
const configSchema = z.object({
  OPENAI_API_KEY: z.string(),
  ANTHROPIC_API_KEY: z.string(),
  FUTUREHOUSE_API_KEY: z.string(),
});

/**
 * Example Hello World Provider
 * This demonstrates the simplest possible provider implementation
 */
const helloWorldProvider: Provider = {
  name: "HELLO_WORLD_PROVIDER",
  description: "A simple example provider",

  get: async (
    _runtime: IAgentRuntime,
    _message: Memory,
    _state: State
  ): Promise<ProviderResult> => {
    return {
      text: "I am a provider",
      values: {},
      data: {},
    };
  },
};

export class StarterService extends Service {
  static serviceType = "starter";
  capabilityDescription =
    "This is a starter service which is attached to the agent through the starter plugin.";
  constructor(protected runtime: IAgentRuntime) {
    super(runtime);
  }

  static async start(runtime: IAgentRuntime) {
    logger.info("*** Starting starter service ***");
    const service = new StarterService(runtime);
    return service;
  }

  static async stop(runtime: IAgentRuntime) {
    logger.info("*** Stopping starter service ***");
    // get the service from the runtime
    const service = runtime.getService(StarterService.serviceType);
    if (!service) {
      throw new Error("Starter service not found");
    }
    service.stop();
  }

  async stop() {
    logger.info("*** Stopping starter service instance ***");
  }
}

const plugin: Plugin = {
  name: "futurehouse-api",
  description:
    "A plugin that allows you to access the FutureHouse API from your agent",
  config: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
    FUTUREHOUSE_API_KEY: process.env.FUTUREHOUSE_API_KEY,
  },
  async init(config: Record<string, string>) {
    logger.info("*** Initializing starter plugin ***");
    try {
      const validatedConfig = await configSchema.parseAsync(config);

      // Set all environment variables at once
      for (const [key, value] of Object.entries(validatedConfig)) {
        if (value) process.env[key] = value;
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(
          `Invalid plugin configuration: ${error.errors.map((e) => e.message).join(", ")}`
        );
      }
      throw error;
    }
  },
  tests: [starterTestSuite],
  events: {
    MESSAGE_RECEIVED: [
      async (params) => {
        logger.info("MESSAGE_RECEIVED event received");
        // print the keys
        logger.info(Object.keys(params));
      },
    ],
    VOICE_MESSAGE_RECEIVED: [
      async (params) => {
        logger.info("VOICE_MESSAGE_RECEIVED event received");
        // print the keys
        logger.info(Object.keys(params));
      },
    ],
    WORLD_CONNECTED: [
      async (params) => {
        logger.info("WORLD_CONNECTED event received");
        // print the keys
        logger.info(Object.keys(params));
      },
    ],
    WORLD_JOINED: [
      async (params) => {
        logger.info("WORLD_JOINED event received");
        // print the keys
        logger.info(Object.keys(params));
      },
    ],
  },
  services: [StarterService],
  actions: [crow],
  providers: [],
};

export default plugin;
