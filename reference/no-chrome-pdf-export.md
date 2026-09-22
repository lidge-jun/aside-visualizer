# No-Chrome PDF export — Aside's own Chromium instead of a system Chrome

`scripts/export-paged-report.mjs` needs a local Chromium binary. Aside is a
Chromium fork: the REPL browser tab and codemode's `browse.captureMany` both
print through the same engine, so a report can be exported with **no system
Chrome at all**. Use bundled Poppler when it is available on PATH, or pass explicit `--pdfinfo`
and `--pdftotext` paths. Check availability in the current host: missing tools
produce BLOCKED/3, never a verification PASS. This recipe records measurements
from 2026-09-16; confirm current wrapper options before use.

Pick one row, not all three:

| Path | Use when | Template-exact pagination? |
|---|---|---|
| CLI script + Chrome | Chrome installed; one command; auto QA | yes (`@page` honored) |
| REPL `page.pdf()` | no Chrome; final deliverable; you have a REPL session | yes (`preferCSSPageSize: true`) |
| codemode `browse.captureMany` | shell-only context, batch captures, quick verified A4 | **no** (engine-default margins; page count can differ) |

## Facts about the Aside browser that shape all three

- `file://` is refused ("Cannot navigate to a file URL without local file
  access"). Deliver a self-contained document as a `data:text/html` URL
  (REPL: `goto("data:text/html;charset=utf-8," + encodeURIComponent(html))`)
  or serve the artifact directory over loopback HTTP.
- Loopback HTTP worked in the 2026-09-16 probe. Start a task-owned server bound
  to 127.0.0.1 using the current host background-process API, record its handle,
  and stop only that process after use. Do not kill processes by a broad name.
- The REPL page wrapper has no `setContent()`; `goto()` with a data: URL is
  the supported way to load a string. `format: "A4"` and `width/height` are
  ignored by the wrapper — use `preferCSSPageSize: true` (lets the template's
  `@page { size: A4; margin: … }` rule everything) or CDP-style
  `paperWidth: 8.27, paperHeight: 11.69`.
- A `format` shortcut anywhere was measured to produce US Letter while claiming
  A4; codemode refuses it outright. Only inches or CSS are safe.

## Path A — REPL two-pass (no Chrome, template-exact)

Validated end to end 2026-09-16 on the bundled paged-report template: 7 pages
A4, TOC numbers `3/4/5/6/6/7` filled and verified in the printed page. Steps,
split REPL / bash because the guest cannot spawn poppler:

1. **REPL — pass 1.** Read the HTML with `fs`, `goto()` the data: URL, print:

```js
const T = "/abs/session/tmp";                     // scratch, not artifacts
const html = await fs.readFile(T + "/report.html", "utf8");
const tab = tabs[0] || (await openTab("about:blank"));
await tab.goto("data:text/html;charset=utf-8," + encodeURIComponent(html), { waitUntil: "load" });
await tab.pdf({ path: T + "/pass1.pdf", preferCSSPageSize: true, printBackground: true });
```

2. **bash — map TOC headings to pages.** Mirror of the CLI script's logic
   (`locate()` starting after the contents page):

```bash
export PATH="$HOME/.aside/runtime/bin:$PATH"      # bundled poppler
# TOC page = first page containing 목차 or Contents; default 2
for h in "첫 번째 섹션 제목" "두 번째 섹션 제목"; do
  for p in 3 4 5 6 7 8 9 10; do
    if pdftotext -f $p -l $p pass1.pdf - 2>/dev/null | grep -q "$h"; then echo "$h => $p"; break; fi
  done
done
pdfinfo pass1.pdf | grep -E 'Pages|Page size'     # expect A4
```

   Watch for false hits: the cover and the contents page can contain the same
   words. That is why the search starts *after* the TOC page.

3. **REPL — inject + pass 2.** Fill `[data-toc-for="ID"]` spans, reprint:

```js
let html2 = html;
const map = { summary: 3, s1: 4 };                // from step 2
for (const [id, pg] of Object.entries(map)) {
  html2 = html2.replace(new RegExp('(<[^>]*\\bdata-toc-for="' + id + '"[^>]*>)([^<]*)(</)', "g"), "$1" + pg + "$3");
}
await fs.writeFile(T + "/toc-pass.html", html2);
await tab.goto("data:text/html;charset=utf-8," + encodeURIComponent(html2), { waitUntil: "load" });
await tab.pdf({ path: "/abs/session/artifacts/report-final.pdf", preferCSSPageSize: true, printBackground: true });
```

4. **bash — verify.** `pdftotext -f 2 -l 2` the contents page and check the
   printed numbers; run the layout QA via
   `node scripts/export-paged-report.mjs --qa-only report-final.pdf --paper-size A4 --json`
   (QA does not need Chrome; only the export does). Exit 0 = automated checks completed, 1 = FAIL, 2 = REVIEW, 3 = BLOCKED.
   `deliveryReady:false` stays separate from successful automatic checks.

## Path B — codemode captureMany (batch / shell, not template-exact)

`browse.captureMany` prints and brings the PDF back to `outDir` with a
host-issued name and a pageBox check (A4 verified per page). Use
`scripts/capture-pdf.codemode.js`. Constraints measured 2026-09-16:

- pdf options whitelist is `paperWidth`, `paperHeight`, `printBackground` —
  no `preferCSSPageSize`, so the template's `@page` margins are not honored
  and pagination can differ from the CLI/REPL layout (the 7-page test template
  paginated to 8). Fine for quick captures; not for the final deliverable of a
  designed report.
- The URL travels inside the generated script against a 50k wire limit
  (`ESOURCETOOLONG`). A large document percent-encoded into a data: URL blows
  it — serve the file over loopback instead and pass the http:// URL.
- Poppler steps still run in bash between calls; the guest cannot spawn them.

For a full two-pass export through codemode you would loop the capture with
mapping in bash between passes — but prefer Path A for that; codemode earns its
keep on batches of URLs, not on the two-pass dance.

## QA without Chrome

`scripts/export-paged-report.mjs --qa-only <pdf> --json` needs only poppler,
no Chrome. It reports page count, page size, blank-page and orphan findings.
Select the same explicit A4/Letter size as the export; every page is checked.
Run automated checks on delivered PDFs at the chosen assurance level. This does not
require rendering a simple static HTML edit that is not being exported. Note the
`--qa-only` JSON goes to stdout while Chrome stderr noise goes to stderr; run
with `2>/dev/null` or redirect to files before parsing.
