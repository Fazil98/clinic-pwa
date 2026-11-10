# Clinic App — Simple UI Spec

**Goal:** Your sister can add a patient fast, understand her condition, and follow up with search + notes — without learning “software.”  
**Rule:** Few screens. Big buttons. Almost nothing required. Everything else optional and addable later.

---

## 1. The whole app = 4 places only

| Tab | Name | Job |
|-----|------|-----|
| 1 | **Today** | Who needs attention today / overdue follow-ups |
| 2 | **Patients** | Find anyone (search + sort) |
| 3 | **+ Add** | New patient OR new visit/note (one clear choice) |
| 4 | **More** | Help (iPhone install), lock app, language |

No hamburger menus. No hidden settings. No dashboards.

```
┌─────────────────────────────────────┐
│  Screen content                     │
│                                     │
├─────────┬─────────┬────────┬────────┤
│  Today  │Patients │   +    │  More  │
└─────────┴─────────┴────────┴────────┘
```

---

## 2. What data she needs (kept simple)

### A. Personal details (Patient card)

| Field | Required? | Why | Easy input |
|-------|-----------|-----|------------|
| **Full name** | Yes | Identify | Big text |
| **Phone** | Yes | Call / WhatsApp | Number keypad |
| Age **or** date of birth | One of them preferred | Medical context | Age is easier; DOB optional |
| City / area | Optional | Contact | Text |
| Emergency contact name + phone | Optional | Urgent | Same as phone |
| Photo | Optional | Recognize face | Camera button |

**First save needs only: Name + Phone.**  
She can fill the rest later from the patient page (“Complete profile”).

---

### B. Her condition (why she comes to the clinic)

Ask this with **big choice buttons**, not long forms:

**Patient type** (tap one):

1. **Pregnant**  
2. **After birth** (postpartum)  
3. **Women’s health** (gynecology)  
4. **Other**

Then show **only** the fields for that type:

#### If Pregnant
| Field | Required? | Easy input |
|-------|-----------|------------|
| Due date **or** last period date (LMP) | Strongly recommended | Date picker |
| Current week of pregnancy | Auto-calculated if date given | Show big “Week 28” — editable if needed |
| Number of pregnancies before | Optional | + / − stepper (0, 1, 2…) |
| Previous C-section? | Optional | Yes / No |
| Twin / multiple? | Optional | Yes / No |

#### If After birth
| Field | Required? | Easy input |
|-------|-----------|------------|
| Delivery date | Optional | Date |
| Birth type | Optional | Normal / C-section |
| Baby notes | Optional | Short text |

#### If Women’s health / Other
| Field | Required? | Easy input |
|-------|-----------|------------|
| Main reason | Optional | Short text or chips: pain, bleeding, infection, checkup, infertility, other |

---

### C. Medical history (important, but must stay light)

Do **not** make a hospital-style 40-field history form.  
Use **toggles + one notes box**.

**Quick health flags** (tap on/off chips):

- High blood pressure  
- Diabetes  
- Anemia  
- Allergy (if on → small text: “to what?”)  
- Previous surgery  
- Bleeding problems  
- Smoking  
- Other chronic illness  

**Free text (optional, big box):**  
“Anything else important about her health?”

**Medicines now (optional):**  
One simple list: add medicine name (+ optional dose). Or just one text box in v1: “Medicines: …”

**Blood type (optional):**  
A+ A− B+ B− AB+ AB− O+ O− / Unknown — big chips.

**High-risk star:**  
One clear switch: **Needs extra attention** — shows a mark on list + Today.

---

### D. Follow-up & notes (the daily work)

Each patient has a **timeline** (newest on top):

| Entry type | What it stores |
|------------|----------------|
| **Visit** | Date, type, short note, next visit date |
| **Quick note** | Date + text only (phone call, WhatsApp, reminder) |
| **Attachment** (later) | Photo of ultrasound / paper |

**Visit fields (keep tiny):**

1. Date (default: today)  
2. Visit type chips: Checkup / Ultrasound / Complaint / Follow-up / Other  
3. What happened? (big notes box)  
4. Next visit date (optional but encouraged)  
5. Save

**Multiple notes:** unlimited. Each note is its own card on the timeline. She never “edits one giant paragraph forever” — she adds another note.

---

## 3. Screens we need (and only these for v1)

### Screen 1 — Today
**Purpose:** Open app → immediately know who to call / see.

Shows:
- Overdue follow-ups (red/soft warning)  
- Visits scheduled for today  
- High-risk patients with upcoming needs  

Each row: **Name · phone · why (Week 30 / Follow-up) · big Open button**  
Empty state: “No follow-ups today — nice. Add a patient from +”

---

### Screen 2 — Patients (search + sort)
**Purpose:** Find anyone in seconds.

Top:
- **Huge search bar:** name or phone (searches as she types)  
- **Sort** (one tap menu): Recent visit · Next visit · Name A–Z · High-risk first  

List row:
- Name  
- Phone  
- Small status chip (Pregnant W28 / Gynecology / …)  
- Next visit date if any  
- Star if high-risk  

Tap row → Patient page.

---

### Screen 3 — Add (choice)
Two huge buttons only:

1. **New patient**  
2. **New visit / note** (then ask: which patient? → recent list + search)

This avoids a confusing multi-purpose form.

---

### Screen 4 — New patient (easy wizard: 3 short steps)

Progress: ●○○ Step 1 of 3 — she can skip optional steps.

**Step 1 — Who is she?**  
- Name*  
- Phone*  
- Age (optional)  
→ Button: **Save & continue** (patient already created here!)  
→ Link: “Save and finish later”

**Step 2 — Why is she here?**  
- Type chips (Pregnant / After birth / Women’s health / Other)  
- Only the few fields for that type  
→ **Continue**

**Step 3 — Health basics (all optional)**  
- Health flag chips  
- Allergy text if needed  
- Medicines text  
- High-risk switch  
→ **Done — open patient**

**Why this works:** after Step 1 she already has the patient. No fear of “losing the form.”

---

### Screen 5 — Patient page (home for one woman)

Top card:
- Name, phone (tap phone → call)  
- Status chip + week if pregnant  
- High-risk mark  
- Next visit  

Actions (big):
- **+ Visit**  
- **+ Quick note**  
- **Edit details**  

Sections (simple tabs or stacked):
1. **Timeline** (default) — all visits + notes  
2. **Profile** — personal + condition + history  

Timeline item:
- Date · type  
- Note text  
- “Next: 12 Nov” if set  

---

### Screen 6 — Add visit / Add quick note

**Visit:** date, type chips, notes, next visit → Save  
**Quick note:** notes only → Save  

Autosave draft if she leaves for a moment (optional but helpful).  
Success: big “Saved” and return to patient timeline.

---

### Screen 7 — Edit patient
Same fields as wizard, but one scroll page with 3 clear headers:

1. Personal  
2. Condition  
3. Medical history  

No delete in the middle of the form. Delete patient lives under More actions with strong confirm.

---

### Screen 8 — More
- How to install on iPhone  
- Lock / logout  
- (Later) Export / backup  

---

## 4. Follow-up system (how she uses it day to day)

### Finding people
1. Search by **name or phone** (Patients tab)  
2. **Today** for who is due  
3. Sort: next visit / recent / high-risk  

### After each appointment
Patient → **+ Visit** → write what happened → set **Next visit** → Save  
That next visit date automatically feeds **Today** when the day comes.

### Between visits
Patient → **+ Quick note** (“Called, bleeding less, come Thursday”)  
Many notes = full story without cluttering one box.

### Missed follow-ups
If next visit date passed and no new visit → she appears under **Today → Overdue**.

---

## 5. Ease-of-input rules (must follow in UI)

1. **Required fields only:** Name + Phone  
2. **Chips & Yes/No** over dropdowns  
3. ** steppers** for numbers (pregnancies, etc.)  
4. **Date pickers** — never type dates by hand  
5. **Labels in clinic language** (“Next visit”, not “Follow-up entity”)  
6. **One primary green/blue button** per screen  
7. Thumb-friendly: main actions at bottom  
8. **Saved** confirmation every time  
9. Mistakes: Edit anytime; delete needs confirm  
10. If Arabic: big Arabic labels first; numbers stay clear  

---

## 6. What we are NOT putting in v1 (on purpose)

- Full EMR coding (ICD), lab systems, billing  
- Long gynecological exam templates  
- Prescription printer engine  
- Patient self-login app  
- Charts-heavy dashboards  

These make apps hard. We add only if she asks after using the simple version.

---

## 7. Field summary cheat sheet

**Create patient (minimum):** name, phone  

**Condition (by type):** pregnant dates/week · postpartum delivery · gyn reason  

**History (optional chips + text):** BP, diabetes, anemia, allergy, surgery, meds, blood type, high-risk  

**Follow-up:** visits + unlimited notes + next visit date + search + sort + Today/overdue  

---

## 8. Next step with you

This is the **UI map + data we need**.  
When you send pictures, we match colors/layout to this structure — not the other way around.

If you want changes before design, tell me:
1. Arabic, English, or both?  
2. Is **age** enough, or do you need full date of birth?  
3. Should **+ Add** open straight to “New patient”, or keep the 2-choice screen?
