import type {
  Action,
  Memory,
  IAgentRuntime,
  State,
  HandlerCallback,
} from "@elizaos/core";

const crow: Action = {
  name: "Crow",
  similes: ["CROW"],
  description: "Access the Crow Agent",
  validate: async (
    _runtime: IAgentRuntime,
    _message: Memory,
    _state: State
  ): Promise<boolean> => {
    // Always valid
    return true;
  },
  handler: async (
    _runtime: IAgentRuntime,
    message: Memory,
    _state: State,
    _options: any,
    callback: HandlerCallback,
    _responses: Memory[]
  ) => {},
};
