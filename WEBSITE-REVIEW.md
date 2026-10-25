# Website Review — DOLE Central Luzon Attendance & Leave FAQ

*Reviewed 25 Oct 2026 against the running site (localhost:3001) and the project brief, `DOLE_Attendance_Leave_FAQ_Master_Prompt.md`.*

## Verdict

**Not ready to publish yet.** The site looks modern and polished, the 15 FAQs are transcribed accurately, and the core interactions work (topic filtering, expanding answers, direct links to answers, the mobile menu, no sideways scrolling). But it has real problems in four areas:

1. **Finding answers got worse.** The search box was removed, and collapsed answers are not in the page at all, so the browser's Ctrl+F can't find them either.
2. **Everything depends on JavaScript.** If JavaScript is slow or blocked, the hero and most sections stay invisible.
3. **Accessibility.** Many small labels fail WCAG AA contrast, and the heading structure is flat.
4. **Trust and content.** The title promises Leave Administration but there is no leave content. There's no source issuance, review date, or HR contact. The new "At a glance" figures drop the policy exceptions.

Fix every **P0** and **P1** item below before launch.

---

## P0 — Must fix before launch

### 1. Answers can't be found by Ctrl+F or search engines
- **What's wrong:** Radix Accordion removes closed answers from the page. With every question collapsed, there are **0 answer paragraphs** on the page. Ctrl+F only finds question titles, and search engines and "reader mode" never see the answers.
- **Why it matters now:** the search box was removed, so Ctrl+F is the only way left to look up a word like "biometric" or "CTO".
- **Fix:** keep answers in the page while they're collapsed. Use `forceMount` on `Accordion.Content` with `hidden="until-found"`, which lets Ctrl+F find and auto-open them in Chromium browsers. Alternatively, render answers in a `<details>`/`<summary>` element.
- **Where:** [faq-site.tsx](src/components/faq-site.tsx), the `Accordion.Content` block.

### 2. Removing search contradicts the brief
- **What's wrong:** the brief requires a "prominent functional search" (sections 4B and 10), and its test list checks searches such as `DTR`, `biometric`, `FWA` and `leave`. We removed search on my recommendation. That recommendation was reasonable for 15 questions, but it combines badly with item 1, and it wasn't checked against the brief first.
- **Fix (pick one):**
  - **(a)** Restore search in a lighter form: a single input above the FAQ list, not a big hero search.
  - **(b)** Keep it removed, fix item 1 so Ctrl+F works, and get explicit sign-off from whoever owns the brief that search is out of scope.

### 3. The page is blank without JavaScript
- **What's wrong:** **54 elements** are sent from the server with `style="opacity:0"`. Framer Motion's `initial` state is baked into the HTML. With JavaScript disabled, slow, or broken (old office PCs, strict browser extensions, a script error), the hero, section headings, category cards and FAQ groups stay invisible. A screenshot with JavaScript off shows an empty white page under the header.
- **Why it matters:** the brief says "all text and FAQs must remain readable if JS/motion is disabled".
- **Fix:**
  - Use `initial={false}` for content in the first screen.
  - Or gate reveal animations behind a class that's only added once JavaScript runs, e.g. `<html class="js">` with `.js .reveal{opacity:0}`.
  - Text should never start hidden in the HTML the server sends.

### 4. "At a glance" figures drop policy exceptions (policy fidelity)
The brief says not to rewrite policy rules. Two of the three figures leave out a condition that is in the source answer:

| Figure | What the source actually says |
|---|---|
| **4 entries** | "...per regular **onsite** workday ... **unless another authorized arrangement applies**" |
| **5 working days** | "...after receiving it or when it becomes available, **unless another deadline is announced**" |
| **40 hours** | Accurate as shown |

- **Fix:** either add the qualifiers to the labels, e.g. "per onsite workday, unless another arrangement applies" and "unless another deadline is announced", or replace the numbers with the brief's keyword chips (`40-hour workweek`, `Time-in / time-out`, `DTR`, `OB`).

### 5. Text contrast fails WCAG AA
WCAG AA requires a contrast of **4.5:1** for small text. Measured on their actual backgrounds:

| Element | Contrast | Size |
|---|---|---|
| Eyebrow "/" separator | 2.1 | 11px |
| "COMING SOON" | 2.6 | 10px |
| Sidebar "BROWSE BY TOPIC" label | 2.9 | 10px |
| Sidebar counts | 2.7 | 11px |
| FAQ group kicker ("RECORDS OF ATTENDANCE") | 2.9 | 10px |
| FAQ group count ("4 QUESTIONS") | 2.7 | 10px |
| Results meta ("15 answers in 4 topics") | 3.0 | 12px |
| "AT A GLANCE" heading | 3.2 | 10px |
| Leave preview text | 3.5 | 13px |
| Category card descriptions | 4.2 | 13px |

- **Fix:** darken all of these to at least `#64738b`, which measures 4.8:1. Also raise the minimum label size from 9–10px to **12px**. The "PERSONNEL REFERENCE" stamp is 9px, which is fine only because it's decorative and hidden from screen readers.

---

## P1 — Should fix before launch

### Content and trust
6. **The Leave Administration promise has nothing behind it.** The H1 says "...AND LEAVE ADMINISTRATION", yet the topic appears three times only as "coming soon": the preview card, the notice at the end of the list, and the hero text. Users who came for leave rules will feel misled.
   - **Option:** get approved leave FAQs before launch.
   - **Option:** lead with one honest line near the top, e.g. "Leave FAQs are being verified and will be added soon."
   - Either way, cut the placeholders down to one.
7. **No source or date.** Personnel need to know *which issuance* this reflects and *when* it was last checked. The brief forbids inventing these, so **ask HR for the issuance reference and a verified "Last reviewed" date** before adding them.
8. **No way to ask a question.** There's no HR contact. Ask HR for approved contact details (office, email or local number) and add a "Contact HR" link to the header and footer. The brief allows this once the details are approved.
9. **Authorization to use the DOLE seal and name.** Confirm the site is approved by DOLE RO3 and will be hosted on an official or approved domain. Otherwise the seal and name could make it look like an official DOLE site when it hasn't been approved.
10. **Uneven reminder text** in [faqs.ts](src/data/faqs.ts):
    - The Work Schedule reminder starts lowercase ("complete your 40-hour workweek..."). It reads oddly after the "Remember" heading.
    - The Official Business reminder is ALL CAPS ("GET APPROVAL, KEEP PROOF, AND SUBMIT DOCUMENTS."), which reads as shouting.
    - The brief allows typographic cleanup that doesn't change meaning.

### Accessibility
11. **Flat heading structure.** The questions are `<h3>` (Radix's default), the same level as the topic headings ("Work Schedule"), so the screen-reader heading list is one flat list of 20 items. Set `Accordion.Header asChild` with an `<h4>`.
12. **The all-caps H1 is hard to read.** It takes five lines and roughly 330px on desktop, and fills the whole first screen on mobile. Uppercase text is slower to read. The exact wording is required, but the casing isn't: consider Title Case with an uppercase eyebrow, or a smaller size on mobile.
13. **Sidebar chips on mobile give no hint they scroll.** "Attendance Recon..." is simply cut off. Add an edge fade or a scroll hint, or switch to a `<select>` (one of the two options in the brief).
14. **Not yet verified:** 200% text zoom, an actual screen-reader pass (NVDA), and a full keyboard-only walkthrough. The brief requires all three.

### Engineering
15. **Fragile hardcoded group labels.** "WORK SCHEDULE" / "RECORDS OF ATTENDANCE" is decided by a check on `category.id` in the component. The grouping is correct per the brief, but it belongs in the data as a `group` field. Today, adding a 5th category (e.g. Leave) would silently label it "RECORDS OF ATTENDANCE".
16. **One 330-line component.** Header, hero, illustration, cards, sidebar, accordion and footer all live in [faq-site.tsx](src/components/faq-site.tsx), and everything is a client component. The brief suggests separate components. Splitting them would let most of the page be server-rendered with smaller "client islands", e.g. only the sidebar and accordion.
17. **JavaScript weight.** First-load JavaScript is **173 kB** for a static FAQ page, and framer-motion is most of the increase. That's acceptable on office broadband but heavy on mobile data. Item 16 would cut it.
18. **Tests are thin.** There's only one Playwright smoke test, and it hardcodes counts (15, 4, 3). The brief asks for Vitest + React Testing Library and accessibility checks. Add:
    - unit tests that compare the data against the DOCX (questions, answers, reminders);
    - an `@axe-core/playwright` run, which would have caught item 5;
    - a no-JavaScript render check, which would have caught item 3.
19. **No Prettier** (the brief asks for it). Formatting is inconsistent: `globals.css` is mostly minified single-line rules, which are hard to review or diff.
20. **Dead data.** The `keywords` field in [faqs.ts](src/data/faqs.ts) is unused since search was removed. Delete it, or keep it on purpose if search comes back (item 2).

---

## P2 — Improvements and polish

### UX
21. **Two navigation systems for four topics.** The category cards *and* the sidebar both filter the same list, which is redundant. Consider making the cards plain jump links to each topic's section, with no filtering, and keeping the sidebar as the only filter.
22. **Too many "Back to top" controls:** a text link after each of the 4 topics plus the floating button. Keep one.
23. **"Link to this answer" gives no feedback.** It only changes the URL. Make it a "Copy link" button that shows a short "Copied" confirmation, as the brief suggests. That's what people need to share an answer in chat.
24. **Clicking the same "At a glance" link twice does nothing.** The URL fragment (the `#...` part) doesn't change, so no `hashchange` event fires. Handle the click directly instead.
25. **No "Expand all" or print view.** Staff may want to print or save the whole guide as a PDF. Add an "Expand all / Collapse all" toggle and an `@media print` stylesheet that shows every answer and hides navigation and decoration.
26. **No feedback loop.** There's no way to learn which questions are missing. Add a simple "Didn't find your answer? Contact HR" line (once item 8 is done), and later perhaps a "Was this helpful?" control.
27. **Inconsistent wording for the same thing:** "Categories" (nav), "Explore topics" (button), "FIND YOUR TOPIC", "BROWSE BY TOPIC". Pick one word, "Topics", everywhere.
28. **The "Home" nav link is redundant** on a one-page site; the logo already returns to the top.

### Visual
29. **The hero illustration is generic.** The blank-bar card and calendar look like a template. It's hidden on mobile anyway. Either make it meaningful (e.g. a stylized time-in/time-out log showing the 4 daily entries) or drop it for a tighter, text-led hero.
30. **The scroll progress bar adds little.** The brief says to add one only if it "demonstrably improves usability". On a mostly collapsed FAQ list it doesn't, so consider removing it.
31. **Big empty band before the FAQ library.** Between the Leave preview card and "THE FAQ LIBRARY" there are about 190px of section padding on desktop. Tighten it.
32. **Mouse-driven tilt on the hero illustration.** It's mild and switched off for users who turn on "reduce motion", but the brief warns against "excessive parallax". Keep it subtle or remove it.

### SEO and metadata
33. **No Open Graph image.** Links shared on Messenger or Viber will show no preview. Add a 1200×630 `opengraph-image`.
34. **The favicon is the full seal as a JPG** and turns into an unreadable blur at 16px. Generate proper PNG/SVG favicons from an authorized asset.
35. **Structured data.** Add `FAQPage` JSON-LD, which only helps once answers are actually in the page (item 1).
36. **No `robots.txt`, `sitemap.xml`, or `metadataBase`/canonical URL.** Set these once the production domain is known.

### Housekeeping
37. **Stale server.** An old `next start` server is still running on port 3000 and showing an outdated build. Stop it to avoid confusion; port 3001 is your dev server.
38. **Hydration warning suppression is global.** `suppressHydrationWarning` on `<html>`/`<body>` is the standard workaround for extensions like Grammarly. It only covers attributes on those two tags, so that's fine, but keep it in mind when debugging.
39. **Outdated screenshots.** `desktop-preview.png`/`mobile-preview.png` in the repo root are outputs of the smoke test and are now stale. Commit fresh ones or add them to `.gitignore`.

---

## What's already good (keep)
- All 15 questions, answers and 4 reminders match the source; FAQ counts come from a single dataset.
- No horizontal overflow from 320px to 1440px. The mobile menu, skip link and focus rings work.
- Questions open and close with the keyboard and expose the correct expanded/collapsed state to screen readers.
- Leave content is honestly marked as pending, not invented.
- Animation respects users who turn on "reduce motion", and nothing loops forever.
- A clear typographic hierarchy and a restrained use of the DOLE colors.

## Suggested order of work
1. Items 1, 3, 5: findability, no-JavaScript rendering, contrast (about half a day).
2. Item 4 (glance qualifiers) and the decision on item 2 (search).
3. Items 6–9: get leave content, the issuance reference, review date, HR contact and sign-off from HR (this is waiting on other people, so start the requests now).
4. Items 11–13, 15, 18: heading levels, mobile chips, data-driven labels, tests.
5. The P2 polish items as time allows.
