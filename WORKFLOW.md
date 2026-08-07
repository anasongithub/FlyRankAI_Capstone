# WORKFLOW.md — Vague vs. Precise Prompting (FE-04)

## Feature
A settings form: name, email, notifications toggle, save button.

## Round 1 — vague prompt
Prompt: *"Build me a settings form for this app."* One sentence, no file
reference, no constraints, accepted as-is.

Output: 29 lines. `useState` per field, an inline `handleSubmit(e: any)`,
`console.log` instead of a real submit handler, and `placeholder` text
standing in for labels.

## Round 2 — precise prompt
Prompt specified the target file, the field list and validation rules,
success/error behavior, accessibility requirements, and a verification
step ("write it, then write tests, then run them"). Run in a fresh session
against the same starting point.

Output: 84 lines for the component, 42 for tests, plus a small
`settingsSchema.ts`. Uses `react-hook-form` + `zod`, per-field `<label
htmlFor>`, `aria-invalid`/`aria-describedby` wired to real error messages,
and a submit state machine (`idle` / `success` / `error`) instead of a
`console.log`.

## Correctness
Round 1 "works" in the sense that it renders and doesn't crash, but it
doesn't actually save anything — the submit handler just logs to the
console, and there's no email format check, so `"asdf"` is accepted as a
valid email. Round 2 validates both fields against a shared zod schema and
surfaces real error text per field.

## Accessibility
Round 1 relies entirely on `placeholder` for labeling — screen readers
don't announce placeholder text the same way as a real `<label>`, and it
disappears the moment the user types. Round 2 gives every input an
explicit `<label htmlFor>`, plus `aria-invalid` and `aria-describedby`
pointing at the actual error message.

## Edge cases
Round 1 handles none: empty name, malformed email, and double-submit are
all silently accepted. Round 2's tests specifically cover an invalid email
and an empty required field, and the submit button disables while
`isSubmitting` is true to prevent double-submits.

## Review effort
Round 1 took one sentence to prompt but needed everything fixed by hand
before it'd be mergeable — no validation, no labels, an `any`-typed event
handler that violates our own CLAUDE.md "no `any`" rule and wouldn't
compile cleanly under strict TypeScript. Round 2's prompt took longer to
write, but the output was close to merge-ready and self-verified — it came
with its own passing tests rather than needing them added after the fact.
Net time, round 2 was faster once review and fixup time is counted, even
though the initial prompting step felt slower.

## AI mistake caught
Round 1's `handleSubmit` typed its event parameter as `e: any`. Our
CLAUDE.md explicitly bans `any` — the model defaulted to it anyway when
given no constraints, and it would have been an easy miss in a quick
skim-and-accept review.
