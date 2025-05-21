import type {
  Action,
  Memory,
  IAgentRuntime,
  State,
  HandlerCallback,
  Content,
} from "@elizaos/core";
import { logger } from "@elizaos/core";
import { FutureHouseClient } from "./futurehouse";

export const crow: Action = {
  name: "CROW",
  similes: ["CROW_AGENT", "CROW_AGENT_ACTION"],
  description:
    "Triggers the FutureHouse Crow Agent to perform AI-powered research queries and retrieve scientific insights from external knowledge bases.",
  validate: async (
    runtime: IAgentRuntime,
    message: Memory,
    state: State
  ): Promise<boolean> => {
    logger.info("Validate CROW start");
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
    logger.info("Validate CROW end");
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

      const client = new FutureHouseClient(
        runtime.getSetting("FUTUREHOUSE_API_KEY")
      );

      const response = await client.crow(message.content.text);

      if (!response) {
        const responseContent: Content = {
          text: "Looks like there was an error executing the CROW agent action, please check logs",
          actions: ["CROW"],
          source: "FutureHouse API Platform",
        };

        await callback(responseContent);

        return responseContent;
      }

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
          text: "Use the crow agent to conduct the research on this topic: 'What are the latest developments in mRNA vaccine technology?'",
        },
      },
      {
        name: "{{name2}}",
        content: {
          text: "Right On! Let me the start a research on the developments in mRNA vaccine technology utilizing the Crow Agent",
          actions: ["CROW"],
        },
      },
    ],
  ],
};
