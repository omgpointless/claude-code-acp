---
allowed-tools: Bash(git add:*), Bash(git status:*), Bash(git commit:*), Bash(git diff:*), Bash(git log:*)
description: Create a git commit (Ben's style)
---

## Context

- Current git status: !`git status`
- Current git diff (staged and unstaged changes): !`git diff HEAD`
- Current branch: !`git branch --show-current`
- Recent commits: !`git log --oneline -10`

## Ben's Commit Style

```
Short action-oriented title

Explains WHY this change was made, not just what changed.
References issues when applicable.
```

Examples from this repo:
- `Better error handling in custom MCP tools (#243)`
- `Allow agent to write plans and todos to its config directory (#200)`

Key points:
- Action-oriented title (what the change DOES, not what you DID)
- Body explains the WHY, not just the WHAT
- No PR number for fork-only commits

## Your task

Based on the above changes, create a single git commit following Ben's style.

Stage and create the commit using a single message. Do not use any other tools or do anything else.

No Claude Code contributions in the commit message.
