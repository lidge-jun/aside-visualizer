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

- `reference/reader-documents.md` bundled locally (upstream reaches it through
  a sibling-skill path, `../dev/references/...`, which blocks standalone
  installs; see codexclaw#183).
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

## License

MIT, as upstream.
