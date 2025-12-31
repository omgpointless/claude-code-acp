/**
 * Custom Capability Registry for Claude Code ACP
 *
 * This module defines custom capabilities that extend the ACP spec
 * for Claude Code-specific features. Custom capabilities:
 *
 * 1. Are advertised in clientCapabilities._meta["claude-acp"]
 * 2. Use custom ACP methods prefixed with "_claude-acp/"
 * 3. Register MCP tools that override Claude's built-in tools
 *
 * This follows the ACP extensibility spec:
 * https://agentclientprotocol.com/protocol/extensibility
 */

import { ClientCapabilities } from "@agentclientprotocol/sdk";
import { z } from "zod";

// ============================================================================
// Custom Capability Namespace
// ============================================================================

/**
 * Namespace for custom Claude ACP capabilities.
 * Clients advertise these in clientCapabilities._meta["claude-acp"]
 */
export const CUSTOM_CAPABILITY_NAMESPACE = "claude-acp";

/**
 * Prefix for custom ACP methods (per spec: must start with "_")
 */
export const CUSTOM_METHOD_PREFIX = "_claude-acp";

// ============================================================================
// AskUserQuestion Types
// ============================================================================

export const AskUserQuestionOptionSchema = z.object({
  label: z.string().describe("Display text for this option (1-5 words)"),
  description: z.string().describe("Explanation of what this option means"),
});

export const AskUserQuestionQuestionSchema = z.object({
  question: z.string().describe("The complete question to ask the user"),
  header: z.string().max(12).describe("Short label displayed as chip/tag (max 12 chars)"),
  options: z
    .array(AskUserQuestionOptionSchema)
    .min(2)
    .max(4)
    .describe("Available choices (2-4 options)"),
  multiSelect: z.boolean().describe("Allow multiple selections"),
});

export const AskUserQuestionInputSchema = z.object({
  questions: z
    .array(AskUserQuestionQuestionSchema)
    .min(1)
    .max(4)
    .describe("Questions to ask the user (1-4 questions)"),
});

export type AskUserQuestionOption = z.infer<typeof AskUserQuestionOptionSchema>;
export type AskUserQuestionQuestion = z.infer<typeof AskUserQuestionQuestionSchema>;
export type AskUserQuestionInput = z.infer<typeof AskUserQuestionInputSchema>;

/**
 * Request to ask the user a question via the client UI
 */
export interface AskUserQuestionRequest {
  sessionId: string;
  questions: AskUserQuestionQuestion[];
}

/**
 * Response from the client with user's answers
 */
export interface AskUserQuestionResponse {
  /** Map of question header to selected answer(s) */
  answers: Record<string, string | string[]>;
  /** True if user cancelled/dismissed the question */
  cancelled?: boolean;
}

// ============================================================================
// Custom Capability Definitions
// ============================================================================

/**
 * Structure of custom capabilities advertised in _meta["claude-acp"]
 */
export interface ClaudeAcpCustomCapabilities {
  /** UI interaction capabilities */
  ui?: {
    /** Client can handle AskUserQuestion tool */
    askUserQuestion?: boolean;
    // Future: selectOption, showProgress, etc.
  };
  // Future: binary file handling, compression, etc.
}

/**
 * Definition of a custom capability
 */
export interface CustomCapabilityDefinition {
  /** Path within _meta["claude-acp"], e.g., "ui.askUserQuestion" */
  path: string;

  /** MCP tool name (unqualified - will become mcp__acp__X) */
  tool: string;

  /** Built-in tools to disable when this capability is active */
  disableBuiltIn: string[];

  /** Custom ACP method name (without prefix) */
  method: string;
}

/**
 * Registry of custom capabilities
 */
export const CUSTOM_CAPABILITY_REGISTRY: CustomCapabilityDefinition[] = [
  {
    path: "ui.askUserQuestion",
    tool: "AskUserQuestion",
    disableBuiltIn: ["AskUserQuestion"],
    method: "askUserQuestion",
  },
  // Future capabilities:
  // {
  //   path: "ui.todoWrite",
  //   tool: "TodoWrite",
  //   disableBuiltIn: ["TodoWrite"],
  //   method: "todoWrite",
  // },
];

// ============================================================================
// Capability Helpers
// ============================================================================

/**
 * Get custom capabilities from clientCapabilities._meta
 */
export function getCustomCapabilities(
  clientCapabilities: ClientCapabilities | undefined,
): ClaudeAcpCustomCapabilities | undefined {
  const meta = clientCapabilities?._meta as Record<string, unknown> | undefined;
  return meta?.[CUSTOM_CAPABILITY_NAMESPACE] as ClaudeAcpCustomCapabilities | undefined;
}

/**
 * Check if a specific custom capability is enabled
 * @param clientCapabilities - Client capabilities from initialize
 * @param path - Dot-notation path, e.g., "ui.askUserQuestion"
 */
export function hasCustomCapability(
  clientCapabilities: ClientCapabilities | undefined,
  path: string,
): boolean {
  const customCaps = getCustomCapabilities(clientCapabilities);
  if (!customCaps) return false;

  const parts = path.split(".");
  let current: unknown = customCaps;

  for (const part of parts) {
    if (current === null || typeof current !== "object") return false;
    current = (current as Record<string, unknown>)[part];
  }

  return current === true;
}

/**
 * Get the full custom method name for a capability
 * @param method - Method name without prefix, e.g., "askUserQuestion"
 * @returns Full method name, e.g., "_claude-acp/askUserQuestion"
 */
export function getCustomMethodName(method: string): string {
  return `${CUSTOM_METHOD_PREFIX}/${method}`;
}

/**
 * Get active custom capabilities and their tool configurations
 */
export function getActiveCustomCapabilities(clientCapabilities: ClientCapabilities | undefined): {
  /** Tools to add to allowedTools */
  allowedTools: string[];
  /** Tools to add to disallowedTools */
  disallowedTools: string[];
  /** Active capability definitions */
  active: CustomCapabilityDefinition[];
} {
  const allowedTools: string[] = [];
  const disallowedTools: string[] = [];
  const active: CustomCapabilityDefinition[] = [];

  for (const cap of CUSTOM_CAPABILITY_REGISTRY) {
    if (hasCustomCapability(clientCapabilities, cap.path)) {
      allowedTools.push(`mcp__acp__${cap.tool}`);
      disallowedTools.push(...cap.disableBuiltIn);
      active.push(cap);
    }
  }

  return { allowedTools, disallowedTools, active };
}

/**
 * Generate tool description instruction for preferring ACP tool
 */
export function preferAcpToolInstruction(toolName: string): string {
  return `In sessions with mcp__acp__${toolName} always use it instead of ${toolName} as it routes through the client UI.`;
}
