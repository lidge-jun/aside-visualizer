# Visualization contract: delegation, not a frozen copy

The host-provided `visualize` skill is the source of truth when available.
Read its full current SKILL.md before creating or changing an inline visualization.
Resolve the path from the task's skill catalog; do not hardcode a home directory,
cache version, directive spelling, size limit, or writable-root assumption.

Check these live requirements:
- fence or content-reference form (Aside: a `visual` code block in the reply);
- HTML fragment versus standalone document (Aside: one complete document);
- size and permitted resource/network rules;
- theme variables, frame width and height behaviour;
- accessibility and primary interaction verification.

## Aside (current)

Aside ships a built-in `visualize` skill as of 2026-10-07/08. The inspected hash,
size and observed contract points are in
[`upstream/aside-visualize-upstream.md`](../upstream/aside-visualize-upstream.md);
routing, composition and promotion rules are in
[Aside inline visuals](aside-inline-visual.md). The earlier statement in this file
that "Aside exposes no `visualize` skill" was true for the 2026-09-16 port and is
superseded.

## Codex host (history)

The 2026-09-05 codexclaw inspection observed the codex `visualize` 1.0.29, including
a 1 MB limit and an absolute-path content reference (upstream snapshot SHA-256
`be82c4e573ffe2fc0921a10f49eb690ce6f7c8a06acffb2789600be677720d05`). That is codex
provenance and does not describe Aside's renderer.

If no host visualize skill is exposed in the current task, use the standalone or
text/static route from `../SKILL.md`. Do not invent inline support or require the
user to install a particular optional plugin.
