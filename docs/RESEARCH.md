# Clinic PWA Research Brief

**Project:** Women’s & pregnancy clinic app for patient records + follow-up  
**Audience:** Doctor who is not tech-comfortable (phone only, minimal digital habits)  
**Goal:** A Progressive Web App (PWA) that feels as close as possible to a native app — especially on iPhone — while staying extremely simple.  
**Status:** Research only. UI build waits for your design pictures.  
**Date:** 2026-11-10

---

## 1. What a PWA is (in plain words)

A PWA is a normal website that can:

1. Be **saved to the Home Screen** like an app icon  
2. Open **full screen** (no browser address bar)  
3. Work **offline or on weak internet** for key screens  
4. Send **notifications** (with limits, especially on iPhone)  
5. Feel fast because files are **cached** on the phone  

For your sister: she opens Safari/Chrome once → “Add to Home Screen” → then she only taps the icon. No App Store, no updates to install manually.

---

## 2. Why PWA for this clinic (vs native / Flutter / Capacitor)

| Option | Pros | Cons for this project |
|--------|------|------------------------|
| **PWA** | One codebase, no App Store, easy updates, works on phone + tablet + laptop | iOS still has some limits vs Android |
| **Native (Swift/Kotlin)** | Best Apple/Android feel | Expensive, two apps, App Store friction |
| **Flutter / React Native** | Near-native UI | Store approval, install friction for a non-tech user |
| **Capacitor (web wrapped as app)** | Can ship to stores later | Extra complexity; only needed if store listing is required |

**Recommendation for v1:** Pure PWA (Next.js or similar + service worker).  
**Later optional:** Wrap with Capacitor *only if* she needs App Store / Google Play icons for trust.

---

## 3. Deep dive: making a web app feel native (2025–2026)

### 3.1 Core PWA building blocks (must-have)

1. **Web App Manifest** (`manifest.webmanifest`)  
   - App name, short name, icons (192 + 512), theme color, background color  
   - `display: "standalone"` (or `"fullscreen"`)  
   - `start_url`, `scope`, `orientation` (usually `"portrait"` for clinic phone use)  
   - `id` field for stable install identity  
   - Shortcuts (e.g. “New visit”, “Today’s patients”) — useful on Android; limited on iOS  

2. **Service Worker** (via Workbox or framework plugin)  
   - Precache app shell (home, patient list, forms)  
   - Runtime cache for patient data / images with clear rules  
   - Offline fallback page in Arabic/English if needed  
   - Update strategy: “new version ready” with **one big clear button** (“Update”) — never technical language  

3. **HTTPS**  
   - Required for install + service worker + camera/mic permissions  

4. **Installability**  
   - Android Chrome: can show install banner / `beforeinstallprompt`  
   - iOS Safari: **no custom install prompt API** — must teach “Share → Add to Home Screen” with a very simple illustrated guide  

### 3.2 APIs that get closer to native

| Capability | Android Chrome | iOS Safari (Home Screen PWA) | Clinic relevance |
|------------|----------------|------------------------------|------------------|
| Home Screen icon + standalone UI | Excellent | Good (manual Add to Home Screen) | Critical |
| Offline / cache | Excellent | Good (with storage limits) | Critical for weak clinic Wi‑Fi |
| Web Push notifications | Good | Supported since **iOS 16.4+**, only when added to Home Screen, user must allow | Follow-up reminders |
| Badging API (icon badge count) | Often yes | Limited / evolving | “3 patients today” |
| Background Sync / Periodic Sync | Partial | Weak / unreliable | Don’t depend on this |
| Camera (photos of ultrasound / papers) | Good | Good with permission | High value |
| File / photo upload | Good | Good | Lab reports |
| Biometrics (WebAuthn) | Good | Good | Optional simple PIN + Face ID later |
| Local storage / IndexedDB | Large | More aggressive eviction under storage pressure | Must sync to server often |
| Share sheet | Good | Good | Share visit summary PDF |
| Safe-area / notch padding | Via CSS `env(safe-area-inset-*)` | Needed | Avoid cut-off buttons |
| Splash / launch screen | Manifest icons + theme | Uses icons; less customizable | Brand calm clinic look |
| Bluetooth / NFC / advanced sensors | Limited | Very limited | Not needed for v1 |
| True background always-on location | No | No | Not needed |

### 3.3 iOS-specific truth (important)

Apple improved PWAs, but they are still **not equal to native apps**. Design for these realities:

1. **No automatic “Install app” popup** like Android.  
   → First-run screen: 3 huge steps with screenshots: Share → Add to Home Screen → Open the icon.

2. **Push only works if:**  
   - iOS 16.4+  
   - App added to Home Screen  
   - User granted notification permission  
   → Also support **in-app “Today” list** so the product still works if push is denied.

3. **Storage can be cleared** if the phone is low on space or the PWA is unused for a long time.  
   → Always save patient data on a **server** (cloud DB). Offline = temporary cache, not the only copy.

4. **Service worker + cookies / auth** need careful setup (SameSite, secure cookies, or token in IndexedDB).  
   → Prefer simple phone OTP / PIN login over complex password managers for this user.

5. **Standalone mode quirks:**  
   - External links can jump into Safari  
   - Media / download behavior differs from Chrome  
   - Test every flow **from the Home Screen icon**, not only inside Safari tabs

6. **iOS 17+/18** continue improving web features, but **never assume parity** with Android. Always QA on a real iPhone.

### 3.4 Android notes (still design for it)

- Better install UX (`beforeinstallprompt`)  
- More reliable background behaviors  
- Larger storage comfort  
If staff or family help her from Android, the same PWA should work great there too.

### 3.5 “Near-native” UX techniques (not just APIs)

These matter more than exotic APIs for a non-tech doctor:

- App-like navigation: **bottom bar with 3–4 items max**  
- Large tap targets (min ~48×48px, prefer bigger)  
- Instant feedback on every tap (loading skeleton / success check)  
- Avoid multi-step wizards unless each step is one question  
- Use device font scaling; support Dynamic Type  
- Haptics where available (`navigator.vibrate` on Android; don’t rely on iOS)  
- Smooth transitions (150–250ms), not flashy animation  
- Keep forms **one column**, big labels, big inputs  
- Prefer **select chips / big buttons** over tiny dropdowns  
- Autosave every field change (“Saved” toast) so she never fears losing data  

### 3.6 Recommended technical stack for this project

**Frontend**

- **Next.js (App Router) + TypeScript** — solid PWA path, easy hosting  
- **Tailwind CSS** — fast iteration once you send UI pictures  
- **Serwist or Workbox** for service worker (Next PWA plugins)  
- **web-push** on server for notifications  

**Backend / data**

- **Supabase** (Postgres + Auth + Storage) *or* Nest/Prisma if you want full control  
- Row-level security / clinic-only access  
- Encrypted at rest; HTTPS always  
- File storage for ultrasound images / lab PDFs  

**Why this stack:** one deploy = everyone gets the update. She never “installs version 2”.

**Avoid for v1:** micro-frontends, complex design systems, dark-mode toggles, dashboard charts clutter.

---

## 4. Security & medical data (non-negotiable)

Even a “simple” clinic app holds sensitive health data.

1. **Login required** (simple PIN or phone OTP; optional Face ID later)  
2. **Auto-lock** after short idle time  
3. **Server is source of truth** (not only phone storage)  
4. **Audit basics:** who viewed/edited a patient (even if UI hides complexity)  
5. **Backups** daily  
6. **No patient data in analytics tools**  
7. Consent / clinic policy: clarify this is clinic operations software, not a public patient social app  
8. If you later need strict legal regimes (HIPAA/GDPR-like), choose hosting + BAAs accordingly — plan early  

---

## 5. Product scope for v1 (keep tiny)

### Must-have

1. **Patients list** — search by name / phone  
2. **Patient profile** — age, phone, notes, pregnancy status / gestational week if relevant  
3. **Visits / follow-ups** — date, reason, notes, next appointment  
4. **Today screen** — who is expected today / needs follow-up  
5. **Add patient / add visit** — few fields, huge buttons  
6. **Offline read** of recent patients + queue new notes when back online  
7. **Install guide** for iPhone  

### Nice-to-have later

- Reminders via push / WhatsApp link  
- Photo attach to visit  
- Print / PDF summary  
- Multiple staff roles  
- Arabic-first UI (if she works in Arabic)  

### Explicitly out of v1

- Billing complexity  
- Lab integrations  
- Telemedicine video  
- AI diagnosis  
- Public patient self-booking (unless she asks)

---

## 6. UI/UX for a non-tech doctor (clinic-specific)

### 6.1 Design principles

1. **One job per screen** — “Find patient” OR “Add visit”, never both crowded  
2. **Recognition over memory** — show recent patients big; don’t make her remember menus  
3. **Language of the clinic** — “Next visit”, “Pregnant”, “Week 28”, not “CRUD”, “records entity”  
4. **Forgiving** — undo delete, confirm only for destructive actions  
5. **Fat finger friendly** — primary actions thumb-reachable at bottom  
6. **Calm visual tone** — soft medical trust (avoid scary red except emergencies/errors)  
7. **No settings jungle** — hide advanced options  
8. **Empty states that teach** — “No patients yet — tap + to add the first”  

### 6.2 Information architecture (recommended)

Bottom navigation (max 4):

1. **Today** — follow-ups & appointments  
2. **Patients** — search + list  
3. **Add** — big center action (new patient or new visit)  
4. **More** — install help, lock, simple backup/export later  

### 6.3 Key flows (should feel stupidly easy)

**Find patient (most common)**  
Today → or Patients → type 1–2 letters → tap name → see timeline  

**During visit**  
Open patient → **+ Visit** → 3–5 fields → Save (autosave) → set next date  

**End of day**  
Today list clears / shows done checkmarks  

### 6.4 Visual & interaction rules

| Rule | Guidance |
|------|----------|
| Type size | Body ≥ 18px; titles larger; never tiny helper text as the only instruction |
| Contrast | High contrast text; WCAG AA minimum |
| Color | 1 primary action color; gray neutrals; soft success green; error red sparingly |
| Cards | Use only when tapping a patient/visit — not decorative boxes everywhere |
| Icons | Always pair with text labels (she should not guess icon meanings) |
| Forms | Labels above fields; show examples (“e.g. 050…”) |
| Errors | Human text: “No internet — notes will send when connected” |
| Success | Big check + “Saved” |
| Onboarding | ≤ 3 screens, skippable, repeatable from More → Help |

### 6.5 Accessibility & real clinic conditions

- Works with one hand while standing  
- Readable in bright clinic light (high contrast)  
- Works offline in exam room dead zones  
- No hover-only actions (touch only)  
- Confirm before calling patient (accidental taps)  

### 6.6 Content patterns for pregnancy / women’s clinic

Keep medical structure simple:

- **Status chips:** Pregnant / Postpartum / Gynecology / Other  
- **Pregnancy block:** LMP or due date → show gestational week automatically  
- **Visit types:** Antenatal checkup, Ultrasound, Complaint, Follow-up, Procedure  
- **Alert fields (optional later):** allergies, high-risk flag — visually clear but not noisy  

Do **not** overload with full hospital EHR screens (medication trees, ICD coding) in v1.

### 6.7 What “easy” looks like in practice

Bad: hamburger menu → Records → Patients → Filters → Advanced → Create  

Good: big **Patients** tab → big **+** → name + phone → Save  

Bad: 20 required fields before first save  

Good: Name required; everything else optional; she can complete later  

---

## 7. iPhone install playbook (ship inside the app)

Show a permanent, friendly help card until installed:

1. Open this link in **Safari** (not Instagram/Facebook in-app browser)  
2. Tap the **Share** icon  
3. Tap **Add to Home Screen**  
4. Tap the new icon to open  

Detect standalone mode (`display-mode: standalone` / `navigator.standalone`) and hide the guide once she is using the installed icon.

---

## 8. Testing checklist before she uses it daily

- [ ] Real iPhone, installed from Home Screen  
- [ ] Real Android phone install  
- [ ] Airplane mode: can open recent patient + see message when saving  
- [ ] Weak 3G simulation  
- [ ] Push permission allow + deny paths  
- [ ] Rotate device / large text size  
- [ ] Session lock / logout  
- [ ] Photo upload from camera roll  
- [ ] Arabic/English if bilingual  
- [ ] First-time user test with *her* (watch silently; note where she hesitates)

---

## 9. Build plan (after you send UI pictures)

1. Freeze visual direction from your pictures (colors, type, layout)  
2. Scaffold Next.js PWA + manifest + service worker  
3. Build Today / Patients / Patient detail / Add visit only  
4. Connect backend + auth  
5. Offline + install guide  
6. Soft launch with her on one device  
7. Iterate only on pain points she hits  

**Waiting on you:** UI design pictures / references.  
No UI implementation starts until those arrive (per your request).

---

## 10. Sources & further reading (for you / developers)

Use these when implementing (open in browser):

- MDN — Progressive Web Apps overview  
- web.dev — Installable / Offline / Service Worker guides (Google Chrome team)  
- Apple — Safari Web Push / Home Screen web apps release notes (iOS 16.4+)  
- W3C — Web App Manifest  
- Workbox / Serwist — service worker tooling  
- NN/g (Nielsen Norman) — form design & mobile usability heuristics  
- WHO / general clinical UX literature — minimize cognitive load in clinical software  

> Note: Live web search tools were unavailable in this session (auth / interrupted network tools). This brief is written from current established PWA platform behavior (including iOS Home Screen apps, Web Push since iOS 16.4, Workbox-style offline, and clinical usability practice). When you are back on the PC, we can re-run live docs scrape to attach exact version citations.

---

## 11. Decisions to confirm with you later

1. Language: Arabic, English, or both?  
2. Will she use mainly **iPhone**? (assume yes, still support Android)  
3. Single doctor only, or nurse/staff later?  
4. Must work 100% offline for full days, or “mostly online”?  
5. Need WhatsApp reminder links?  
6. Brand colors / clinic name / logo?  

---

## Bottom line

- **PWA is the right v1** for a non-tech clinic doctor: Home Screen icon, fast updates, no App Store.  
- **iOS can feel native enough** with standalone mode, offline cache, camera, and (if allowed) push — but install must be taught, and cloud sync is mandatory.  
- **UI must be ruthless about simplicity:** Today + Patients + Add, huge taps, autosave, clinic language, almost no settings.  
- **Next step:** you send UI pictures → we build the real app on top of this brief.
