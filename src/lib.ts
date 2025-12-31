// Export the main agent class and utilities for library usage
export {
  ClaudeAcpAgent,
  runAcp,
  toAcpNotifications,
  streamEventToAcpNotifications,
  type ToolUpdateMeta,
  type NewSessionMeta,
} from "./acp-agent.js";
export {
  loadManagedSettings,
  applyEnvironmentSettings,
  nodeToWebReadable,
  nodeToWebWritable,
  Pushable,
  unreachable,
} from "./utils.js";
export { createMcpServer } from "./mcp-server.js";
export {
  toolInfoFromToolUse,
  planEntries,
  toolUpdateFromToolResult,
  createPreToolUseHook,
  acpToolNames as toolNames,
} from "./tools.js";
export {
  SettingsManager,
  type ClaudeCodeSettings,
  type PermissionSettings,
  type PermissionDecision,
  type PermissionCheckResult,
  type SettingsManagerOptions,
} from "./settings.js";
export {
  CUSTOM_CAPABILITY_NAMESPACE,
  CUSTOM_METHOD_PREFIX,
  CUSTOM_CAPABILITY_REGISTRY,
  getCustomCapabilities,
  hasCustomCapability,
  getActiveCustomCapabilities,
  getCustomMethodName,
  preferAcpToolInstruction,
  type ClaudeAcpCustomCapabilities,
  type CustomCapabilityDefinition,
  type AskUserQuestionRequest,
  type AskUserQuestionResponse,
  type AskUserQuestionInput,
  type AskUserQuestionQuestion,
  type AskUserQuestionOption,
} from "./capabilities.js";

// Export types
export type { ClaudePlanEntry } from "./tools.js";
