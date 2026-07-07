import { test } from "node:test";
import assert from "node:assert/strict";
import { toBasename } from "./backlink.ts";

test("full path with heading", () => {
	assert.equal(
		toBasename("/Archive/Periodic Notes/2026/Dailies/2026-06-22 (Mon).md > Work"),
		"2026-06-22 (Mon)",
	);
});

test("full path without heading", () => {
	assert.equal(toBasename("/Archive/Periodic Notes/2026/Dailies/2026-06-22 (Mon).md"), "2026-06-22 (Mon)");
});

test("already-unique filename with heading", () => {
	assert.equal(toBasename("2026-07-03 (Fri) > Work Tasks"), "2026-07-03 (Fri)");
});

test("already-unique filename without heading", () => {
	assert.equal(toBasename("2026-07-03 (Fri)"), "2026-07-03 (Fri)");
});

test("empty string returns null", () => {
	assert.equal(toBasename(""), null);
});

test("Tasks short mode (link emoji) is left untouched", () => {
	assert.equal(toBasename(" 🔗"), " 🔗");
});

test("known limitation: a filename containing \" > \" gets misread as path/heading", () => {
	// Documented in the README as a known limitation, not something we try to fix:
	// there's no way to tell "note named 'A > B'" apart from "note A, heading B"
	// using only the rendered text.
	assert.equal(toBasename("A > B"), "A");
});
