# Class C1 Attendance | حضور وغياب فصل C1

Bilingual (English/Arabic) attendance checklist for Class C1 —
Egypt-Japan KOSEN Institute. Pure static HTML + JS, ready for GitHub Pages.

## Features

- Checklist of all 34 students (English + Arabic names), all checked by default
  — just uncheck the absentees
- Absent names highlighted in yellow, big bold font
- Language toggle EN / عربي (RTL)
- State saved per day in `localStorage` (fresh start each new day)
- Exports, all date-named (e.g. `2026-10-20-c1Class-attendence`):
  - **Excel** `.xlsx` — one sheet, "Attended" section + separate "Absent" section
    (yellow fill, large bold font)
  - **Image** `.png` — absent names only, big font, yellow highlighted
  - **PDF** — same design via Print / PDF (filename defaults to the date name)

## Files

| File             | Purpose                                        |
| ---------------- | ---------------------------------------------- |
| `index.html`     | The page                                       |
| `style.css`      | Styling + print (PDF) layout                   |
| `app.js`         | Checklist logic, Excel/PNG/PDF exports         |
| `students.js`    | Student list (generated from the class roster) |
| `lib/xlsx.bundle.js` | Bundled `xlsx-js-style` (offline, no CDN)  |

## Use

Open `index.html` in any browser (double-click works — no server needed),
or deploy to GitHub Pages:

1. Push this folder to a new GitHub repository
2. Repo → **Settings → Pages → Source: Deploy from a branch**
3. Branch: `main`, folder: `/ (root)` → Save

Your page will be at `https://<username>.github.io/<repo>/`

## Updating the student list

Edit `students.js` (array of `{ id, en, ar }`), or regenerate from
`Class_C1_Students_List.xlsx` — sheet **Official Class Roster**.
