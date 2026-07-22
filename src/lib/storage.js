export const STORAGE_KEYS = {
  locale: "cura.locale",
  reply: "cura.reply.32.v1",
  theme: "cura.theme",
};

export function loadLocale(storage = globalThis.localStorage) {
  try {
    const locale = storage?.getItem(STORAGE_KEYS.locale);
    return locale === "fr" ? "fr" : "en";
  } catch {
    return "en";
  }
}

export function saveLocale(locale, storage = globalThis.localStorage) {
  try {
    storage?.setItem(STORAGE_KEYS.locale, locale);
  } catch {
    // The app remains usable when private browsing blocks storage.
  }
}

export function loadReply(storage = globalThis.localStorage) {
  try {
    const saved = JSON.parse(storage?.getItem(STORAGE_KEYS.reply) ?? "null");
    if (saved?.version === 1 && typeof saved.text === "string") {
      return { text: saved.text, savedAt: saved.savedAt ?? "" };
    }
  } catch {
    // Ignore malformed or unavailable browser storage.
  }
  return { text: "", savedAt: "" };
}

export function saveReply(text, savedAt, storage = globalThis.localStorage) {
  try {
    storage?.setItem(
      STORAGE_KEYS.reply,
      JSON.stringify({ version: 1, letter: 32, text, savedAt }),
    );
  } catch {
    // The current writing session remains available in memory.
  }
}

export function clearReply(storage = globalThis.localStorage) {
  try {
    storage?.removeItem(STORAGE_KEYS.reply);
  } catch {
    // Nothing else to clear.
  }
}

export function loadTheme(storage = globalThis.localStorage) {
  try {
    return storage?.getItem(STORAGE_KEYS.theme) === "dark" ? "dark" : "light";
  } catch {
    return "light";
  }
}

export function saveTheme(theme, storage = globalThis.localStorage) {
  try {
    storage?.setItem(STORAGE_KEYS.theme, theme);
  } catch {
    // The selected theme still applies for the current session.
  }
}
