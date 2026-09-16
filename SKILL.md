---
name: dev-visualizer
description: "Create well-composed visual documents, HTML reports, SVG diagrams, charts, interactive explainers and PDF deliverables. Use for visualize, visual explanations, architecture diagrams, comparison reports, infographics, document creation, 시각화, 그려줘, 문서 만들어줘, 보고서, PDF 생성. Preserve explicit formats and templates; text-only requests and ordinary code changes do not need a visual."
metadata:
  last-verified: "2026-09-16"
  short-description: "Visual documents, SVG/HTML explainers and verified PDF delivery."
  keywords: [diagram, visualization, visualize, document, report, SVG, HTML, PDF, interactive, cover, contents, storyline, cxc-dev-visualizer]
---

# Visual documents — compose, render, deliver

Turn the reader's question and supplied facts into a useful visual artifact.
This skill (ported from codexclaw `cxc-dev-visualizer`) owns artifact
composition and delivery in Aside. There is no host `visualize` inline-fragment
renderer in Aside: every visual deliverable is a standalone artifact file
(HTML/SVG/PDF) written under the session's artifacts directory, verified by
opening it in the Aside browser. Format-specific Aside skills (docx, pptx,
xlsx, pdf) own document mechanics; this skill owns visual composition.

## Start with the requested outcome

Infer the audience, question to answer, source material and output format from
context. Ask only for missing information that materially changes the result.
For “문서 만들어줘” with no format constraint, a readable HTML document is a
reasonable stated assumption. “visualize” in a conversation usually needs a
focused explanation. Neither phrase grants permission to publish or install.

- Preserve a named format, existing template, branding, section order and required
  contents. A DOCX request ends with DOCX; HTML can be a preview, not a substitute.
- Read supplied data and documents before designing. Distinguish observations,
  user-provided figures, assumptions and illustrative data. Never invent facts
  to populate a chart. Retain sources, dates, units and uncertainty where relevant.
- A requested Markdown table or text-only answer stays Markdown/text. A visual
  earns its space by clarifying a relationship, comparison or decision.
- Match document scale to content: one figure can be enough; reports need narrative,
  evidence and conclusions. Do not turn every request into a dashboard or slide deck.

## Select a route; read only what it needs

| Requested result | Authoring route | Read when selected |
|---|---|---|
| In-conversation comparison, simulation or explainer | Standalone HTML artifact in the session artifacts dir; verify by opening in the Aside browser | [delivery](reference/environment-detection.md) |
| Small static structure expressible as labeled nodes/edges | Mermaid fenced block in chat if it renders; otherwise a standalone SVG/HTML artifact | [SVG and interaction](reference/svg-and-interaction.md) only for custom output |
| Editable SVG diagram or infographic | Native SVG with legible geometry and text, saved as an artifact | [Visual design](reference/visual-design.md), [SVG and interaction](reference/svg-and-interaction.md) |
| HTML report, technical brief, visual review or document | Semantic HTML with purposeful figures and readable sections | [Reader documents](reference/reader-documents.md), [Visual design](reference/visual-design.md), [documents/PDF](reference/document-pdf.md) |
| Multi-page report for a decision maker (client report, research report, proposal, 보고서) | [Report writing](reference/report-writing.md) storyline first, then [paged-report.html](assets/paged-report.html) exported with `scripts/export-paged-report.mjs` (needs node + local Chrome; poppler for TOC/QA) or the no-Chrome REPL route in [no-chrome-pdf-export](reference/no-chrome-pdf-export.md) | [Report writing](reference/report-writing.md), [Documents/PDF](reference/document-pdf.md) REPORT-PRINT-01/QA-01 and the CJK recipe, [no-chrome export](reference/no-chrome-pdf-export.md) if Chrome is absent, [Visual design](reference/visual-design.md) REPORT-DESIGN-01/VIZ-01 |
| Interactive HTML model | One useful visual plus requested inputs that change it | [SVG and interaction](reference/svg-and-interaction.md), design reference if styling is open |
| PDF, print report or handout | `page.pdf()` on the rendered artifact (Aside's own Chromium — no system Chrome needed, see [no-chrome export](reference/no-chrome-pdf-export.md)), or `scripts/export-paged-report.mjs` for paged reports with Chrome; actually export | [Reader documents](reference/reader-documents.md), [Documents/PDF](reference/document-pdf.md); Aside `pdf` skill for inspection |
| Word/Google Docs, Slides/PPTX or spreadsheet | Aside `docx`/`pptx`/`xlsx`/`google-docs`/`google-sheets` skills own mechanics; use this skill for visual composition | [Documents/PDF](reference/document-pdf.md) for boundaries |
| Scientific figure intended for export/publication | Standard plotting tools and vector/raster artifact | Design/label principles here; scientific tool's own workflow |
| Website, app page or existing component change | Project conventions own implementation | This skill only for embedded explanatory artifacts |

No tool or companion skill is assumed installed. Inspect available capabilities;
if a required exporter is absent, deliver the useful editable source and identify
the missing requested output. Never call print-ready HTML a generated PDF.

## Compose before styling

Start from the reader contract and document type in
[Reader documents](reference/reader-documents.md), then run a compact design
read: **reader → question → information structure → visual encoding →
type/color/spacing → output constraints**. State the chosen direction
briefly when it helps the user evaluate an open brief. Reuse existing design tokens.

[Visual design](reference/visual-design.md) supplies distinct optional directions
and composition recipes. Select a coherent set for this artifact. Borrow principles
from several references, then reconcile them: one type hierarchy, one spacing rhythm,
consistent semantic colors, a deliberate level of detail. A source's trend or star
count is not a design requirement.

Examples of structure that earns its form:

- Explain a mechanism with actions on connectors and a caption stating what changes.
- Compare alternatives on the same dimensions and scale, with a table for exact values.
- Reports and explainers follow [Reader documents](reference/reader-documents.md):
  answer first, claim-shaped headings, evidence in an appendix.
- A report over about four pages follows [Report writing](reference/report-writing.md):
  write the dot-dash storyline before any HTML, make every section heading a claim
  that reads in sequence to the ask, give the summary a full page that decides
  alone, number and source every exhibit, hold one register, and name the issuing
  organization the way the reader knows it. Cover and contents pages are part of
  the document, not decoration.
- For a dense system, use overview plus focused detail rather than shrinking every label.

Keep document narrative in the document. Aside chat renders markdown and
artifact files, not inline HTML fragments; do not paste a whole report into a
chat message.

## Build the smallest complete artifact

Use semantic, editable source. Keep text-bearing HTML in normal responsive Grid/Flex
flow; derive SVG connector endpoints from rendered bounds if needed
(**DIAGRAM-LAYOUT-01**). Standalone SVG is a vector document: geometric coordinates
are appropriate, but size/wrap labels from actual text metrics and inspect the result.

[editorial-report.html](assets/editorial-report.html) is an optional original,
dependency-free example for reports with a live scenario and print output. Adapt
its content and visual direction; it is not a mandatory template or a finished
report about the user's data. See the document reference for export readiness.
[paged-report.html](assets/paged-report.html) is the A4 report skeleton set as a
publication (REPORT-DESIGN-01: hairlines and type, one accent, a data chart, no
cards or tinted boxes): cover, contents with page numbers, summary page, flowing
body with claim headings and numbered exhibits, appendix and notice, with a
house-style token block at the top. Its company and numbers are fictional.
`scripts/export-paged-report.mjs <in.html> <out.pdf>` prints it with a local
Chromium, fills the contents page numbers in a second pass and reports layout
findings; `--qa-only <pdf>` audits a PDF from any engine and needs only poppler.
Without system Chrome, export through Aside's own Chromium instead — the
validated REPL two-pass and codemode routes are in
[no-chrome-pdf-export](reference/no-chrome-pdf-export.md).

Prefer native HTML/CSS/SVG and existing libraries. For library-dependent visuals,
verify actual versions and APIs, use authorized pinned assets, and distinguish
“one HTML file” from “works offline.” Do not execute retrieved HTML/JS or insert
untrusted strings as executable markup. Preserve dependency/font notices when copying.

The legacy `reference/html-templates.md` and `scripts/diagram-to-html.sh` remain
optional compatibility samples, **not the normal authoring route**. Their dark-theme,
CDN and environment defaults are not requirements. The shell helper wraps trusted
local content, is not a sanitizer or inline-fragment generator, and needs an explicit
authorized output path for durable delivery. Do not install it as a prerequisite.

## Verify what the reader receives

**DIAGRAM-RENDER-VERIFY-01:** render the final artifact, read the screenshot/page,
fix clipping, collisions, empty charts and runtime errors. Inspect the longest
labels at narrow and wide widths appropriate to the artifact; for responsive
HTML include 320/736px and the intended desktop size. SVG text must remain legible
at its intended display/export sizes, not merely within a valid viewBox.

For interaction, change the primary input and observe the resulting marks/values;
exercise keyboard access and reset when provided. A static screenshot is not
interaction proof. For PDF, inspect the **actual exported pages**, including
multipage tables, final content, Korean glyphs and selected scenario state.
Print CSS or a PDF filename alone proves nothing. For a delivered report, run the
export script's QA (REPORT-QA-01) and the fresh-reader check on the rendered pages
(REPORT-FRESH-01); an orphan line at the top of a page, a heading stranded at the
bottom, a half-empty page or a figure whose text prints under 8.5pt is a defect.

**DIAGRAM-SYNTAX-01:** use an existing supported parser/checker where available.
XML validation can catch malformed SVG; it cannot catch overlapped labels. Do not
invent a Mermaid CLI parse command or install a runner just for incidental proof.

**DIAGRAM-A11Y-01:** provide names/descriptions, meaningful heading order, data/text
alternatives, visible keyboard focus, non-color meaning, readable contrast and
reduced motion where applicable. Inspect actual contrast and reading order;
adding ARIA does not establish accessibility conformance.

## Deliver and retain provenance

Save deliverables under the session's artifacts directory (the absolute
`.../artifacts` path from the working-directory instructions), scratch renders
under `.../tmp`. Return a clickable absolute file link for a requested
standalone artifact. Only say it opened, rendered, exported or published when
that outcome was observed in the Aside browser or the exported file. Describe
the useful result concisely.

[Source patterns](reference/source-patterns.md) records the GitHub references,
observed dates, licensing and adopted/rejected ideas. Read it when borrowing further
material or refreshing the skill, not for every small diagram.
`reference/visualize-contract.md` is a historical snapshot of the codex host's
inline renderer contract; Aside has no equivalent, so it is provenance only.
