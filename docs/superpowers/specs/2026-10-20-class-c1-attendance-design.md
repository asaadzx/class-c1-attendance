# Class C1 Attendance Page — Design Spec

Date: 2026-10-20
Status: Approved by user (design verbally approved, "make it fast")

## Goal

A static, bilingual (Arabic/English) attendance checklist web page for Class C1
(Egypt-Japan KOSEN Institute), deployable on GitHub Pages. The teacher checks
who attended; absentees are highlighted. Exports: one Excel, one PNG image,
one PDF.

## Source Data

- `Class_C1_Students_List.xlsx`, sheet **Official Class Roster** — source of truth.
- 34 students (#1–34), each with English and Arabic name.
  (The sheet title says "35 Students" but only 34 data rows exist; use the 34 rows.)
- The second sheet ("Handwritten Attendance Cross-Re") is ignored — its
  numbering/names conflict with the roster.
- Students are embedded at build time into `students.js` as
  `[{ id, en, ar }, ...]`. No runtime file upload.

## Outputs (all named with today's date)

Base name: `YYYY-MM-DD-c1Class-attendence` (e.g. `2026-10-20-c1Class-attendence`).

1. **Excel** `2026-10-20-c1Class-attendence.xlsx`
   - One sheet. Header: institute/class, date, attended count, absent count.
   - Section "Attended / الحضور": bilingual names of present students, normal style.
   - Section "Absent / الغياب": own section, each name cell with **yellow fill,
     large bold font**.
   - Generated fully client-side with bundled `xlsx-js-style` (lib/xlsx.bundle.js).
2. **PNG** `2026-10-20-c1Class-attendence.png`
   - Canvas-rendered: bilingual header, "Absent / الغياب" title, absent names in
     **big font on yellow highlighted rows**. If nobody is absent, shows an
     all-present message.
   - Downloaded via canvas.toDataURL.
3. **PDF** `2026-10-20-c1Class-attendence.pdf`
   - Same design as the PNG, via browser print dialog (print stylesheet).
   - `document.title` temporarily set to the base name so the save dialog
     defaults to the right filename; restored after printing.

## Page Behavior

- Checklist: one row per student, `☑ English Name | الاسم العربي`, number shown.
- Default state: **all checked**; teacher unchecks absentees.
- Language toggle EN / عربي: switches UI labels and direction (RTL for Arabic).
  Student names always show both languages.
- State persisted in localStorage keyed by date; a new day starts fresh
  (all checked). Reset button clears the current day.
- Buttons: Export Excel, Download PNG, Print PDF, Reset, (uncheck/check all).
- Clean single-page layout, no build step, no runtime CDN dependencies
  (all libs bundled in the repo).

## Errors

- Zero absent: Excel/PNG/PDF still generate (absent section shows
  "None — everyone attended / لا يوجد غياب").
- Zero present: absent section lists everyone (same styling).

## Testing

- `node --check` on all JS files.
- Node script runs the Excel export logic against the bundled lib; Python
  (openpyxl) verifies the generated workbook: sheet contents, yellow fills,
  font sizes on the absent section.
- PNG/PDF verified in a browser if one is available; otherwise reviewed by
  code inspection and DOM-level checks.

## Deployment

- Git repo initialized in the project folder; README documents 3-step
  GitHub Pages deployment (push to repo → Settings → Pages → main/root).
- Pushing happens only with explicit user action/confirmation.
