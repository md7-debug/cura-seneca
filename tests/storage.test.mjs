import assert from "node:assert/strict";
import test from "node:test";
import {
  STORAGE_KEYS,
  clearReply,
  loadLocale,
  loadReply,
  loadTheme,
  saveLocale,
  saveReply,
  saveTheme,
} from "../src/lib/storage.js";

function memoryStorage() {
  const data = new Map();
  return {
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => data.set(key, String(value)),
    removeItem: (key) => data.delete(key),
  };
}

test("locale defaults to English and accepts French", () => {
  const storage = memoryStorage();
  assert.equal(loadLocale(storage), "en");
  saveLocale("fr", storage);
  assert.equal(loadLocale(storage), "fr");
});

test("a reply round-trips through versioned local storage", () => {
  const storage = memoryStorage();
  saveReply("Cher Sénèque…", "2026-07-22T12:00:00.000Z", storage);
  assert.deepEqual(loadReply(storage), {
    text: "Cher Sénèque…",
    savedAt: "2026-07-22T12:00:00.000Z",
  });
  clearReply(storage);
  assert.deepEqual(loadReply(storage), { text: "", savedAt: "" });
});

test("malformed stored data fails closed", () => {
  const storage = memoryStorage();
  storage.setItem(STORAGE_KEYS.reply, "not-json");
  assert.deepEqual(loadReply(storage), { text: "", savedAt: "" });
});

test("theme persists and rejects unknown values", () => {
  const storage = memoryStorage();
  assert.equal(loadTheme(storage), "light");
  saveTheme("dark", storage);
  assert.equal(loadTheme(storage), "dark");
  storage.setItem(STORAGE_KEYS.theme, "sepia");
  assert.equal(loadTheme(storage), "light");
});
