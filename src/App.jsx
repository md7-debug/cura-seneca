import { useEffect, useRef, useState } from "react";
import { letter32 } from "./content/letter32.js";
import { copy } from "./i18n/copy.js";
import {
  clearReply,
  loadLocale,
  loadReply,
  loadTheme,
  saveLocale,
  saveReply,
  saveTheme,
} from "./lib/storage.js";

const sections = ["today", "letters", "yourLetters"];

function Header({ locale, onLocaleChange, onThemeToggle, section, onSectionChange, theme }) {
  const t = copy[locale];

  return (
    <header className="site-header">
      <button className="wordmark" onClick={() => onSectionChange("today")}>
        CURA
      </button>
      <nav aria-label={t.primaryNavigation}>
        {sections.map((item) => (
          <button
            aria-current={section === item ? "page" : undefined}
            className={section === item ? "active" : ""}
            key={item}
            onClick={() => onSectionChange(item)}
          >
            {t.nav[item]}
          </button>
        ))}
      </nav>
      <p className="edition-title">{t.edition}</p>
      <div className="header-controls">
        <button
          className="theme-toggle"
          onClick={onThemeToggle}
          aria-label={theme === "light" ? t.switchToDark : t.switchToLight}
        >
          {theme === "light" ? t.dark : t.light}
        </button>
        <div className="language-switcher" aria-label={t.languageLabel}>
          {[
            ["en", "EN"],
            ["fr", "FR"],
          ].map(([value, label]) => (
            <button
              aria-pressed={locale === value}
              className={locale === value ? "active" : ""}
              key={value}
              lang={value}
              onClick={() => onLocaleChange(value)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}

function Today({ locale, draft, onDraftChange, savedAt }) {
  const t = copy[locale];
  const content = letter32[locale];
  const composerRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const [activeNote, setActiveNote] = useState(null);

  function setReadingFocus(value) {
    setIsFocused(value);
    setActiveNote(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (isFocused) {
    return (
      <main id="main-content" className="focus-page">
        <article className="focused-reader" aria-labelledby="focused-letter-title">
          <div className="focus-header">
            <p className="eyebrow">{content.label}</p>
            <button onClick={() => setReadingFocus(false)}>{t.returnToReflection}</button>
          </div>
          <span className="short-rule" aria-hidden="true" />
          <h1 id="focused-letter-title">{content.title}</h1>
          <p className="glossary-hint">{t.glossaryHint}</p>
          <div className="focused-copy">
            {content.text.map((paragraph) => (
              <AnnotatedParagraph
                activeNote={activeNote}
                key={paragraph}
                notes={content.notes}
                onSelect={setActiveNote}
                text={paragraph}
              />
            ))}
          </div>
          <p className="source-note">
            {content.translationNote}{" "}
            <a href={letter32.sources.latin} target="_blank" rel="noreferrer">
              {t.readLatin}
            </a>
          </p>
          <button className="finish-reading" onClick={() => setReadingFocus(false)}>
            {t.finishReading}
          </button>
        </article>
        {activeNote ? (
          <aside className="margin-note" id="reader-note" aria-live="polite">
            <div className="margin-note-header">
              <p className="eyebrow">{t.marginNote}</p>
              <button onClick={() => setActiveNote(null)}>{t.close}</button>
            </div>
            <h2>{activeNote.label}</h2>
            <p className="note-latin" lang="la">{activeNote.latin}</p>
            <p>{activeNote.definition}</p>
            <p className="note-context">{activeNote.context}</p>
          </aside>
        ) : null}
      </main>
    );
  }

  return (
    <main id="main-content">
      <article className="reading-layout">
        <section className="letter" aria-labelledby="letter-title">
          <p className="eyebrow">{content.label}</p>
          <span className="short-rule" aria-hidden="true" />
          <h1 id="letter-title" className="sr-only">{content.title}</h1>
          <div className="letter-copy">
            <p>{content.preview}</p>
            <button className="letter-continuation" onClick={() => setReadingFocus(true)}>
              {t.continueLetter}
            </button>
          </div>
        </section>

        <section className="interpretation" aria-labelledby="interpretation-title">
          <span className="vertical-rule" aria-hidden="true" />
          <div className="interpretation-copy">
            <h2 id="interpretation-title" className="sr-only">
              {t.interpretation}
            </h2>
            <InterpretationBlock label={t.essentialIdea} text={content.essentialIdea} />
            <InterpretationBlock
              label={t.latinPhrase}
              text={<i lang="la">Opto tibi tui facultatem.</i>}
              detail={content.phraseMeaning}
            />
            <InterpretationBlock label={t.tension} text={content.tension} />
            <button
              className="write-invitation"
              onClick={() => composerRef.current?.scrollIntoView({ behavior: "smooth" })}
            >
              {t.whatWouldYouWrite}
            </button>
          </div>
        </section>
      </article>

      <section className="composer" ref={composerRef} aria-labelledby="composer-title">
        <div className="composer-intro">
          <p className="eyebrow">{t.writeBack}</p>
          <h2 id="composer-title">{content.prompt}</h2>
          <p>{t.promptSupport}</p>
        </div>
        <div className="writing-area">
          <label className="sr-only" htmlFor="reply">
            {t.yourReply}
          </label>
          <textarea
            id="reply"
            value={draft}
            onChange={(event) => onDraftChange(event.target.value)}
            placeholder={content.placeholder}
            spellCheck="true"
          />
          <div className="save-status" role="status">
            <span>{draft ? t.savedPrivately : t.staysHere}</span>
            {savedAt ? <time dateTime={savedAt}>{formatTime(savedAt, locale)}</time> : null}
          </div>
        </div>
      </section>
    </main>
  );
}

function InterpretationBlock({ label, text, detail }) {
  return (
    <div className="interpretation-block">
      <h3>{label}</h3>
      <p>{text}</p>
      {detail ? <p className="phrase-detail">{detail}</p> : null}
    </div>
  );
}

function Letters({ locale, onOpen }) {
  const t = copy[locale];
  const content = letter32[locale];

  return (
    <main id="main-content" className="index-page">
      <header className="page-intro">
        <p className="eyebrow">{t.nav.letters}</p>
        <h1>{t.libraryTitle}</h1>
        <p>{t.libraryIntro}</p>
      </header>
      <button className="letter-row" onClick={onOpen}>
        <span>032</span>
        <strong>{content.title}</strong>
        <small>{t.readingTime}</small>
      </button>
      <p className="collection-note">
        {t.collectionNote}{" "}
        <a href={letter32.sources.collection} target="_blank" rel="noreferrer">
          {t.sourceCollection}
        </a>
      </p>
    </main>
  );
}

function YourLetters({ locale, draft, savedAt, onOpen, onClear, onExport }) {
  const t = copy[locale];

  return (
    <main id="main-content" className="index-page">
      <header className="page-intro">
        <p className="eyebrow">{t.nav.yourLetters}</p>
        <h1>{t.yourLettersTitle}</h1>
        <p>{t.yourLettersIntro}</p>
      </header>
      {draft ? (
        <article className="saved-letter">
          <button onClick={onOpen}>
            <span>{letter32[locale].label}</span>
            <strong>{draft.slice(0, 120)}{draft.length > 120 ? "…" : ""}</strong>
            <time dateTime={savedAt}>{formatDate(savedAt, locale)}</time>
          </button>
          <div className="saved-actions">
            <button onClick={onExport}>{t.exportMarkdown}</button>
            <button className="quiet-danger" onClick={onClear}>{t.delete}</button>
          </div>
        </article>
      ) : (
        <p className="empty-state">{t.emptyLetters}</p>
      )}
    </main>
  );
}

export function App() {
  const [locale, setLocale] = useState(loadLocale);
  const [theme, setTheme] = useState(loadTheme);
  const [section, setSection] = useState("today");
  const [initialReply] = useState(loadReply);
  const [draft, setDraft] = useState(initialReply.text);
  const [savedAt, setSavedAt] = useState(initialReply.savedAt);

  useEffect(() => {
    document.documentElement.lang = locale;
    saveLocale(locale);
  }, [locale]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    saveTheme(theme);
  }, [theme]);

  useEffect(() => {
    if (!draft) {
      clearReply();
      setSavedAt("");
      return undefined;
    }
    const timeout = window.setTimeout(() => {
      const timestamp = new Date().toISOString();
      saveReply(draft, timestamp);
      setSavedAt(timestamp);
    }, 500);
    return () => window.clearTimeout(timeout);
  }, [draft]);

  function openToday() {
    setSection("today");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function changeSection(nextSection) {
    setSection(nextSection);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function deleteReply() {
    if (!window.confirm(copy[locale].confirmDelete)) return;
    clearReply();
    setDraft("");
    setSavedAt("");
  }

  function exportReply() {
    const body = `# ${letter32[locale].label}: ${letter32[locale].title}\n\n${draft}\n`;
    const url = URL.createObjectURL(new Blob([body], { type: "text/markdown;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "cura-letter-032.md";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <a className="skip-link" href="#main-content">{copy[locale].skip}</a>
      <Header
        locale={locale}
        onLocaleChange={setLocale}
        onThemeToggle={() => setTheme((current) => (current === "light" ? "dark" : "light"))}
        section={section}
        onSectionChange={changeSection}
        theme={theme}
      />
      {section === "today" ? (
        <Today
          locale={locale}
          draft={draft}
          onDraftChange={setDraft}
          savedAt={savedAt}
        />
      ) : null}
      {section === "letters" ? <Letters locale={locale} onOpen={openToday} /> : null}
      {section === "yourLetters" ? (
        <YourLetters
          locale={locale}
          draft={draft}
          savedAt={savedAt}
          onOpen={openToday}
          onClear={deleteReply}
          onExport={exportReply}
        />
      ) : null}
      <footer>
        <span>CURA</span>
        <p>{copy[locale].footer}</p>
        <a href="https://github.com/md7-debug/cura-seneca" target="_blank" rel="noreferrer">
          {copy[locale].openSource}
        </a>
      </footer>
    </>
  );
}

function AnnotatedParagraph({ activeNote, notes, onSelect, text }) {
  const matches = notes
    .map((note) => ({ note, index: text.indexOf(note.phrase) }))
    .filter(({ index }) => index >= 0)
    .sort((a, b) => a.index - b.index);

  if (!matches.length) return <p>{text}</p>;

  const parts = [];
  let cursor = 0;
  matches.forEach(({ note, index }) => {
    if (index > cursor) parts.push(text.slice(cursor, index));
    parts.push(
      <button
        aria-expanded={activeNote?.id === note.id}
        aria-controls={activeNote ? "reader-note" : undefined}
        className="annotated-term"
        key={note.id}
        onClick={() => onSelect(activeNote?.id === note.id ? null : note)}
      >
        {note.phrase}
      </button>,
    );
    cursor = index + note.phrase.length;
  });
  if (cursor < text.length) parts.push(text.slice(cursor));

  return <p>{parts}</p>;
}

function formatTime(value, locale) {
  return new Intl.DateTimeFormat(locale, { hour: "2-digit", minute: "2-digit" }).format(
    new Date(value),
  );
}

function formatDate(value, locale) {
  if (!value) return "";
  return new Intl.DateTimeFormat(locale, { dateStyle: "long" }).format(new Date(value));
}
