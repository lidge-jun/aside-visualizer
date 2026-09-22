# aside-visualizer

Aside account-skill port of [codexclaw](https://github.com/lidge-jun/codexclaw)'s
`dev-visualizer` skill: well-composed visual documents, SVG diagrams, HTML
explainers and paged PDF reports, delivered as verified artifact files.

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

### Port ledger — audited 2026-09-22

Source snapshot: codexclaw `main` `1914fb679b2f625989be5af2322eec8a749663d4`
and `dev` `d9d8a086a1da586008d88c8c9328b781f43e4ca0` have identical visualizer
sources. Aside `main` remains `03b7794bbf72f1a36bae29592bc5e2ba00c68ced`.
This is a dated audit, not an automatic sync; installed versions were not checked.

| Issue | Upstream evidence | Downstream implementation | Closure |
|---|---|---|---|
| [#1 Fail-closed export](https://github.com/lidge-jun/aside-visualizer/issues/1) | Pending in the exporter; a separate receipt gate rejects NOT RUN but is not connected to export | Pending: missing PDF tools still produce PASS/0; no structured check outcomes or negative fixtures | Keep open |
| [#2 Evidence handoff/version](https://github.com/lidge-jun/aside-visualizer/issues/2) | Partial: [70155d23](https://github.com/lidge-jun/codexclaw/commit/70155d239daf0935a1d64d28a5355e59b483399b) adds the shared handoff and skillVersion receipt | Pending: model, adapter and generation receipt absent; this ledger adds documentation only | Keep open |
| [#3 English/bilingual parity](https://github.com/lidge-jun/aside-visualizer/issues/3) | Partial foundations: source/output language fields and [genre rules](https://github.com/lidge-jun/codexclaw/commit/9db43d990d4bbf0d255916f4835655f216dbe4e0); full bilingual examples/fixtures absent | Pending: Korean templates remain; no paired semantic/locale fixtures | Keep open |
| [#4 Analytical exhibit recipes](https://github.com/lidge-jun/aside-visualizer/issues/4) | Partial guidance/page roles; analytical recipe schema and negative fixtures absent | Pending: general visual guidance exists, but no tested analytical recipe contract | Keep open |

No downstream fix commit or verified consumer version exists in this audit for
these four issues. Existing standalone/no-Chrome adaptations are intentionally
different, not proof that the issues are complete.

Verification: an isolated `--qa-only` probe with PDF tools unavailable returned
`notRun: ["pdftotext/pdfinfo missing: contents page numbers and layout QA NOT RUN"]`,
`verdict: "PASS"`, exit `0` in **both** repositories. No real browser, account,
installation or private document was used. Codexclaw's existing six report and
packaging suites passed 78/78 tests; this does not cover the reproduced defect.
Aside has no tracked test suite or parity fixtures at the audited revision.

## License

MIT, as upstream.
