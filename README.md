# Agent-007 — Agentic Fullstack System

## Structure
- orchestrator/ → brain: plans, delegates, supervises
- agents/       → frontend-agent, backend-agent, qa-agent
- tools/        → file-system, run-command, http-client, browser, database
- skills/       → your coding conventions (markdown files agents read)
- workflows/    → multi-step pipelines
- memory/       → task state + context store
- observability/→ structured logs + traces + alerts

## No API key needed
This system is powered by Claude Code (your Max subscription).
Claude Code reads these files and executes the workflow directly.

## How to use
Open terminal in this folder and type: claude
Then paste your workflow prompt referencing these files.

## Skills
Edit the markdown files in skills/ to change how agents write code.
They are injected into every agent's system prompt automatically.