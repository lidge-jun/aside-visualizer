#!/usr/bin/env node
// Compare installed Aside built-in visualize/SKILL.md copies with the inspection record.
// Exit 0: every copy found matches. 2: at least one copy differs. 1: record invalid or nothing found.
import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const record = readFileSync(join(here, "aside-visualize-upstream.md"), "utf8");
const field = (name) => record.match(new RegExp("^- " + name + ": `([^`]+)`", "m"))?.[1];
const storedHash = field("Current SHA-256");
const inspected = field("Last inspected");
if (!/^[0-9a-f]{64}$/.test(storedHash ?? "")) {
  console.error("unable to check: stored SHA-256 is missing or invalid");
  process.exit(1);
}

function candidates() {
  if (process.env.ASIDE_VISUALIZE_SKILL) return [process.env.ASIDE_VISUALIZE_SKILL];
  const root = process.env.ASIDE_HOME ?? join(homedir(), ".aside");
  const users = join(root, "u");
  if (!existsSync(users)) return [];
  return readdirSync(users)
    .map((slot) => join(users, slot, "skills", "builtin", "visualize", "SKILL.md"))
    .filter((p) => existsSync(p) && statSync(p).isFile());
}

const found = candidates().filter((p) => existsSync(p));
if (found.length === 0) {
  console.log("unavailable: no installed Aside visualize/SKILL.md found (set ASIDE_VISUALIZE_SKILL or ASIDE_HOME)");
  process.exit(1);
}
let drift = false;
for (const p of found) {
  const hash = createHash("sha256").update(readFileSync(p)).digest("hex");
  const same = hash === storedHash;
  drift ||= !same;
  console.log(`${same ? "match" : "DRIFT"} ${hash} ${p}`);
}
console.log(`record ${storedHash} inspected ${inspected ?? "unknown"}`);
if (drift) console.log("re-read the live skill, update reference/aside-inline-visual.md if the contract changed, then this record");
process.exit(drift ? 2 : 0);
