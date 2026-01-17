# Code Like Ben Review

Review the current changes or specified file for adherence to Ben Brandt's coding style.

## Instructions

Review the code for the following patterns and flag any deviations:

### Must Check

1. **Error Handling**
   - Caught errors use `unknown` type, not `any`
   - Error responses include `isError: true`
   - Use helper function for formatting error messages
   - Human-readable error strings

2. **Code Structure**
   - Early returns for guard clauses (no deep nesting)
   - Switch statements have exhaustive cases with `unreachable()` default
   - Null safety with `?.` and `??`

3. **Type Safety**
   - No `any` types
   - Proper interfaces for complex return types
   - Type annotations where inference isn't obvious

4. **Naming**
   - camelCase for variables/functions
   - PascalCase for types/interfaces
   - SCREAMING_SNAKE for constants

5. **Testing** (if test files touched)
   - Uses Vitest patterns (`describe`, `it`, `expect`)
   - Test names are action statements ("should handle X nicely")
   - Realistic test data, not placeholders
   - `toStrictEqual` for deep equality checks

### Output Format

Provide feedback in this format:

```
## Code Like Ben Review

### Passes
- [x] Item that matches the style

### Needs Adjustment
- [ ] Issue description
  - Location: `file.ts:line`
  - Current: `what it is`
  - Suggested: `what it should be`

### Overall
Ready to submit / Needs minor fixes / Needs rework
```

## Usage

Run this on staged changes:
```
/code-like-ben
```

Or on specific files:
```
/code-like-ben src/my-new-file.ts
```

$ARGUMENTS
