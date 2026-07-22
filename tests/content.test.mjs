import assert from "node:assert/strict";
import test from "node:test";
import { letter32 } from "../src/content/letter32.js";
import { copy } from "../src/i18n/copy.js";

test("English and French interface copy expose the same keys", () => {
  assert.deepEqual(Object.keys(copy.en).sort(), Object.keys(copy.fr).sort());
  assert.deepEqual(Object.keys(copy.en.nav).sort(), Object.keys(copy.fr.nav).sort());
});

test("every margin note points to text present in its translation", () => {
  for (const locale of ["en", "fr"]) {
    const fullText = letter32[locale].text.join(" ");
    for (const note of letter32[locale].notes) {
      assert.ok(fullText.includes(note.phrase), `${locale} is missing: ${note.phrase}`);
      assert.ok(note.latin.length > 0);
      assert.ok(note.definition.length > 0);
    }
  }
});

test("margin note identifiers stay aligned across languages", () => {
  assert.deepEqual(
    letter32.en.notes.map(({ id }) => id),
    letter32.fr.notes.map(({ id }) => id),
  );
});
