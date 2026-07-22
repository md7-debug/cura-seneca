# Design QA

final result: passed

## Source and capture

- Selected concept: [`docs/qa/selected-concept.png`](docs/qa/selected-concept.png)
- Final implementation capture: [`docs/qa/implementation.png`](docs/qa/implementation.png)
- Screenshot method: Codex in-app browser, direct local Vite preview capture.
- Comparison viewport: 1440 × 1024 browser override. The browser reported a 1532 × 1089 CSS viewport because of the desktop display scale.
- Additional checks: 390 × 844 mobile override, light and dark themes, English and French.

## Visual comparison

1. **Header:** the implementation preserves the thin full-width rule, left wordmark, compact navigation, centered edition line, and language controls.
2. **Space:** both screens leave most of the upper canvas quiet and begin the letter well below the header.
3. **Composition:** the narrow letter column, long vertical vermilion rule, and lower interpretation column retain the source’s asymmetric balance.
4. **Type:** a literary serif carries the reading text; a restrained sans serif handles orientation. The user-requested calligraphy now carries “The practice of return.”
5. **Material:** the warm paper texture, near-black ink, fine hairlines, and single vermilion accent match the selected direction. No cards, shadows, gradients, or decorative motifs were added.

## Copy differences

- `VALE` became `CURA` to express *cura sui*, the care of the self.
- `The Threshold` became `The practice of return`, then received the requested calligraphic treatment.
- The generated concept’s sample quotation was replaced with a fresh translation from the public-domain Latin text of Letter 32.
- Interpretation copy now explains the actual letter and `Opto tibi tui facultatem`.
- `Continue the letter` became `Read in focus` and opens the full, distraction-free letter.

## Intentional deviations

- Theme and language controls take slightly more header width than the concept.
- The accurate excerpt runs longer than the generated placeholder copy.
- Focused reading and contextual margin notes extend the concept beyond its static first screen while preserving its visual rules.
- Mobile stacks the letter and interpretation to protect reading width.

## Verified path

`Today → Read in focus → select an underlined saying → read and close the margin note → finish and reflect → write a reply → view Your letters`

Also verified: English/French switching, light/dark persistence, local autosave, deletion, responsive layout, keyboard-visible focus, and zero browser console warnings or errors.
