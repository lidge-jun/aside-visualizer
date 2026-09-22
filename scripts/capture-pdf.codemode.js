// capture-pdf.codemode.js — print one reachable URL to a pageBox-verified A4 PDF
// through aside-codemode's browse.captureMany, bringing the file back to outDir.
//
// Run with the account CLI pair:
//   <node> <installed-codemode-cli> --code-file <this-file>
//
// Works for: http(s) URLs, a loopback server you started for the artifact dir
// (record and later stop its task-owned process), or a SMALL data: URL. The whole
// job is serialized into the generated script against a 50k wire limit, so do
// not embed a large document in CONFIG.URL — serve the file over loopback
// instead. For template-exact pagination (@page margins honored) use
// scripts/export-paged-report.mjs with Chrome, or the REPL page.pdf() route in
// reference/no-chrome-pdf-export.md; this capture prints with engine-default
// margins, so pagination can differ from the CSS spec.
//
// Batch: duplicate entries in CONFIG.URLS (they are independent) or call this
// script once per URL; each item returns its own verified pdf path.

// ---- CONFIG (edit per run) ----
const URLS = ["http://127.0.0.1:18771/report.html"];
const OUT_DIR = "/absolute/path/to/outdir";
const PDF = { paperWidth: 8.27, paperHeight: 11.69, printBackground: true }; // explicit A4 inches
// --------------------------------

const r = await browse.captureMany(URLS, { pdf: PDF, outDir: OUT_DIR, waitUntil: "load" });
const out = { status: r.status, items: [] };
for (const it of r.items) {
  out.items.push({
    url: it.url, status: it.status, ok: it.ok,
    pdf: it.pdf || null, error: it.error || null,
  });
}
if (r.partial && r.partial.length) out.partial = r.partial;
console.log(JSON.stringify(out, null, 1));
