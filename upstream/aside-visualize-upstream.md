# Aside visualize inspection provenance

This records the last inspection of Aside's built-in `visualize` skill, not an
embedded contract. The live host skill always owns inline `visual` delivery;
[`reference/aside-inline-visual.md`](../reference/aside-inline-visual.md) only
adds routing, composition and promotion rules on top of it.

- Current upstream path: `skills/builtin/visualize/SKILL.md` (under the Aside account directory, e.g. `~/.aside/u/<N>/`)
- Current SHA-256: `4cb87ed9f931b50006ec6d7bc56b1b15eb7f6470ca130f3c431d156ab8bab37b`
- Size: `9851` bytes
- Fence: `visual`
- Last inspected: `2026-10-08`
- Public launch: `https://x.com/AsideAI/status/2107833080774074556` (2026-10-07)

Contract points observed at this hash: one self-contained HTML page per block;
remote `https:` libraries load; `<title>` names the visual; about 100 KB budget;
no access to the session, cookies or Aside; transparent background; fluid width
about 320 to 760 px; container reflow rather than `@media`; theme injected as CSS
custom properties (`--foreground`, `--muted-foreground`, `--surface-primary`,
`--border`, `--chart-1`..`--chart-6`, `--radius`, `--font-sans`, ...); images by
absolute session path; block dropped in channel conversations; scratch-tab
preview at about 728 and 380 px with an error probe before replying for anything
beyond a simple table.

`node upstream/sync-check.mjs` hashes every installed copy it finds and compares
it with this record. A mismatch means: re-read the live skill, update the inline
reference where the contract changed, then update this record. Do not copy the
host skill into this repository. A missing install is an availability result,
not a failure of the user's environment.
