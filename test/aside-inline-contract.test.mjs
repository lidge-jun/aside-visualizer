import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(join(root, p), "utf8");
const syncCheck = join(root, "upstream", "sync-check.mjs");

test("inspection record pins a hash, date and fence for the Aside built-in skill", () => {
  const record = read("upstream/aside-visualize-upstream.md");
  assert.match(record, /^- Current SHA-256: `[0-9a-f]{64}`$/m);
  assert.match(record, /^- Last inspected: `\d{4}-\d{2}-\d{2}`$/m);
  assert.match(record, /^- Fence: `visual`$/m);
});

test("SKILL.md routes in-chat visuals to the inline block and links the adapter", () => {
  const skill = read("SKILL.md");
  assert.match(skill, /ASIDE-INLINE-01/);
  assert.match(skill, /\]\(reference\/aside-inline-visual\.md\)/);
  assert.match(skill, /`visual` code block/);
});

test("current-delivery docs no longer deny an Aside inline renderer", () => {
  for (const p of ["SKILL.md", "reference/environment-detection.md", "README.md"]) {
    const text = read(p);
    assert.doesNotMatch(text, /not inline HTML\s+fragments/, p);
    assert.doesNotMatch(text, /does not provide the codex host's inline/, p);
    assert.doesNotMatch(text, /no inline fragment renderer/, p);
  }
});

test("promotion fallback tokens define every theme variable the inline guide relies on", () => {
  const guide = read("reference/aside-inline-visual.md");
  const block = guide.match(/```html\n\s*(<style>[\s\S]*?<\/style>)\n\s*```/);
  assert.ok(block, "fallback token block present");
  const css = block[1];
  for (const name of ["--input", "--ring", "--secondary", "--secondary-foreground", "--accent", "--accent-foreground", "--popover", "--popover-foreground", "--background", "--foreground", "--muted-foreground", "--muted", "--surface-primary", "--border", "--brand", "--success", "--destructive", "--radius", "--font-sans", "--font-mono", ...[1, 2, 3, 4, 5, 6].map((n) => `--chart-${n}`)]) {
    assert.match(css, new RegExp(`${name}:`), name);
  }
  assert.match(css, /prefers-color-scheme:dark/);
});

test("sync-check reports unavailable and drift without network", () => {
  const dir = mkdtempSync(join(tmpdir(), "aside-viz-sync-"));
  try {
    const none = spawnSync(process.execPath, [syncCheck], { env: { ...process.env, ASIDE_VISUALIZE_SKILL: "", ASIDE_HOME: join(dir, "missing") }, encoding: "utf8" });
    assert.equal(none.status, 1, none.stdout + none.stderr);
    assert.match(none.stdout, /unavailable/);

    const installed = join(dir, "u", "0", "skills", "builtin", "visualize");
    mkdirSync(installed, { recursive: true });
    writeFileSync(join(installed, "SKILL.md"), "different host skill\n");
    const fallback = spawnSync(process.execPath, [syncCheck], { env: { ...process.env, ASIDE_VISUALIZE_SKILL: "", ASIDE_HOME: dir }, encoding: "utf8" });
    assert.equal(fallback.status, 2, fallback.stdout + fallback.stderr);
    assert.match(fallback.stdout, /DRIFT/);

    const drifted = join(dir, "SKILL.md");
    writeFileSync(drifted, "different host skill\n");
    const drift = spawnSync(process.execPath, [syncCheck], { env: { ...process.env, ASIDE_VISUALIZE_SKILL: drifted }, encoding: "utf8" });
    assert.equal(drift.status, 2, drift.stdout + drift.stderr);
    assert.match(drift.stdout, /DRIFT/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
