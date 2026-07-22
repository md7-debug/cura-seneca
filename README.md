# Cura

**Read Seneca. Consider one idea. Write back. Return to yourself.**

Cura is a bilingual, private-by-default reading practice for Seneca’s *Letters to Lucilius*. The name evokes *cura sui*, or care of the self. Like tending an inner garden or polishing one facet of a stone, the practice stays small and rewards attention.

The first edition includes Letter 32 in English and French, focused reading, contextual margin notes, concise interpretation, one writing invitation, local autosave, Markdown export, light and dark modes, and a restrained responsive interface.

## Principles

- Reading before explanation
- Interpretation without simplification
- Writing without performance
- Privacy without an account
- Progress as patient return, not measurement
- English and French as equal first languages, with a small extension path

See the short [`DESIGN_CONTRACT.md`](DESIGN_CONTRACT.md) for the product boundaries.

## Run locally

Requires Node.js 20 or newer.

```bash
npm install
npm run dev
```

Production validation:

```bash
npm run build
npm test
```

## Project structure

```text
src/
  content/       Seneca translations and interpretations
  i18n/          Interface language strings
  lib/           Local persistence
  App.jsx        Reading, library, and writing flows
  styles.css     Visual system and responsive layout
public/assets/   Locally served visual assets
tests/           Storage and static-hosting tests
```

## Content status

Letter 32 is the complete seed edition. Cura does not bundle the complete Loeb/Gummere English translation because its copyright status varies by country. The app instead contains a new translation from Seneca’s public-domain Latin and links to historical sources for further reading.

More letters should be added only with source, authorship, and reuse rights made explicit. See [`CONTRIBUTING.md`](CONTRIBUTING.md).

## Privacy and accessibility

Journal text stays in browser storage; there is no account, analytics, cookie banner, or server-side journal. Read [`PRIVACY.md`](PRIVACY.md) and [`ACCESSIBILITY.md`](ACCESSIBILITY.md).

## Licenses

- Code: [MIT](LICENSE)
- Original translations, interpretation, copy, documentation, and texture: [CC BY 4.0](CONTENT-LICENSE.md)
- Third-party acknowledgements: [`ATTRIBUTIONS.md`](ATTRIBUTIONS.md)

“Cura” is a project name, not legal, medical, or mental-health advice.
