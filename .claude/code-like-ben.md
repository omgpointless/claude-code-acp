# Ben Brandt's Coding Style Guide

Reference for contributing to claude-code-acp in a way that matches the maintainer's patterns.

## TypeScript Patterns

### Error Handling
```typescript
// Use unknown, not any
catch (error) {
  return {
    isError: true,
    content: [{
      type: "text",
      text: "Operation failed: " + formatErrorMessage(error),
    }],
  };
}

// Helper for safe error messages
function formatErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  try {
    return JSON.stringify(error);
  } catch {
    return String(error);
  }
}
```

### Guard Clauses (Early Returns)
```typescript
// Good - flat structure
const session = agent.sessions[sessionId];
if (!session) {
  return { content: [{ type: "text", text: "Session not found" }] };
}
// ... main logic continues at same indentation

// Avoid - deep nesting
if (session) {
  if (session.query) {
    // ... buried logic
  }
}
```

### Exhaustive Switch Statements
```typescript
switch (status) {
  case "started":
  case "exited":
    // handle
    break;
  case "killed":
    // handle
    break;
  default:
    unreachable(status, logger);
    break;
}
```

### Null Safety
```typescript
// Use optional chaining and nullish coalescing
const toolCallId = extra._meta?.["claudecode/toolUseId"];
const offset = input.offset ?? 0;
const content = response?.content ?? "";

// Check before using
if (typeof readResponse?.content !== "string") {
  throw new Error(`No file contents for ${input.file_path}.`);
}
```

## Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| Variables/Functions | camelCase | `toolUseCache`, `stripCommonPrefix` |
| Types/Interfaces | PascalCase | `ToolInfo`, `ExtractLinesResult` |
| Constants | SCREAMING_SNAKE | `SYSTEM_REMINDER`, `ACP_TOOL_NAME_PREFIX` |
| Private fields | No prefix | Just use TypeScript's `private` |

## Code Organization

1. **Imports**: External deps first, then relative
2. **Constants**: Near top, after imports
3. **Main exports**: Middle of file
4. **Helper functions**: Bottom or extract to utils.ts
5. **Types/Interfaces**: Co-locate with usage or in dedicated file

## Testing (Vitest)

```typescript
describe("feature name", () => {
  it("should handle specific case nicely", () => {
    const input = { /* realistic test data */ };
    const result = functionUnderTest(input);
    expect(result).toStrictEqual({ /* expected */ });
  });
});

// Skip expensive tests in CI
describe.skipIf(!process.env.RUN_INTEGRATION_TESTS)("integration", () => {
  // ...
});
```

## Commit Messages

```
Short action-oriented title (#PR)

Explains WHY this change was made, not just what changed.
References issues when applicable.

Closes #123
```

Examples:
- `Better error handling in custom MCP tools (#243)`
- `Allow agent to write plans and todos to its config directory (#200)`

## Anti-Patterns to Avoid

- `any` type (use `unknown` for caught errors)
- Deep nesting (use early returns)
- Unnecessary abstractions for one-off code
- Comments for self-explanatory code
- `// eslint-disable` without explanation
- Leaving TODO comments (fix it or don't)
- console.log debugging (use `logger.error`)

## PR Checklist

- [ ] Proper error handling with `isError: true`
- [ ] Type-safe (no `any`)
- [ ] Clean guards with early returns
- [ ] Exhaustive switches with `unreachable()` default
- [ ] Tests included with realistic data
- [ ] Focused scope (one concern per PR)
- [ ] Commit message explains the "why"
