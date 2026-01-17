# Lumina Fork Changelog

Changes specific to the Lumina fork of `claude-code-acp`.

This file tracks fork-specific modifications. For upstream changes, see the main repo.

---

## Unreleased

### Added
- **Compaction status notifications**: Forward SDK `status` and `compact_boundary` messages to ACP hosts via `agent_message_chunk` with `_meta.claudeCode` metadata. Hosts can show "Compacting conversation..." feedback instead of appearing unresponsive. (`StatusUpdateMeta` type exported from lib)
- **`task_notification` handling**: Handle new SDK message type (no-op, prevents `unreachable()` errors)

### Changed
- None

### Fixed
- None

---

## Fork Base

Based on `claude-code-acp` v0.13.1

### Existing Fork Changes (pre-changelog)
- `ClaudeCodeMetaCapabilities` interface for extended client capabilities
- `allowBuiltInBash` meta capability for skills compatibility
- AskUserQuestion tool support (disabled upstream, enabled here)
