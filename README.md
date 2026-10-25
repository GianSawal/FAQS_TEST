# DOLE Central Luzon FAQ website

An informational personnel reference built from `WEBSITE CREATION.docx`. The site contains the source's 15 FAQs and four reminders. Leave administration is labeled as pending HR verification.

## Run locally

```powershell
npm install
npm run dev
```

Open <http://localhost:3000>.

## Check the site

```powershell
npm run lint
npm run typecheck
npm run build
```

With the local server running, `npm run test:smoke` checks search, native answer panels, keyboard operation, topic filters, sequential browsing, the mobile menu, no-JavaScript reading, and viewport overflow. The smoke test uses installed Microsoft Edge in headless mode. Set `SITE_URL` if the server uses a port other than 3000.

FAQ wording is maintained in `src/data/faqs.ts`. Changes to policy answers should be checked against a verified source by the designated HR/policy owner before publication.
