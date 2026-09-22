# aside-visualizer

Aside account-skill port of [codexclaw](https://github.com/lidge-jun/codexclaw)'s
`dev-visualizer` skill: well-composed visual documents, SVG diagrams, HTML
explainers and paged PDF reports. Simple static HTML/SVG ships after source review;
computed and exported outputs receive proportionate, explicitly recorded checks.

The Aside browser is a Chromium fork, so the headline difference from the
codexclaw original: **PDF export works with no system Chrome at all**.

## Install

```bash
mkdir -p ~/.aside/u/0/skills/user/dev-visualizer
cp -R SKILL.md assets reference scripts ~/.aside/u/0/skills/user/dev-visualizer/
```

The skill loads from the next Aside session. Triggers include: visualize,
시각화, 그려줘, 문서 만들어줘, 보고서, PDF 생성.

## What this port changes vs upstream

- `reference/reader-documents.md` bundled locally (the original upstream snapshot
  used a sibling-skill path that blocked standalone installs; codexclaw#183 is
  now fixed upstream too).
- Routing and `reference/environment-detection.md` rewritten for Aside's
  delivery contract: no inline fragment renderer, deliverables are artifact
  files verified in the Aside browser.
- `reference/no-chrome-pdf-export.md` added: a validated two-pass PDF export
  through Aside's own Chromium (REPL `page.pdf()` + bundled poppler for TOC
  mapping and QA), plus a codemode batch-capture route
  (`scripts/capture-pdf.codemode.js`).
- codex-only machinery dropped (`upstream/sync-check.sh`); the historical
  `visualize-contract.md` kept as provenance only.

## Export paths, measured 2026-09-16 on the bundled template

| Path | Needs | Result |
|---|---|---|
| `scripts/export-paged-report.mjs` | node + local Chrome | 7 pages A4, TOC auto-filled, QA pass/fail findings |
| REPL two-pass (`reference/no-chrome-pdf-export.md`) | Aside only | 7 pages A4, identical layout, TOC 3/4/5/6/6/7 verified in print |
| codemode `browse.captureMany` | Aside only | A4 pageBox verified per page; pagination may differ (engine-default margins, no `preferCSSPageSize` passthrough yet, see aside-codemode#25) |

## Provenance

- Ported 2026-09-16 from `lidge-jun/codexclaw`
  `plugins/codexclaw/skills/dev-visualizer` (plugin snapshot
  `0.2.28+codex.20260914090142`); divergence tracked in upstream issues
  codexclaw#181-183.
- Upstream is MIT; this port keeps the same license. Source patterns and
  license notes also in `reference/source-patterns.md`.

## Upstream-first maintenance

Shared behavior is fixed and verified in codexclaw's `dev-visualizer` first.
This repository then ports the selected changes, preserving its Aside adapters,
bundled references, source-only authoring and no-system-Chrome PDF route.
Do not create a second research-contract or quality-gate engine here.

For each issue, record the upstream fix commit/PR, downstream port commit/PR,
consumer version (or unknown), intentional differences and verification evidence.
Distinguish implemented, documented-only, intentionally different and pending.
Upstream branch, merge, release and installed version are separate facts.

Close an Aside issue only after its port is merged into `main` and isolated
downstream checks satisfy every applicable acceptance criterion. If installed
behavior is promised, verify the actual loaded version too. Keep partial work
open; upstream completion alone is insufficient. Upstream PRs should reference
Aside issues without cross-repository auto-closing directives. This policy does
not itself authorize a push, release, installation or issue closure.

### Port ledger — 0.1.0 source verification

Shared source: codexclaw `9d32c389f98da74d147ec6726b97a6f972760414`.
`port-manifest.json` pins the source revision and SHA-256 of every shared payload
file. Adapted files are listed separately; installed account versions remain unknown
until explicitly checked. The earlier `03b7794` port lacked these fixes.

| Issue | Implemented behavior | Verification |
|---|---|---|
| [#1](https://github.com/lidge-jun/aside-visualizer/issues/1) | Missing checks BLOCKED/3; failures/timeouts FAIL/1; all page geometries checked; old PDFs preserved; owned process cleanup | Actual CLI positive/negative fixtures; real A4/Letter `--qa-only`; no-Chrome QA preserved |
| [#2](https://github.com/lidge-jun/aside-visualizer/issues/2) | Portable intake, source spans/counter-evidence, optional host retrieval adapter, skill/package/source receipt | Source-only zero-retrieval, absent capability, malformed/duplicate evidence, legacy compatibility and byte/output parity |
| [#3](https://github.com/lidge-jun/aside-visualizer/issues/3) | English-native genres, KO/EN facts/qualifications/quotes, explicit paper size and visible localized fields | Six paired examples, malformed dates/orphaned-content negatives, bilingual review and actual A4/Letter glyph/long-label checks |
| [#4](https://github.com/lidge-jun/aside-visualizer/issues/4) | Separate analytical recipe/instance contracts across six domains, faithful exact-table fallback | Per-encoding calculations/bounds/dates/denominators, misleading-claim negatives, missing sources and hostile labels |

The table describes source verification. Close the issues only after the dev/main
integration, downstream CI and published archive are verified. Upstream completion
alone is insufficient. General semantic truth and accessibility conformance are not
certified by structural validators.

## Verification and distribution

Node 24 or newer runs the dependency-free tests; no account/browser/network setup
is needed by the deterministic suite:

```sh
node --test "test/*.test.mjs"
node scripts/report-intake.mjs assets/research-handoff.example.json --metadata assets/aside-generation-metadata.json
node scripts/report-locale.mjs assets/report-examples/reference-en.json > report.html
```

The 2026-09-22 local port run passed 226 tests with no skips. CI repeats the suite
on Linux, macOS and Windows. Tests pin shared file hashes and standalone references.
Fixtures use illustrative data; paired-field equality is not proof of faithful prose,
so bilingual content review and PDF layout inspection were recorded separately.

Install from a verified tagged skill archive in
[GitHub Releases](https://github.com/lidge-jun/aside-visualizer/releases). Verify
SHA256SUMS before replacing an existing account skill. The archive contains SKILL.md,
assets, references, scripts, license and provenance; it does not install globally.
For a first-release rollback, retain the prior `03b7794` source snapshot or your
previous account-skill backup. Never overwrite a published version tag or asset.

On the observed Chrome 153 macOS host, the CLI could write a PDF without exiting;
it now fails at its timeout and preserves the previous destination. Browser-controlled
export completed normally, and the same `--qa-only` verified those PDFs without a
system Chrome dependency. A produced draft, an automated PASS and publication-ready
review remain distinct. Use the no-Chrome recipe or another supported exporter when
a local CLI engine cannot complete; do not turn the timeout into a success.

## License

MIT, as upstream.
