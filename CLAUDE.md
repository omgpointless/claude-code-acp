# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an ACP (Agent Client Protocol) adapter for Claude Code. It implements an ACP agent using the official Claude Agent SDK, allowing Claude Code to be used from ACP-compatible clients like Zed, Emacs, Neovim plugins, and marimo notebooks.

## Commands

```bash
# Build (TypeScript compilation)
npm run build

# Check (lint + format check) - USE THIS INSTEAD OF BUILD FOR VALIDATION
npm run check

# Run tests
npm run test           # Watch mode
npm run test:run       # Single run
npm run test:coverage  # With coverage

# Development
npm run dev            # Build and start
npm run start          # Run compiled output

# Formatting/Linting
npm run lint           # ESLint
npm run lint:fix       # ESLint with auto-fix
npm run format         # Prettier write
npm run format:check   # Prettier check
```

## Architecture

### Core Flow

The adapter bridges ACP protocol messages to the Claude Agent SDK:

1. **Entry Point** (`src/index.ts`): CLI entry, redirects stdout to stderr (stdout is reserved for ACP protocol), loads managed settings, starts the ACP agent

2. **ACP Agent** (`src/acp-agent.ts`): Main `ClaudeAcpAgent` class implementing the ACP `Agent` interface
   - Handles session lifecycle (create, fork, resume)
   - Manages permission modes: `default`, `acceptEdits`, `plan`, `dontAsk`, `bypassPermissions`
   - Converts between ACP protocol messages and Claude SDK messages
   - `canUseTool()` implements permission flow with client-side approval UI

3. **MCP Server** (`src/mcp-server.ts`): Creates an internal MCP server exposing file/terminal tools to Claude
   - Provides Read, Write, Edit, Bash, BashOutput, KillShell tools
   - Tool names are prefixed with `mcp__acp__` (e.g., `mcp__acp__Read`)
   - Routes file operations through ACP client when client has fs capabilities
   - Manages background terminal processes

4. **Tools** (`src/tools.ts`): Tool metadata and result transformation
   - `toolInfoFromToolUse()`: Converts Claude tool calls to ACP-friendly display info
   - `toolUpdateFromToolResult()`: Transforms tool results for ACP protocol
   - Hook callbacks for pre/post tool use events

5. **Settings** (`src/settings.ts`): Multi-source settings management
   - Loads from: user (`~/.claude/settings.json`), project (`.claude/settings.json`), local (`.claude/settings.local.json`), enterprise
   - Permission rules: `allow`, `deny`, `ask` arrays with glob patterns
   - Watches files for changes and auto-reloads

### Key Patterns

- **ACP Tool Names**: Internal MCP tools are prefixed `mcp__acp__` to avoid conflicts
- **Permission Flow**: `createPreToolUseHook` checks settings before SDK's built-in rules
- **Streaming**: Uses `Pushable<T>` async iterable for bridging push/pull patterns
- **Session State**: Each session tracks query, input stream, permission mode, settings manager

## Library Exports

The package exports its internals via `src/lib.ts` for use as a library (not just CLI):

- `ClaudeAcpAgent`, `runAcp`, `toAcpNotifications`, `streamEventToAcpNotifications`
- `SettingsManager` and permission types
- Tool utilities: `toolInfoFromToolUse`, `toolUpdateFromToolResult`, `createPreToolUseHook`
- Stream utilities: `nodeToWebReadable`, `nodeToWebWritable`, `Pushable`
