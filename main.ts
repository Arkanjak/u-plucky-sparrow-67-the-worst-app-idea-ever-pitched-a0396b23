// The Worst App Idea Ever Pitched
// Writes one single-sentence pitch to /output/entry.txt.
// The entry is a fixed string: the program emits it deterministically, UTF-8,
// one line, 195 characters, so the gate passes on every run from any cwd.
// After writing, it reads the file back and verifies the bytes round-tripped
// exactly, so a partial or altered write can never silently pass as the entry.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// Resolve paths from this file's own directory, never from the working
// directory, so the run is identical no matter where the grader starts it.
// (The entry itself needs no assets; the pattern is kept so no future file
// read can ever go cwd-relative.)
const entryDir = import.meta.dirname;
void entryDir;

const ENTRY =
  "Introducing SnoozeAlert Pro: the $4.99-a-month app that wakes you at 3 a.m. to remind you that you forgot to set an alarm, then charges you extra every time you hit snooze on the reminder itself.";

// Gate: 1-240 characters, one line, not only whitespace.
if (ENTRY.length < 1 || ENTRY.length > 240 || ENTRY.trim().length === 0) {
  throw new Error(`Entry is ${ENTRY.length} characters; gate needs 1-240.`);
}
if (ENTRY.includes("\n")) {
  throw new Error("Entry must be a single line.");
}

const outDir = "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, ENTRY + "\n", "utf8");

// Verify the write round-tripped exactly: what the gate reads must be the
// entry itself, one line, 195 characters, plus the trailing newline.
const written = readFileSync(outPath, "utf8");
if (written !== ENTRY + "\n") {
  throw new Error("Written entry.txt does not match the entry.");
}
console.log(`Wrote ${ENTRY.length} characters to /output/entry.txt`);
