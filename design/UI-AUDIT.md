# Clinic control audit

Checked against the controls that exist in this app. Brand stays cobalt `#254ccf` and mint. Tokens stay in `src/app/globals.css`. Contrast is WCAG 2.2 relative luminance. A text pair needs 4.5:1. A control boundary needs 3:1 when the boundary is what identifies the control.

`--line` (`#e5dfd4`) on `--surface` (`#fffdf9`) is 1.31:1. `--control-line` (`#cfc6b8`) on the same surface is 1.66:1. Neither existing border token clears 3:1, so interactive borders use a new token, `--boundary` (`#8d8376`): 3.66:1 on the card, 3.39:1 on the page, 3.25:1 on the soft fill.

## Diagnosis

| # | Element | Result |
| --- | --- | --- |
| 1 | Primary button | Meets the bar. No commit. |
| 2 | Secondary and ghost button | Border and missing hover/press. Commit `e7cf17a`. |
| 3 | Destructive button and confirm | Long dialog could leave the screen. Commit `85a4ec1`. |
| 4 | Text input | Border, hover, and disabled. Commit `133b57a`. |
| 5 | Password input | Not in the app. |
| 6 | Search input | Meets the bar. Clear control is covered by the ghost commit. |
| 7 | Select / combobox | Not in the app. Choice chips are the picker. |
| 8 | Checkbox and radio | Not in the app. Choice chips are the picker. Commit `40f87e0`. |
| 9 | Toggle switch | Hit target was 32px. Commit `a167af2`. |
| 10 | Textarea | Shares `.clinic-control`. Fixed with the text input. No character limit exists. |
| 11 | File upload | Not in the app. |
| 12 | Inline validation and error summary | Not added. Save stays disabled until the required fields are filled. |
| 13 | Toast | Stayed on screen. Commit `6af08c6`. |
| 14 | Modal dialog | Same confirm dialog as item 3. Focus trap, Escape, and return focus were already in place. |
| 15 | Slide-over drawer | The add sheet is the drawer. It already traps focus, closes on Escape, locks scroll, and returns focus. |
| 16 | Top nav bar | The brand header. Commit `510b8c2`. |
| 17 | Sidebar and bottom nav | Missing hover and press. Commit `3b40beb`. |
| 18 | Breadcrumbs | Not in the app. Back is a 44px icon button. |
| 19 | Avatar and account menu | Not in the app. |
| 20 | Data table | Not in the app. Patients are a list, not a table. |
| 21 | Card / list item | Action tiles had no press. Commit `6245447`. |
| 22 | Stat tile | Meets the bar. |
| 23 | Empty state | Meets the bar. |
| 24 | Loading skeleton | Meets the bar. |
| 25 | Tabs | Missing hover. Commit `ad08674`. |
| 26 | Badge and status pill | Meets the bar. |
| 27 | Tooltip | Not in the app. |
| 28 | Date picker | Not in the app. Dates use the native date field, styled with the text input. |
| 29 | Footer | Not in the app. |

## Existing controls

### 1. Primary button

`PrimaryButton` and `.clinic-button--primary` in `src/components/ui.tsx` and `src/app/globals.css`. Used for the one strong action: save, new patient, add a visit.

States: default, hover (`--primary-deep`), focus-visible (shared 3px cobalt ring), active (`scale(0.98)`), disabled (soft fill, muted text). Minimum height 48px.

White on `#254ccf` is 6.97:1. Disabled muted `#4e5a6e` on `#f3efe7` is 6.08:1. No change.

### 2. Secondary and ghost button

`.clinic-button--secondary`, `.icon-button`, the search clear button, and `.notice-dismiss`.

Secondary text `#17359d` on the card is 10.17:1. The old border did not identify the button. Icon buttons had no hover or press. The clear button's press would have dropped its vertical centering.

Now the secondary and icon borders use `--boundary`. Icon buttons and the dismiss control have hover and press. The clear button's press keeps `translateY(-50%)`.

### 3. Destructive button and confirm step

`.clinic-button--danger` in `src/components/ConfirmDialog.tsx`. Cancel is focused. Escape, the backdrop, scroll lock, and return focus already come from the native dialog.

White on `#a22844` is 7.18:1. Hover and press were already there. The panel had no max height, so a long explanation could grow past the viewport. The panel now scrolls inside `calc(100dvh - 2rem)`.

### 4. Text input

`TextInput` / `.clinic-control`. Label sits above the field. Focus draws the cobalt ring.

The old border was 1.66:1. There was no hover and no disabled treatment. The border is now `--boundary`, hover moves to `--ink-soft`, and disabled uses the same soft fill and muted text as a disabled button (6.08:1).

### 6. Search input

`src/components/PatientSearch.tsx`. It filters the patient list. It does not open a results menu. The field is a text input, so it picks up the border, hover, and disabled styles. The clear button is 44px and is covered by the ghost commit. An empty search already has its own empty state and a clear action.

### 8. Choice chips

`.clinic-chip` and `.sort-chip`. These pick one visit type, one patient type, one reason, or one sort. They are buttons with `aria-pressed`, not checkboxes or radios.

They were 44px tall and had an active state, but the resting border was `--line` and there was no hover. Resting and hover borders now meet 3:1, and an unselected chip highlights on hover.

### 9. Toggle switch

`.risk-switch` on the new-patient form and `.risk-row` on edit. High-risk stays rose, and the edit row already says on or off in text.

The switch track was 32px tall. It is now 44px (`2.75rem`) by `4.5rem`, with the knob traveling `1.75rem`. The off track uses `--boundary` so the track is visible (3.66:1). The edit row border matches, and the row has hover and press. The new-patient switch has an accessible name.

### 10. Textarea

`TextArea` uses `.clinic-control`, so the border, hover, focus, and disabled styles from the text input apply. There is no maximum length in the product, so no character count was added.

### 13. Toast

`SavedToast` in `src/components/ui.tsx`. One toast, ink background, white text (14.81:1). It used to stay up because `saved` never turned off. It now hides after 5 seconds and leaves the form's saved state alone. `src/components/ui.tsx` is a client module so the timer can run. The dismiss control on the update bar already passed at 9.96:1.

### 14. Modal

The confirm dialog is the modal. Item 3 is the only change. Focus returns to the control that opened it.

### 15. Add sheet

The bottom dialog in `src/components/BottomNav.tsx`. It already has a labelled title, Escape, backdrop close, scroll lock, a 44px close button, and focus return. Reduced motion already collapses the entrance. No commit.

### 16. Brand header

`.clinic-brand-link`. 44px target. The small line uses muted text at 6.35:1 on the page. It had no hover or press. Hover now uses `--primary-deep` and press scales to 0.98.

### 17. Sidebar and bottom nav

`.clinic-nav`. Bottom dock below 900px, sidebar from 900px. Current item is cobalt. Inactive text is 6.86:1 on the card. Items are at least 48px. Hover and press were missing on the items that are not current. They now use the soft fill, and press scales to 0.98. The current and open items keep their existing treatment.

### 21. Card and list item

`.patient-row` already had hover and press. `.action-tile` had hover only. Press now scales the tile to 0.98. Names on the card are 14.58:1.

### 22. Stat tile

`.schedule-counts` on Today. The overdue number is `--warn-ink` on mint, 6.88:1. The day count is `--primary-deep` on mint, 9.26:1. Labels are text, not color alone. No commit.

### 23. Empty state

`EmptyState`. Today and the patient list with no records use one primary action. A search with no matches uses one secondary action, clear search. No commit.

### 24. Loading skeleton

`ListSkeleton`. Three row shapes, `role="status"`, and the pulse is removed by `prefers-reduced-motion`. No commit.

### 25. Tabs

`.profile-tabs` on the patient page. Two buttons with `aria-pressed` and a thumb that moves with `transform` for 180ms. This stays a switch, not an ARIA tablist. The unselected tab had no hover. Hover now uses `--ink`. Reduced motion still removes the slide.

### 26. Badge and status pill

`.patient-tag` and `.profile-flag-list`. Not interactive. High-risk rose on its soft fill is 6.21:1. Overdue amber is 6.88:1. A visit due today, teal on mint, is 4.62:1. That clears 4.5, so the color stays. No commit.

## Left alone

- Password field, select, native checkbox, native radio, file upload, character counter, error summary, search results menu, custom date picker, data table, breadcrumbs, avatar menu, tooltip, and footer. They are not in this app.
- What a delete removes, the four destinations, and the saved records.
- The profile switch was not rebuilt as a tab widget.
- The patient list was not rebuilt as a table.
- No second validation path. A required name and phone still disable the next step until they are filled.
