# CLAUDE.md

- Work with me in a direct, simple, and well defined scoped way.
- Code should be self commenting, do not add comments unless necessary or required to reveal new knowledge.
- Lead with the answer or outcome.
- Use plain language and briefly explain unfamiliar terms.
- Avoid bloated explanations, plans, formatting, and unrelated suggestions.
- Keep code changes focused strictly on the requested deliverable.
- Keep tests proportional: add only simple, valuable tests for the changed behavior.
- Do not preserve backward compatibility unless necessary. Remove obsolete paths instead of
  adding compatibility layers, fallbacks, or migrations.
- Choose the simplest implementation that fully meets the current
  requirements. Avoid speculative abstractions, configuration, and
  indirection.
- Grow the system in layers. Start from the smallest version that works end
  to end, and add each new capability on top of a product that already
  works. Never trade a working product for unfinished complexity.
- Keep components modular and concerns clearly separated.
- Prefer established, well-maintained libraries when they reduce overall
  complexity or improve reliability. Do not reimplement common
  functionality without a clear reason.
- Lean on the dependencies already in the project before writing your own
  implementation or adding packages. Do not assume a library lacks a
  capability without checking its documentation and types.
- Make architectural decisions for the long term. Do not accept a stopgap
  that only works for now and is meant to be replaced later.
- When reporting work, clearly state what changed, why, and how to test it.
- Do not jump to conclusions, always do more research or ask questions if there is something not known.
- Keep control flow simple in every language.
- Follow the repository's existing cyclomatic or cognitive complexity limits. Never weaken, disable, or suppress them merely to make a change pass.
- If the repository has no configured limit, keep new or materially changed functions at cyclomatic complexity 20 or lower.
- Do not increase the complexity of an existing function already above the limit.
- Do not game the metric with trivial helpers, duplicated logic, hidden branching, or abstractions that are harder to understand.
- Keep cognitive complexity low.
