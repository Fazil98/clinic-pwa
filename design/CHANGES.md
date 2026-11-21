# Control changes

Cobalt `#254ccf` and mint are unchanged. One new token was added because neither existing border token reaches the 3:1 boundary required for a control.

## Token added

`--boundary: #8d8376` in `src/app/globals.css`.

| Pair | Ratio |
| --- | --- |
| `--line` `#e5dfd4` on `--surface` `#fffdf9` | 1.31:1 |
| `--control-line` `#cfc6b8` on `--surface` | 1.66:1 |
| `--boundary` `#8d8376` on `--surface` | 3.66:1 |
| `--boundary` on the page `#f7f4ee` | 3.39:1 |
| `--boundary` on `--surface-soft` `#f3efe7` | 3.25:1 |

`--line` and `--control-line` still mark quiet card edges and the sheet handle. Interactive borders use `--boundary`.

## Commits

### Secondary and ghost button (`e7cf17a`)

Before: secondary, icon, and the search clear control used a border that disappeared into the card. Icon buttons and the update-bar dismiss control had no hover or press. Pressing clear search jumped the mark off center.

After: those borders use `--boundary`. Icon buttons, the dismiss control, and clear search have hover and a 0.98 press. Clear search keeps its vertical centering.

### Destructive button and its confirm step (`85a4ec1`)

Before: the confirm panel could grow past the viewport. The danger button, the focused Cancel, Escape, and focus return were already in place. White on `#a22844` is 7.18:1.

After: the panel scrolls inside `calc(100dvh - 2rem)`.

### Text input (`133b57a`)

Before: the field border was 1.66:1, with no hover and no disabled style.

After: the border is `--boundary`, hover darkens to `--ink-soft`, and a disabled field uses the soft fill and muted text (6.08:1).

### Choice chips (`40f87e0`)

Before: chips and sort chips were 44px and showed the selected state, with no hover and the faint border.

After: the resting border is `--boundary`. An unselected chip uses the soft cobalt fill on hover.

### Toggle switch (`a167af2`)

Before: the high-risk switch was 32px tall and its off track used `--line` (1.31:1). The edit row had no hover.

After: the switch is 44px tall. The off track uses `--boundary`. The edit row border matches, and the row has hover and press. The knob still travels toward the end of the track in Arabic layout.

### Toast notifications (`6af08c6`)

Before: "تم الحفظ" stayed on screen for the rest of the visit.

After: the toast hides after 5 seconds. The form still remembers that it was saved. `src/components/ui.tsx` is now a client module so the timer can run.

### Brand header (`510b8c2`)

Before: the clinic name was a 44px link with no hover or press.

After: hover uses `--primary-deep` and press scales to 0.98.

### Sidebar and bottom nav (`3b40beb`)

Before: only the current item changed color. The other items had no hover or press.

After: an item that is not current uses the soft fill on hover, and press scales to 0.98. The current item stays cobalt.

### Card and list item (`6245447`)

Before: patient rows had hover and press. The action tiles only changed their border on hover.

After: an action tile scales to 0.98 on press.

### Tabs (`ad08674`)

Before: the unselected سجل / الملف tab had no hover.

After: hover uses `--ink`. The thumb still moves with `transform` for 180ms, and reduced motion still removes that slide.

## Checked and left as they were

- Primary button. White on cobalt is 6.97:1. Disabled text is 6.08:1. Hover, focus, press, and the 48px height were already there.
- Search field. It uses the text input. The clear button is the ghost control above. No results menu was added.
- Textarea. It uses the same field styles. No character limit exists, so no counter was added.
- Add sheet. Focus trap, Escape, scroll lock, and focus return were already there.
- Stat tile. Overdue on mint is 6.88:1. The day count on mint is 9.26:1.
- Empty state. One action, already.
- Loading skeleton. The pulse already stops under reduced motion.
- Status pills. Rose 6.21:1, amber 6.88:1, today-mint 4.62:1. Today-mint clears 4.5, so it was not darkened.

## Left alone because they are not in the app

Password field, select, native checkbox, native radio, file upload, error summary, search results menu, custom date picker, data table, breadcrumbs, avatar menu, tooltip, and footer.
