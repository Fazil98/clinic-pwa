# العيادة (Clinic PWA)

تطبيق Next.js بسيط لعيادة نساء وتوليد — بالكامل بالعربية (RTL) وخط **Cairo**.

Simple Arabic RTL demo: patients, visits, notes, Today follow-ups.

## Phase 1 (now)

- Next.js + TypeScript + Tailwind
- Mock patients/notes saved in the browser (`localStorage`)
- Screens: Today, Patients, Add, Patient detail, New patient wizard, Visit, Quick note, More

## Phase 2 (later)

- Supabase auth + database + real sync
- Then she can use it for real clinic work

## Docs

- `docs/RESEARCH.md` — PWA / iOS research
- `docs/UI-SPEC.md` — screens & fields

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy

Push this folder to GitHub, then import the repo in Vercel (Framework: Next.js).

No env vars needed for the mock demo.
