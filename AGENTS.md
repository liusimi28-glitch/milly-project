# CLAUDE.md

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.

## 5. Workspace Term Mapping

In this workspace, interpret these terms as fixed paths:
- "后端" means `/home/ubuntu/workshop/sitea/mall-back`.
- "dash" means `/home/ubuntu/workshop/sitea/mall-dashboard`.
- "客户端" means `/home/ubuntu/workshop/sitea/mall`.

## Stack
- Framework: Vue 3 + Vite
- UI Library: Vuetify0
- Enabled Features: ESLint, Vue Router, UnoCSS

## Branch
- Active development branch: `develop`
- Production branch: `master`

## Design System (must follow for all new pages)

Reference implementation: `src/components/HelloWorld.vue`, `src/App.vue`, theme in `src/plugins/vuetify.ts`.

### Colors (dark theme default)
- Primary: `#c4b5fd` — use `text-primary` / `bg-primary`
- Secondary: `#94a3b8`
- Background: `#121212` with `text-on-background` (`#e0e0e0`)
- Surface (cards): `#1a1a1a` — `bg-surface`, `text-on-surface`
- Borders: `border-subtle` (never invent new border colors)
- Do not introduce new primary colors; use theme tokens only

### Typography
- Font: Roboto
- Hero: `text-4xl font-bold text-on-background`
- Section title: `text-2xl font-bold text-on-surface`
- Body: `text-sm` + `opacity-60`
- Labels: `text-xs font-medium uppercase tracking-wide opacity-50`

### Components
- Card: `rounded-xl border border-subtle bg-surface p-6`
- Button: `rounded-lg px-4 py-3 font-medium transition-colors`
- Links: `text-sm text-primary hover:underline`
- No heavy box-shadow; use border + surface layering

### Layout
- Max width: `max-w-2xl` (default), `max-w-md` (forms), `max-w-lg` (panels)
- Spacing: `mb-8`/`mb-12` between sections, `gap-3` in button groups
- Page shell padding comes from `App.vue` (`p-4`)

### Mock data
- Use mock data with proper TypeScript interfaces until real APIs are wired
- Keep mock data structured for easy API replacement

Full rules: `.cursor/rules/design-system.mdc`
