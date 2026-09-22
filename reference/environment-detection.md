# Aside delivery and proportionate verification

Aside delivers standalone artifact files in the session's authorized artifacts
folder. It does not provide the codex host's inline HTML-fragment renderer.
A filename or successful open command does not prove rendering or PDF export.

| Requested output | Delivery and proof |
|---|---|
| Markdown answer | Return Markdown; no visual is required |
| Simple static HTML/SVG in ordinary flow | Reread source, save to artifacts, return link; no mandatory browser round trip |
| Computed or interactive visual | Execute in the available browser, observe the affected state and fix actual defects |
| PDF/print/paged report | Actually export, select assurance profile, run the applicable PDF checks |
| Missing export capability | Return useful editable source and identify the requested output/check that did not run |

Browser availability does not promote a static edit to visual QA. A reported defect
or computed geometry can require rendering under VIZ-VERIFY-SCALE-01.

## Browser and no-system-Chrome PDF route

Use the current Aside tool contract, not an assumed account or API. The
[no-Chrome export recipe](no-chrome-pdf-export.md) records the measured Aside
`page.pdf()` route. Keep it available alongside the optional local Chromium CLI.
`--qa-only` reads a PDF from either engine and never needs system Chrome.

For browser work, use a self-contained data URL or a task-owned loopback server
when the current host refuses file URLs. Serve only the artifact directory on
127.0.0.1, record the background process handle, and stop only that process. Do not
use broad name-based process termination or reuse another task's server/profile.
Recorded 2026-09-16 wrapper limitations are historical measurements; recheck current
option support. Select explicit CSS A4/Letter or documented inch dimensions, then
verify every actual PDF page. Language never implies paper size.

Keep browser/REPL globals out of saved standalone files. Do not fetch private data
or add telemetry. If offline operation is promised, ensure all dependencies are local
and test that promise for computed output. `visualize-contract.md` is historical
provenance only, never an alternative Aside rendering API.

## Research handoff adapter

`research-adapter.mjs` accepts a caller-supplied retrieval function and returns the
same model/receipt/issues contract as upstream. A source-only invocation never calls
it. When authorized research is requested, use the currently exposed Aside research
capability and adapt its actually read sources, spans, claims, answers, opposing
evidence and gaps to that contract. Snippets remain leads; do not convert them into
verified observations. Missing capability is an explicit issue, not invented facts.
Set generation metadata `hostAdapter: "aside"` and the loaded skill/package/source
versions when known. No fixed account path, daemon or provider is required.

The Node CLI supports frozen source inputs without network:

```sh
node scripts/report-intake.mjs assets/research-handoff.example.json
```

See [report pipeline](report-pipeline.md) for executable signatures. This adapter
contract does not authorize network activity or a second research/QA engine.
