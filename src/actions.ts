import type {
  Action,
  Memory,
  IAgentRuntime,
  State,
  HandlerCallback,
  Content,
} from "@elizaos/core";
import { logger } from "@elizaos/core";

export const crow: Action = {
  name: "Crow",
  similes: ["CROW", "CROW_AGENT", "CROW_AGENT_ACTION"],
  description: "Access the Crow Agent",
  validate: async (
    runtime: IAgentRuntime,
    message: Memory,
    state: State
  ): Promise<boolean> => {
    const FUTUREHOUSE_API_KEY = runtime.getSetting("FUTUREHOUSE_API_KEY");
    if (!FUTUREHOUSE_API_KEY) {
      throw new Error("FUTUREHOUSE_API_KEY must be given");
    }
    const OPENAI_API_KEY = runtime.getSetting("OPENAI_API_KEY");
    if (!OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY must be given");
    }
    const ANTHROPIC_API_KEY = runtime.getSetting("ANTHROPIC_API_KEY");
    if (!ANTHROPIC_API_KEY) {
      throw new Error("ANTHROPIC_API_KEY must be given");
    }
    return true;
  },
  handler: async (
    runtime: IAgentRuntime,
    message: Memory,
    state: State,
    options: any,
    callback: HandlerCallback,
    responses: Memory[]
  ) => {
    try {
      logger.info("Executing CROW");

      // Hit https://api.platform.futurehouse.org/v0.1/crows

      const responseContent: Content = {
        text: "<Crow Agent API Response>",
        actions: ["CROW"],
        source: "FutureHouse API Platform",
      };

      await callback(responseContent);

      return responseContent;
    } catch (error) {
      logger.error("Some error occured in CROW action:", error);
    }
  },
  examples: [
    [
      {
        name: "{{name1}}",
        content: {
          text: "",
        },
      },
      {
        name: "{{name2}}",
        content: {
          text: "hello world!",
          actions: ["HELLO_WORLD"],
        },
      },
    ],
  ],
};
