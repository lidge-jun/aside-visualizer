# Delivery — inspect capabilities, not application labels

Choose delivery from the user's requested artifact and the current host contract.
Environment variables, app names, ports and installed packages are hints only;
they do not establish that the conversation supports a renderer.

In Aside the delivery contract is: **every visual deliverable is a standalone
artifact file** written under the session's `.../artifacts` directory (scratch
renders under `.../tmp`). The Aside browser (Playwright `page` in the REPL) is
the verification surface. There is no inline HTML-fragment renderer.

| Evidence actually available | Use |
|---|---|
| Markdown-only answer is enough | Plain markdown; do not build a visual |
| User asks for a standalone HTML/SVG/PDF file | Create that file under the session artifacts dir |
| Aside browser available (it is, in REPL sessions) | Open the artifact (`openTab(file://…)` or a loopback server), snapshot/screenshot to verify, return the file link |
| Paged report PDF needed | `scripts/export-paged-report.mjs` with local Chrome + poppler |
| No renderer/exporter is available | Provide useful editable source/text and state which verification/output is unavailable |

`reference/visualize-contract.md` is codex provenance only; Aside exposes no
`visualize` skill and no fragment contract. Do not emit historical directives
from it, and never use a local server's health response as proof that the user
is reading its UI.

## Files and browser inspection

- Write deliverables to the absolute `.../artifacts` path given in the
  working-directory instructions; disposable inspection copies go under
  `.../tmp`. Scratch space elsewhere is not conversation-readable.
- `file://` URLs are refused by the Aside daemon ("Cannot navigate to a file URL
  without local file access"). Load a self-contained document as a
  `data:text/html` URL — `goto("data:text/html;charset=utf-8," +
  `encodeURIComponent(html))` in the REPL; the wrapper has no `setContent()`.
  If the document must load over HTTP (fetch, modules), serve **only** the
  artifact directory on loopback with a task-owned process: double-fork it so
  it survives the bash call that started it —
  `( python3 -m http.server 18771 --bind 127.0.0.1 --directory "$T" >/dev/null 2>&1 & )`
  — and stop it after use (`pkill -f "http.server 18771"`). Loopback is
  reachable from both the REPL browser and codemode's browser (tested
  2026-09-16); bind to 127.0.0.1 only, never a LAN interface.
- Paper size: the REPL pdf wrapper ignores `format:` and `width/height` and
  reads CDP-style options — pass `preferCSSPageSize: true` (template `@page`
  wins, matches the CLI script's output) or `paperWidth: 8.27, paperHeight:
  11.69`. A `format` shortcut was measured to produce US Letter while claiming
  A4. Codemode's `browse.captureMany` accepts only `paperWidth`,
  `paperHeight`, `printBackground` — no `preferCSSPageSize`, so pagination can
  differ from the template spec there. Details: [no-chrome
  export](no-chrome-pdf-export.md).
- Verify with `snapshot()` / `page.screenshot()`; for print/PDF claims inspect
  the exported file itself, not the browser view.
- Platform open commands (`open`) are optional conveniences. Successful process
  dispatch proves the request was sent, not that a page rendered. Inspect
  before claiming it.

## Inline chat and standalone are different products

Aside chat renders markdown text and links to artifact files; it does not
render inline HTML fragments or host-provided interaction APIs. A standalone
report owns its document structure, tokens and interactions. Never deliver a
chat markdown dump as "the HTML file", and never depend on REPL-only globals
(`page`, `snapshot`, `fs`) inside exported files.

“Self-contained” means the necessary code/data/assets are included; a CDN-backed
single file still needs network access. Test with network disabled before claiming
offline behavior. Do not fetch private data or introduce telemetry into an artifact.

PDF is a separate output: perform the export (`page.pdf()` or
`scripts/export-paged-report.mjs`) and inspect its pages following
[documents/PDF](document-pdf.md). Browser rendering alone cannot certify PDF layout.
