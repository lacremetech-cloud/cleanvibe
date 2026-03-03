# CLAUDE.md — AI Assistant Guide for CleanVibe

This file provides essential context for AI coding assistants (Claude Code and others) working in this repository. Keep it updated as the project evolves.

---

## Repository Overview

- **Project:** CleanVibe
- **Repository:** `lacremetech-cloud/cleanvibe`
- **Status:** Initial setup — no source code committed yet.

> Update this section once the tech stack and purpose are established.

---

## Development Branch Convention

All Claude-initiated work must happen on branches following this pattern:

```
claude/<session-id>
```

- Never push directly to `main` or `master`.
- Always use `git push -u origin <branch-name>`.
- Open a pull request for review before merging.

---

## Project Structure

> To be filled in once the project scaffolding is committed. Common layout to target:

```
cleanvibe/
├── CLAUDE.md              # This file — AI assistant guide
├── README.md              # Human-facing project documentation
├── package.json           # Dependencies and scripts (if Node-based)
├── src/
│   ├── components/        # Reusable UI components
│   ├── pages/             # Route-level views / pages
│   ├── lib/               # Shared utilities and helpers
│   ├── hooks/             # Custom React hooks (if applicable)
│   ├── styles/            # Global styles / theme tokens
│   └── types/             # TypeScript type definitions
├── public/                # Static assets
├── tests/                 # Test files (unit, integration, e2e)
└── .github/               # CI/CD workflows
```

Update this section to reflect the actual structure once code is added.

---

## Tech Stack

> To be determined. Document choices here once made:

| Layer        | Choice | Notes |
|--------------|--------|-------|
| Language     | —      | e.g. TypeScript |
| Framework    | —      | e.g. Next.js, Vite + React |
| Styling      | —      | e.g. Tailwind CSS |
| State mgmt   | —      | e.g. Zustand, Redux, Context |
| Backend/API  | —      | e.g. Supabase, tRPC, REST |
| Database     | —      | e.g. PostgreSQL, SQLite |
| Auth         | —      | e.g. NextAuth, Clerk |
| Testing      | —      | e.g. Vitest, Jest, Playwright |
| CI/CD        | —      | e.g. GitHub Actions |

---

## Common Commands

> Populate once `package.json` scripts are defined. Typical conventions:

```bash
# Install dependencies
npm install          # or pnpm install / yarn

# Development server
npm run dev

# Build for production
npm run build

# Run tests
npm test             # unit tests
npm run test:e2e     # end-to-end tests (if applicable)

# Lint & format
npm run lint
npm run format

# Type check
npm run typecheck    # or tsc --noEmit
```

---

## Code Conventions

### General
- Prefer small, focused functions with a single responsibility.
- Avoid premature abstraction — duplicate a little before abstracting.
- Do not add comments that merely restate what the code does; comment the *why*.
- Remove dead code rather than commenting it out.

### Naming
- **Files/folders:** kebab-case (`user-profile.tsx`, `auth-utils.ts`)
- **Components:** PascalCase (`UserProfile`, `AuthButton`)
- **Variables/functions:** camelCase (`getUserData`, `isLoading`)
- **Constants:** SCREAMING_SNAKE_CASE (`MAX_RETRY_COUNT`)
- **Types/Interfaces:** PascalCase, no `I` prefix (`UserProfile`, not `IUserProfile`)

### TypeScript (when applicable)
- Prefer `interface` for object shapes; use `type` for unions/intersections.
- Avoid `any` — use `unknown` and narrow the type.
- Enable strict mode in `tsconfig.json`.
- Export types alongside their implementations when they're part of a public API.

### Imports
- Use absolute imports over deep relative paths (`@/components/...` vs `../../components/...`).
- Group imports: external libraries → internal modules → types.
- No unused imports — the linter should catch these.

### Components (if React-based)
- One component per file.
- Co-locate component tests and styles with the component.
- Prefer composition over inheritance.
- Avoid prop drilling beyond 2 levels — use context or state management.

---

## Testing Guidelines

- Write tests for business logic and user-facing behavior, not implementation details.
- Follow Arrange → Act → Assert (AAA) structure.
- Test file naming: `<module>.test.ts` or `<component>.test.tsx`.
- Aim for high coverage on `src/lib/` utilities; component tests should cover key interactions.
- Do not mock what you don't own — prefer testing through real (or in-memory) implementations.

---

## Git Workflow

1. Create a feature branch from `main`: `git checkout -b feat/short-description`
2. Make atomic commits with clear messages (see below).
3. Keep PRs small and focused.
4. Squash-merge into `main` after approval.

### Commit Message Format

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <short summary>

[optional body — explain WHY, not WHAT]
```

**Types:** `feat`, `fix`, `refactor`, `docs`, `test`, `chore`, `style`, `perf`

**Examples:**
```
feat(auth): add email/password login flow
fix(cart): prevent duplicate items on rapid clicks
docs: update CLAUDE.md with project structure
```

---

## Environment Variables

- Never commit `.env` files or secrets to the repository.
- Provide a `.env.example` with placeholder values for all required variables.
- Document required environment variables below once defined:

| Variable | Required | Description |
|----------|----------|-------------|
| —        | —        | — |

---

## AI Assistant Instructions

When working in this repository:

1. **Read before editing.** Always read a file before modifying it.
2. **Stay on scope.** Only change what was asked. Do not refactor unrelated code.
3. **No speculative additions.** Don't add error handling, logging, or features that weren't requested.
4. **Branch correctly.** All work goes on `claude/<session-id>` branches.
5. **Commit atomically.** One logical change per commit.
6. **Update CLAUDE.md** when you add new patterns, scripts, or architectural decisions.
7. **Security.** Never introduce SQL injection, XSS, command injection, or other OWASP Top 10 vulnerabilities. If you detect one, fix it immediately.
8. **No dummy data in production paths.** Seed files and fixtures belong in `tests/` or `scripts/`.

---

## Updating This File

This file should be kept current. When significant changes occur, update the relevant section:

- New dependency or tool added → update Tech Stack table
- New npm script added → update Common Commands
- New folder or architectural pattern → update Project Structure
- New environment variable → update the env table
- New team convention established → update Code Conventions

Last updated: 2026-03-03 (initial creation, empty repository)
