import { test } from "node:test";
import assert from "node:assert/strict";
import { formatBacklink } from "./backlink.ts";

const FULL = "/Archive/Periodic Notes/2026/Dailies/2026-06-22 (Mon).md > Work";
const FULL_NO_HEADING = "/Archive/Periodic Notes/2026/Dailies/2026-06-22 (Mon).md";
const BARE = "2026-07-03 (Fri) > Work Tasks";
const BARE_NO_HEADING = "2026-07-03 (Fri)";

// --- Filename only (default, preserves pre-TBS-007 behaviour) ---
test("filename: full path with heading -> basename", () => {
	assert.equal(formatBacklink(FULL, "filename", ""), "2026-06-22 (Mon)");
});
test("filename: full path without heading -> basename", () => {
	assert.equal(formatBacklink(FULL_NO_HEADING, "filename", ""), "2026-06-22 (Mon)");
});
test("filename: already-bare name with heading -> name", () => {
	assert.equal(formatBacklink(BARE, "filename", ""), "2026-07-03 (Fri)");
});

// --- Filename + header ---
test("filename-header: keeps filename and heading, drops path and .md", () => {
	assert.equal(formatBacklink(FULL, "filename-header", ""), "2026-06-22 (Mon) > Work");
});
test("filename-header: no heading -> filename only", () => {
	assert.equal(formatBacklink(FULL_NO_HEADING, "filename-header", ""), "2026-06-22 (Mon)");
});

// --- Header only (falls back to filename when there's no heading) ---
test("header: heading only", () => {
	assert.equal(formatBacklink(FULL, "header", ""), "Work");
});
test("header: falls back to filename when no heading", () => {
	assert.equal(formatBacklink(FULL_NO_HEADING, "header", ""), "2026-06-22 (Mon)");
});
test("header: bare name with heading -> heading", () => {
	assert.equal(formatBacklink(BARE, "header", ""), "Work Tasks");
});

// --- Custom text (replaces everything, unconditionally) ---
test("custom: replaces a normal backlink with the custom string", () => {
	assert.equal(formatBacklink(FULL, "custom", "source"), "source");
});
test("custom: replaces even the Tasks short-mode emoji", () => {
	assert.equal(formatBacklink(" 🔗", "custom", "source"), "source");
});

// --- Edge cases carried over from the original suite ---
test("empty string returns null in every mode", () => {
	assert.equal(formatBacklink("", "filename", ""), null);
	assert.equal(formatBacklink("", "header", ""), null);
	assert.equal(formatBacklink("", "filename-header", ""), null);
	assert.equal(formatBacklink("", "custom", "source"), null);
});
test("Tasks short mode (link emoji) is left untouched in filename mode", () => {
	assert.equal(formatBacklink(" 🔗", "filename", ""), " 🔗");
});
test("known limitation: a filename containing \" > \" gets misread as path/heading", () => {
	// Documented in the README as a known limitation, not something we try to fix:
	// there's no way to tell "note named 'A > B'" apart from "note A, heading B"
	// using only the rendered text.
	assert.equal(formatBacklink("A > B", "filename", ""), "A");
	assert.equal(formatBacklink("A > B", "header", ""), "B");
});
