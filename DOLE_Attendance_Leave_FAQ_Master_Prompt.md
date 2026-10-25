# MASTER PROMPT — DOLE Central Luzon FAQ Website

## Project: Updated Guidelines on Attendance Monitoring and Leave Administration

**Role:** Act as a senior product designer, UI/UX specialist, accessibility engineer, and senior frontend developer. Create a complete, polished, responsive, production-quality informational website for the Department of Labor and Employment (DOLE) Central Luzon based on the supplied institutional logo and `WEBSITE CREATION(1).docx`.

> **Design skill directive:** If the `design-taste-frontend` skill exists in your coding environment, **read and apply it before implementing**. Use its guidance for high-quality visual hierarchy, typography, composition, microinteractions, and avoiding generic AI-generated interfaces. If it is unavailable, implement the equivalent detailed design directions in this master prompt; do not claim it was run.

> **Policy fidelity:** The DOCX is the provided FAQ content source, not necessarily the authoritative signed policy. Transcribe every supplied answer accurately; do not silently rewrite policy rules, invent leave entitlements, deadlines, signatures, circular numbers, citations, or approval workflows. Present content as informational FAQ pending review by DOLE's designated HR/policy owner. Additional leave-policy content requires an approved source.

---

## 1. Main objective

Build a **modern, elegant, easy-to-navigate FAQ knowledge hub** where DOLE personnel can quickly find answers about work schedules, attendance recording, DTR submission, official business, and eventually leave administration.

The landing page's prominent exact title must read:

**UPDATED GUIDELINES ON ATTENDANCE MONITORING AND LEAVE ADMINISTRATION**

Below it, place a welcoming subtitle such as: *Your quick guide to work schedules, attendance records, official business, and leave-related guidelines.*

Keep a clear distinction between the website's broad title and the FAQs that actually exist in the provided document. **No leave-administration FAQ content is included in the supplied DOCX**; add a clearly labeled expandable category or placeholder that says *Leave administration FAQs will be published once verified and approved*, without fabricating answers.

## 2. Branding and color system

Use the **uploaded DOLE Central Luzon logo** as the main branding reference and supplied image asset. Do not redraw, stretch, recolor, distort, or recreate it with AI. Preserve its aspect ratio, use an optimized asset, and show it gracefully in the site header. Use the logo's patriotic visual language in a restrained institutional way: confident DOLE blue, white, subtle red, and occasional star-gold details.

Suggested design tokens (**starting approximations**, refine with sampling from the provided logo):

| Token | Starting value | Use |
|---|---|---|
| `--dole-blue` | `#073DAA` | primary actions, navigation, title emphasis |
| `--dole-blue-dark` | `#08285F` | deep hero/nav contrast |
| `--dole-blue-light` | `#EAF1FF` | soft panels and hover states |
| `--dole-red` | `#D21F2B` | restrained accent only, not general error styling |
| `--star-gold` | `#F6C500` | tiny ornamental highlights |
| `--surface` | `#FFFFFF` | cards and page background |
| `--surface-subtle` | `#F7F9FC` | alternate section backgrounds |
| `--text` | `#152238` | body text |
| `--muted` | `#65748B` | secondary information |

Design personality: **credible government institution × contemporary product design**. Avoid dated bureaucratic layouts, cluttered clip art, excessive gradients, harsh shadows, overuse of red/yellow, or giant logo watermarks that impede readability.

Typography: `Plus Jakarta Sans` or `Inter` for interface and body copy; strong, carefully kerned title treatment. Prefer local/self-hosted fonts when practical, reasonable fallbacks, and a consistent type scale.

## 3. Recommended modern technology stack

This project is currently an **informational FAQ website**, so prioritize speed and simplicity over unnecessary services.

- **Framework:** Next.js (App Router) + TypeScript + React.
- **Styling:** Tailwind CSS with reusable design tokens and CSS variables.
- **Accessible component primitives:** shadcn/ui and Radix UI (`Accordion`, `Dialog`, `NavigationMenu`, etc., only when genuinely needed).
- **Icons:** Lucide React; elegant consistent strokes.
- **Motion:** Motion for React (formerly Framer Motion), subtle and reduced-motion aware.
- **Content:** type-safe local JSON/TypeScript/MDX initially. Use no database for v1 unless editing by nontechnical staff is a confirmed need.
- **Search:** client-side instant filtered search using the structured FAQ dataset; optional lightweight fuzzy matching if necessary.
- **Testing:** Vitest + React Testing Library; Playwright for key mobile/desktop user flows.
- **Quality:** ESLint, Prettier, strict TypeScript, semantic HTML, metadata, Open Graph information, accessibility checks.
- **Hosting:** compatible with a standard Next.js deployment or a static export if all pages use static capabilities.

**Optional phase 2 only:** Add Django REST API + MySQL or a CMS when HR administrators must publish and maintain many FAQs. Do not introduce an API, login, dashboard, authentication, or database for this static FAQ site without a real product need.

## 4. Information architecture and page layout

### A. Sticky, compact header

- Left: DOLE Central Luzon logo (small, crisp) with text `DOLE Central Luzon` / `Guidelines & FAQs`.
- Right desktop: `Home`, `Browse FAQs`, `Categories` and optional `Contact HR` (only if real contact details are approved).
- Mobile: accessible menu button and compact slide-down or drawer navigation.
- Soft translucent white background only if legibility is preserved; slight border on scroll.
- Include a visible skip-to-content link for keyboard users.

### B. Hero / landing section (first viewport)

Create an editorial hero with a spacious two-column layout on desktop and orderly single-column layout on mobile.

**Left column:** small eyebrow `DOLE CENTRAL LUZON • PERSONNEL REFERENCE GUIDE`; exact main title on 3–5 graceful lines at desktop widths; concise supporting copy; search field; primary action `Browse all FAQs`; secondary text link `Explore categories`.

**Right column:** an original CSS/SVG composition of a minimal document, calendar, and checklist or an abstract geometric policy illustration—**not** a fake policy document, not an AI image, and not another redesigned DOLE logo. Use layered white cards, thin blue outlines and restrained red/gold accents. On small screens, remove or reposition decorative art to ensure search is above the fold as much as practical.

Hero background: warm white-to-cool-blue wash, subtle dot/grid or circular motifs inspired by the seal. Preserve legibility and professional restraint.

**Prominent functional search:** placeholder `Search attendance, DTR, work schedule, official business...`; `Ctrl/⌘ + K` shortcut optional; searching should update results immediately and allow Enter to navigate/scroll to matches. Provide helpful empty-state text and a reset control.

### C. Quick-find strip

Below hero, use 3–4 modest stat/info chips (NOT made-up numerical metrics): `Work schedules`, `Attendance records`, `DTR submissions`, `Official business`. Or short keyword pills such as `40-hour workweek`, `Time-in / time-out`, `DTR`, `OB`. Clicking a chip applies a search or navigates to its category.

### D. Category grid (this is where users discover the questions)

Show **four large but tidy interactive category cards** in a responsive grid: 2×2 on desktop, stacked on mobile.

1. **Work Schedule** — `Clock3` icon — 4 FAQs.
2. **Attendance Recording System** — `Fingerprint` or `ClipboardCheck` — 4 FAQs.
3. **Daily Time Record (DTR)** — `FileClock` — 3 FAQs.
4. **Official Business (OB)** — `BriefcaseBusiness` — 4 FAQs.

**Correction from source:** There are **15 FAQs total**, not 16. Use source counts (4 + 4 + 3 + 4 = 15). Group categories 2–4 under a conceptual `Records of Attendance` umbrella without losing their supplied subcategory names.

Potential future card: `Leave Administration — Coming soon / pending verified guidance`, visually distinct and disabled/non-clickable rather than pretending answers exist.

Each category card: light background, 1px border, gentle shadow, icon badge, descriptive copy, factual FAQ count, subtle arrow, clear hover/focus effect, whole-card interaction. Use responsive spacing and keep all cards balanced.

### E. Frequently asked questions section (primary content)

Place full FAQ content **immediately below the category grid on the same landing page**, so visitors don't need to navigate to separate pages just to read answers.

Desktop arrangement:

- Left 25–30%: compact sticky sidebar listing categories with active category indicator (sticky only when appropriate and not obscuring content).
- Right 70–75%: category heading and groups of FAQ **accessible accordion rows**.
- Open first question in each section only if it helps scanning; otherwise initially collapsed. Opening must not unexpectedly shift the page excessively.
- Each answer is a readable, naturally spaced paragraph. Include a small, tasteful `Remember` guidance panel after each section, accurately reproducing the DOCX's reminder text.
- Optional `Copy link` icon for directly linking to individual questions through stable anchors (`#work-schedule-1`, etc.).
- A restrained `Back to top` link at end of each category.

Mobile arrangement:

- Convert sticky sidebar to a horizontally scrollable category chip bar **or** accessible category select.
- One full-width accordion per question, comfortable 44px or larger tap targets.
- Avoid horizontal overflow, nested scroll traps, or oversized decorative art.

**Accordion styling:** white surface, 1px cool-gray divider, 14–18px corner radius only where appropriate, question semibold, blue expand/collapse icon, soft blue active state, thin transition; answers are dark neutral text. Do not overanimate accordion height.

### F. Support / verification notice and footer

At the end, include a useful, neutral disclaimer: `This website is an informational reference. For official interpretation or approval, consult the current signed DOLE issuances and your authorized HR/personnel office.` Do not add invented memo identifiers, dates, named offices, staff emails, telephone numbers, legal seals, or copyright claims.

Footer: small supplied logo, `DOLE Central Luzon`, site name, anchor navigation, optional `Last reviewed` **only if a verified review date is provided**.

## 5. Exact site content from supplied DOCX

**Important:** The content below is extracted from `WEBSITE CREATION(1).docx`. Preserve each question and answer, and render the reminder text in its matching section. You may correct obvious typographic presentation (spacing and terminal punctuation) without changing meaning. Do not change rules or infer missing exceptions.

### Category 1: Work Schedule

**Q1. How many hours should I work each week?**

You must work 40 hours per week, not including your lunch break. Follow your approved work schedule.

**Q2. Do all employees need to follow the 8:00 AM to 5:00 PM schedule?**

The Department must provide public services from 8:00 AM to 5:00 PM, including lunchtime. Some employees, such as drivers, may have different work hours depending on their duties and approval from the Head of Office.

**Q3. If I have an approved Flexible Work Arrangement (FWA), can I choose my own working hours?**

No. You must follow the work schedule approved for you. You must also follow the rules on attendance, work performance, communication, and reporting.

**Q4. If I work beyond my regular hours, will I automatically receive overtime pay or time credits?**

No. You must get approval before working overtime. Your overtime must also follow the rules before you can receive overtime pay or compensatory time credits.

**Remember:** complete your 40-hour workweek, follow your approved schedule, comply with attendance and reporting requirements, and obtain prior authorization before rendering overtime.

### Category 2: Records of Attendance — Attendance Recording System

**Q1. How many times should I record my attendance each day?**

You must record your attendance four times per regular onsite workday: morning time-in, morning time-out, afternoon time-in, and afternoon time-out, unless another authorized arrangement applies.

**Q2. What should I do if I forget to time in or time out?**

You must submit the appropriate supporting document, such as an approved OB form, certificate of attendance, approved leave or CTO, or other applicable document.

**Q3. What if the biometric scanner or bundy clock is not working?**

You should provide the required certification of system failure or other appropriate supporting document to explain the missing attendance record.

**Q4. Do employees with an approved Flexible Work Arrangement (FWA) still need to record their attendance?**

Yes, unless another authorized attendance monitoring arrangement applies. Your attendance must still be properly recorded according to your approved arrangement.

**Remember:** Always record your attendance correctly, complete all required time-in and time-out entries, submit supporting documents when needed, and never falsify your attendance records.

### Category 3: Records of Attendance — Daily Time Record

**Q1. When should I submit my DTR?**

You must submit your validated DTR within five (5) working days after receiving it or when it becomes available, unless another deadline is announced.

**Q2. What if my DTR has missing attendance entries?**

Provide the appropriate supporting documents, such as proof of official business, approved leave, CTO, authorized FWA, or other official activity, as applicable. Unsupported entries may be treated as absence, tardiness, or undertime.

**Q3. Can I write my attendance entries by hand?**

Only if the attendance system is unavailable or there is another valid reason. You must provide supporting proof, and the entries must be checked and validated by the appropriate official.

**Remember:** Check your DTR carefully, attach the necessary documents, obtain the required signatures or validation, and submit it on time to avoid possible payroll delays.

### Category 4: Records of Attendance — Official Business

**Q1. Do I need approval before going on OB?**

Yes. You must get approval before leaving for official activities, except in emergencies or urgent situations when prior approval is not possible.

**Q2. What information should be included in the OB form?**

The date, purpose, destination, and expected duration of the activity.

**Q3. What documents can prove that I attended an official activity?**

A certificate of attendance, certificate of appearance, or other required supporting documents.

**Q4. What if I cannot get approval because of an emergency?**

The policy allows an exception when an emergency or urgent official requirement makes prior approval impractical.

**Remember:** GET APPROVAL, KEEP PROOF, AND SUBMIT DOCUMENTS.

### Future section: Leave Administration

Display only an honest placeholder such as: `Additional leave administration questions will appear here after HR verification.` Do not create fictional FAQs or cite policies not supplied.

## 6. Responsive design contract

Design and verify for **320px, 375px, 390px, 430px, 768px, 1024px, 1280px, 1440px and large desktop** widths.

- Mobile-first CSS with fluid typography (`clamp`) and consistent container max-width (~1200px).
- Header remains compact; no title or logo overflow.
- Hero headline wraps cleanly; no line becomes an awkward orphan.
- Search field stretches to device width, with large input and search icon.
- Category cards switch to one column at narrow widths.
- Acccordions provide at least 44×44px tap-friendly interaction areas.
- Avoid hover-only affordances and do not rely on colors alone to indicate selected states.
- No horizontal page scrolling at 320px.
- Respect device safe areas and text zoom; verify at 200% zoom.

## 7. Modern visual and interaction design standards

- Use premium-feeling whitespace, clear grid alignment, restrained editorial typography, consistent radii and subtle elevation.
- Add purposeful scroll reveal or fade-in only for nonessential elements; all text and FAQs must remain readable if JS/motion is disabled where feasible.
- Add clean interactive hover/focus states for cards, links, inputs and accordion triggers.
- Consider a compact scroll progress indicator if it demonstrably improves usability; otherwise skip it.
- Add a lightweight empty search state with reset action.
- Use skeletons **only if there is actual asynchronous loading**; do not invent loading screens.
- No auto-playing slides, no excessive parallax, no giant spinning icons, no intrusive popups.
- Responsive motion must respect `prefers-reduced-motion`.

## 8. Accessibility, trust, performance and SEO

- Target WCAG 2.2 AA contrast and keyboard operation.
- Semantic landmarks, exactly one page H1, logical headings, explicit focus rings, correct accordion `aria-expanded` patterns, accessible search label, descriptive alt text for the logo.
- Avoid placing essential information in illustrations or decorative text.
- Support English copy clearly; do not automatically translate or rewrite official guidance.
- Pre-render static FAQ content for search engines; add sensible `title`, meta description, canonical handling when relevant, and a clear favicon based on an authorized asset.
- Keep dependencies and bundle size lean; optimize images and font loading; avoid layout shifts.
- Sanitize/validate any future admin-provided content; avoid injecting raw HTML.
- Include source/policy verification reminder without inventing formal legal authority.

## 9. Implementation structure (suggested)

```text
src/
  app/
    layout.tsx
    page.tsx
    globals.css
  components/
    site-header.tsx
    hero.tsx
    faq-search.tsx
    category-grid.tsx
    faq-section.tsx
    faq-accordion.tsx
    remember-note.tsx
    site-footer.tsx
  data/
    faqs.ts
  lib/
    faq-search.ts
    utils.ts
  types/
    faq.ts
public/
  images/
    dole-central-luzon-logo.png
```

Use this data model or equivalent:

```ts
type FAQ = {
  id: string;
  question: string;
  answer: string;
  categoryId: string;
  keywords?: string[];
};

type FAQCategory = {
  id: string;
  title: string;
  description: string;
  icon: string;
  faqs: FAQ[];
  remember?: string;
};
```

Maintain one canonical FAQ dataset for counts, category lists, search, rendered answers, and anchors; no duplicate hardcoded FAQ strings spread across components.

## 10. Delivery phases and acceptance checklist

### Phase 1 — Source and design
- [ ] Inspect the logo and DOCX assets provided in the working project.
- [ ] Invoke `design-taste-frontend` if installed; otherwise follow this document's design rubric.
- [ ] Extract and confirm exactly **15** source FAQs in 4 functional categories.
- [ ] Draft desktop and mobile page composition and token palette.
- [ ] Do not add unverified leave policies.

### Phase 2 — Build
- [ ] Set up Next.js + TypeScript + Tailwind + selected accessible shadcn/ui primitives.
- [ ] Implement responsive header, hero, functional search, category cards, accordion sections, reminder panels and footer.
- [ ] Use the supplied logo asset without alteration.
- [ ] Implement category filtering, result counts and empty state.
- [ ] Wire links and anchors; avoid placeholders that appear functional but do nothing.

### Phase 3 — Test and refine
- [ ] Confirm all 15 questions, answers and 4 reminders match the source content.
- [ ] Confirm search terms like `DTR`, `40 hours`, `biometric`, `overtime`, `OB`, `FWA`, and `leave` produce sensible results or a truthful placeholder.
- [ ] Confirm all accordion items open/close with keyboard and touch.
- [ ] Test 320px to 1440px+, text zoom, reduced motion, and screen reader labels.
- [ ] Check no horizontal overflow and accessible color contrast.
- [ ] Run lint, types, tests and production build; fix errors.
- [ ] Perform a final designer-level visual polish pass.

## 11. Final delivery request to the coding agent

**Do not stop at a concept or mockup. Build the working website.** First inspect the provided assets and existing repository. Implement end-to-end with reusable components, polished styles, all 15 exact source FAQs, responsive behavior and accessible interactions. Run the application checks you can run, state any environment limitations, and return a brief summary of the files created, features completed, and commands to start it. **Do not invent missing official content.**

---

### Design direction in one sentence

*A modern public-sector knowledge hub: crisp DOLE blue and white, understated red/gold touches, authoritative typography, beautifully spaced category cards, instantaneous search, and frictionless accordion answers on every screen size.*
