# Aside inline visuals: route, compose, verify, promote

Aside shipped a built-in `visualize` skill (publicly announced as `/visualize`
on 2026-10-07). A fenced `visual` code block in the reply holds one
self-contained HTML page; Aside renders it inline in a sandboxed, borderless
frame sized to the page height and themed with the user's CSS variables.

**ASIDE-INLINE-01 — the host skill owns the mechanics.** Before writing or
changing a `visual` block, read the current built-in `visualize/SKILL.md`
from the task's skill catalog (account path `skills/builtin/visualize/`).
Its fence name, size budget, theme variables, layout limits, image rule and
preview recipe win over anything summarized here. This file adds what the
host skill does not decide: when to go inline versus a file, how this
skill's composition discipline applies inside the frame, and how to promote
an inline visual to a durable artifact. The inspection record lives in
[`upstream/aside-visualize-upstream.md`](../upstream/aside-visualize-upstream.md).

## Route: inline block or artifact file

Default to inline for an explanation the reader consumes now, in this chat.
Default to a file when the output must outlive or leave the conversation.

| Signal in the request or context | Route |
|---|---|
| "visualize / 시각화 / 그려줘 / explain how X works", one question, read once | Inline `visual` block |
| Comparison, timeline, small chart, mechanism diagram, what-if slider over embedded data | Inline `visual` block |
| A named file format (HTML/SVG/PDF/DOCX/PPTX), "보고서", "문서 만들어줘", "파일로", "공유할" | Artifact under the session artifacts directory |
| Multi-section narrative, cover/contents, appendix, or anything printed | Artifact (paged report route), optionally with one inline summary visual |
| Page would exceed the host size budget (about 100 KB) or needs many images | Artifact |
| Channel conversation (Slack, Telegram, Discord bridge) where the block is dropped | Render the block in a scratch tab and attach a screenshot, or deliver a file |
| Needs the user's session, cookies, private API or live Aside data at view time | Neither: gather the data first and embed it; the frame cannot reach Aside |
| A Markdown table or plain answer is enough | Markdown; no visual |

Both is fine: a report artifact plus one inline exhibit that states its main
finding. Never paste a whole report into a `visual` block.

## Compose inside the frame

Everything in [Reader documents](reader-documents.md) and
[Visual design](visual-design.md) about **what** to show still applies:
reader → question → information structure → encoding. Inside the frame the
host's design system decides **how it looks**, so this skill's report
directions (serif publication type, house tokens, fixed palettes) do not
carry over.

- **INLINE-TRUTH-01.** Embed only gathered or user-supplied data, with units,
  date and source in a muted caption line. Mark illustrative data as such.
  Pick encodings that do not exaggerate: zero-based bars, the same scale for
  compared panels, axes that do not invent a gap between categories. An
  attractive diagram that misstates the shape of the data is a defect, not a
  style choice.
- **INLINE-ANSWER-01.** One idea per visual. Put the insight on the chart
  (reference line, marker, direct label), keep the reply text for what the
  visual cannot say, and do not restate its numbers in prose.
- **INLINE-THEME-01.** Style only with the host's CSS variables; no
  hard-coded light/dark colours, no page background, no outer card or banner
  title. Canvas charts must redraw on colour-scheme change.
- **INLINE-FLOW-01.** Fluid width from about 320 px to 760 px, container
  reflow (`auto-fit` grids, `flex-wrap`, SVG redrawn from `ResizeObserver`),
  fixed pixel chart heights, never `100vh` or `height: 100%` on html/body.
- **INLINE-DIAGRAM-01.** Mechanisms and architectures as inline SVG: rounded
  node rects with title and muted subtitle, cubic edges, labels painted after
  connectors with a halo (`paint-order: stroke`). Clickable nodes may
  highlight neighbours and open a detail panel; dim what is not selected.
- **INLINE-MOTION-01.** One short entrance animation at most, plus subtle
  flow on active edges if it explains direction. Respect
  `prefers-reduced-motion`. Interaction (tabs, sliders, hover values) must
  change something the reader would otherwise have to compute.
- **DIAGRAM-A11Y-01** still applies: `<title>`, `role="img"` with an
  `aria-label` on SVG that summarises the finding, visible focus on controls,
  meaning not carried by colour alone.

Libraries from a CDN load as-is, but hand-built HTML/CSS/SVG matches the
theme without overriding stock styling. If a library is used, restyle its
fonts, ticks, grid and legend to the host tokens.

## Verify in proportion

The host skill asks for a scratch-tab preview for anything beyond a simple
table, and the host wins over the codexclaw tier that sends inline visuals
after a source reread. Concretely:

| Inline visual | Before replying |
|---|---|
| Static table, stat row, hand-placed boxes, no script | Reread the source once |
| Any script, computed geometry, `ResizeObserver`, library, animation or interaction | Host preview recipe: `about:blank` + preview theme + error probe, screenshots at about 728 px and 380 px, read `window.__errors`; exercise the primary control once |
| A defect was reported or seen | Render every further fix before sending |

The preview theme block is for the scratch tab only and must never ship in
the final block. Local images do not load in the preview; Aside inlines
absolute session paths only in chat. An unrun preview is reported as "not
rendered", never as verified.

## Promote an inline visual to a file

When the user asks to keep, share, print or export what was shown inline:

1. Copy the same page into the artifacts directory as `name.html`.
2. Add a fallback token block **before** any rule that uses the variables,
   because Aside's theme variables do not exist outside the chat frame:

   ```html
   <style>
   :root{color-scheme:light dark;--background:#fff;--foreground:#171717;--muted-foreground:rgba(23,23,23,.6);--muted:rgba(23,23,23,.06);--surface-primary:rgba(23,23,23,.04);--surface-secondary:rgba(23,23,23,.03);--border:rgba(23,23,23,.12);--primary:#171717;--primary-foreground:#fff;--brand:#0284c7;--success:#059669;--destructive:#dc2626;--chart-1:#0284c7;--chart-2:#0d9488;--chart-3:#d97706;--chart-4:#9333ea;--chart-5:#e11d48;--chart-6:#65a30d;--radius:.625rem;--font-sans:system-ui,-apple-system,"Apple SD Gothic Neo",sans-serif;--font-mono:ui-monospace,Menlo,monospace}
   @media (prefers-color-scheme:dark){:root{--background:#171717;--foreground:#fafafa;--muted-foreground:rgba(250,250,250,.55);--muted:rgba(250,250,250,.15);--surface-primary:rgba(250,250,250,.08);--surface-secondary:rgba(250,250,250,.06);--border:rgba(250,250,250,.1);--primary:rgba(250,250,250,.85);--primary-foreground:#171717;--brand:#38bdf8;--chart-1:#38bdf8;--chart-2:#2dd4bf;--chart-3:#fbbf24;--chart-4:#c084fc;--chart-5:#fb7185;--chart-6:#a3e635}}
   html{background:var(--background);color:var(--foreground);font:14px/1.5 var(--font-sans)}body{margin:0 auto;max-width:760px;padding:24px}
   </style>
   ```

3. Replace absolute session image paths with files copied next to the HTML
   (or data URLs) so the file works after the session folder is cleaned.
4. For PDF, add `@page` size and print rules, then follow
   [documents/PDF](document-pdf.md) and the
   [no-Chrome export route](no-chrome-pdf-export.md); a promoted visual is in
   the exported tier and gets the full DIAGRAM-RENDER-VERIFY-01 pass.

Going the other way, a finished report can be summarised inline with its one
key exhibit rebuilt on host tokens, plus the absolute artifact path.

## Boundaries

- The frame cannot reach Aside, the session or cookies; `fetch` works only
  for public CORS endpoints. Embed data; never embed secrets, tokens or
  personal identifiers the reader did not ask to see.
- `http(s)` links open in a new tab. `file://` URLs and files outside the
  session folder do not load.
- This file summarises the host contract inspected on the date recorded in
  the upstream tracking file. If the live host skill differs, follow it and
  refresh the record with `node upstream/sync-check.mjs`.
