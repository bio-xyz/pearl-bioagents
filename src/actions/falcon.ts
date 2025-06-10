import type {
  Action,
  Memory,
  IAgentRuntime,
  State,
  HandlerCallback,
  Content,
} from "@elizaos/core";
import { logger } from "@elizaos/core";
import { FutureHouseClient } from "../futurehouse";

export const falcon: Action = {
  name: "FALCON",
  similes: ["FALCON_AGENT", "FALCON_AGENT_ACTION"],
  description:
    "Triggers the FutureHouse Falcon Agent to perform AI-powered research queries and retrieve scientific insights from external knowledge bases.",
  validate: async (
    runtime: IAgentRuntime,
    message: Memory,
    state: State
  ): Promise<boolean> => {
    logger.info("Validate FALCON start");
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
    logger.info("Validate FALCON end");
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
      logger.info("Executing FALCON");
      const client = new FutureHouseClient(
        runtime.getSetting("FUTUREHOUSE_API_KEY")
      );

      const response = await client.falcon(message.content.text);

      if (!response) {
        const responseContent: Content = {
          text: "Looks like there was an error executing FALCON agent action, please check logs",
          actions: ["FALCON"],
          source: "FutureHouse API Platform",
        };

        await callback(responseContent);

        return responseContent;
      }
      const responseJson = await response.json();
      const responseContent: Content = {
        text: JSON.stringify(responseJson),
        actions: ["FALCON"],
        source: "FutureHouse API Platform",
      };

      await callback(responseContent);

      return responseContent;
    } catch (err) {
      logger.error("Some error occurred in FALCON action: ", err);
    }
  },
  examples: [
    [
      {
        name: "{{name1}}",
        content: {
          text: "Use the falcon agent to conduct the research on this topic: 'What are the latest developments in mRNA vaccine technology?'",
        },
      },
      {
        name: "{{name2}}",
        content: {
          text: "Right On! Let me the start a research on the developments in mRNA vaccine technology utilizing the Falcon Agent",
          actions: ["FALCON"],
        },
      },
    ],
  ],
};
