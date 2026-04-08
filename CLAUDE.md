# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Agent-007 is an agentic fullstack scaffolding system powered by Claude Code. It orchestrates three specialized agents (backend, frontend, QA) to generate complete fullstack applications from natural language prompts. No API keys are needed — it runs on your Claude Code Max subscription.

## Commands

```bash
npm start -- "your goal here"       # Run the orchestrator with a prompt
node index.js "your goal here"      # Same as above
```

No build step, no test runner configured yet. Dependencies: `npm install`.

## Architecture

**Orchestration pipeline** (`orchestrator/`):
- `planner.js` — Parses the user's prompt via keyword matching (auth, crud, ecommerce, blog) and creates a 3-task plan: backend → frontend → QA (sequential, with dependency chain)
- `delegator.js` — Routes each task to the correct agent via dynamic `import()`
- `supervisor.js` — Wraps agent execution with retry logic (3 attempts, exponential backoff) and loop detection (flags repeated identical tool calls)
- `index.js` — Ties it together: plan → delegate → supervise, skipping tasks with unmet dependencies

**Agents** (`agents/`):
- Each agent (backend, frontend, qa) has `index.js`, `tools.js`, and a `prompt.js` for its system prompt
- Agents map tool names (e.g. `read_file`, `write_file`, `run_command`) to implementations in `tools/`
- `parseTaskToToolCalls()` in each agent converts task descriptions to concrete tool calls via keyword matching
- Backend agent uses NestJS scaffolding; QA agent uses Playwright and Jest

**Tools** (`tools/`): Shared tool implementations — file I/O, shell commands, HTTP client, Playwright browser automation, MongoDB via Mongoose.

**Memory** (`memory/`):
- `task-state.js` — Persists task status to `.agent-tasks.json` on disk
- `short-term.js` — In-memory key-value store (ephemeral, lost on restart)
- `long-term.js` — Persists to `.agent-memory.json` with keyword-based search

**Observability** (`observability/`): Structured JSON logs to `logs/agent-run.log`, trace spans, and webhook-based alerts.

**Skills** (`skills/`): Markdown files containing coding conventions and patterns. These are injected into agent system prompts to control code generation style (REST API design, auth patterns, testing, React components, etc.).

**Workflows** (`workflows/`): Multi-step pipelines like `add-feature.js` that compose agents in sequence.

## Key Patterns

- All modules use ES modules (`"type": "module"` in package.json)
- Task dependencies are enforced sequentially — backend runs first, then frontend, then QA
- The supervisor's loop detector throws if any tool is called 3+ times with identical arguments
- Config in `agent-config.json` defines which tools each agent is allowed to use
- Environment variables are loaded via `dotenv` from `.env` (see `.env.example`)
