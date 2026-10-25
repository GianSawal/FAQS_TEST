"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, MotionConfig, motion, useIsPresent, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue, type Variants } from "framer-motion";
import { ArrowDown, ArrowRight, ArrowUp, ArrowUpRight, BriefcaseBusiness, Check, ChevronDown, ClipboardCheck, Clock3, FileClock, Fingerprint, Menu, Search, ShieldCheck, X } from "lucide-react";
import { categories, faqCount, type FAQCategory } from "@/data/faqs";

const categoryIcons = [Clock3, Fingerprint, FileClock, BriefcaseBusiness];
/** Key figures taken from the FAQ answers they link to. */
const glance = [
  { value: 40, unit: "hours", label: "Required workweek, excluding lunch", href: "#work-schedule-1" },
  { value: 4, unit: "entries", label: "Per regular onsite workday, unless another authorized arrangement applies", href: "#attendance-recording-1" },
  { value: 5, unit: "working days", label: "After DTR receipt or availability, unless another deadline is announced", href: "#daily-time-record-1" }
];
const navLinks = [
  { label: "Home", href: "#top", resets: true },
  { label: "Browse FAQs", href: "#faqs", resets: true },
  { label: "Categories", href: "#categories", resets: false }
];
const titleParts = [
  { text: "UPDATED GUIDELINES ON", accent: false },
  { text: "ATTENDANCE MONITORING", accent: true },
  { text: "AND LEAVE ADMINISTRATION", accent: false }
];

const ease = [0.22, 1, 0.36, 1] as const;
const fadeUp: Variants = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } } };
const wordReveal: Variants = { hidden: { opacity: 0, y: "0.35em", filter: "blur(8px)" }, show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6, ease } } };
const stagger = (each = 0.08, delay = 0): Variants => ({ hidden: {}, show: { transition: { staggerChildren: each, delayChildren: delay } } });
const inView = { initial: false, whileInView: "show", viewport: { once: true, amount: 0.2 } } as const;
const tap = { scale: 0.97 };

function Logo({ small = false }: { small?: boolean }) {
  return <Image className={small ? "logo-image logo-image-small" : "logo-image"} src="/images/dole.jpg" alt="DOLE Central Luzon seal" width={58} height={58} priority={!small} />;
}

function CountUp({ to }: { to: number }) {
  return <span>{to}</span>;
}

function trackSpotlight(event: React.PointerEvent<HTMLElement>) {
  const rect = event.currentTarget.getBoundingClientRect();
  event.currentTarget.style.setProperty("--mx", `${event.clientX - rect.left}px`);
  event.currentTarget.style.setProperty("--my", `${event.clientY - rect.top}px`);
}

/** Hidden from assistive tech while its exit animation plays, so it reads as closed immediately. */
function MobileNav({ onNavigate }: { onNavigate: (resets: boolean) => void }) {
  const isPresent = useIsPresent();
  return <motion.nav className="mobile-nav" id="mobile-navigation" aria-label="Mobile navigation" aria-hidden={!isPresent || undefined} inert={!isPresent}
    initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10, transition: { duration: 0.16 } }} transition={{ duration: 0.28, ease }}>
    <motion.div className="mobile-nav-links" variants={stagger(0.05, 0.05)} initial="hidden" animate="show">
      {navLinks.map((link) => <motion.a key={link.href} href={link.href} variants={fadeUp} onClick={() => onNavigate(link.resets)}>{link.label}</motion.a>)}
    </motion.div>
  </motion.nav>;
}

function HeroVisual({ pointerX, pointerY }: { pointerX: MotionValue<number>; pointerY: MotionValue<number> }) {
  const backX = useTransform(pointerX, (value) => value * -10);
  const backY = useTransform(pointerY, (value) => value * -10);
  const midX = useTransform(pointerX, (value) => value * 16);
  const midY = useTransform(pointerY, (value) => value * 12);
  const frontX = useTransform(pointerX, (value) => value * 30);
  const frontY = useTransform(pointerY, (value) => value * 24);

  return <div className="hero-visual" aria-hidden="true">
    <motion.div className="visual-layer" style={{ x: backX, y: backY }}>
      <motion.div className="visual-orbit visual-orbit-one" initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.1, ease }} />
      <motion.div className="visual-orbit visual-orbit-two" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.1, delay: 0.1, ease }} />
    </motion.div>
    <motion.div className="visual-layer" style={{ x: midX, y: midY }}>
      <motion.div className="visual-card visual-card-main" initial={{ opacity: 0, y: 48, rotate: 0 }} animate={{ opacity: 1, y: 0, rotate: -6 }} whileHover={{ rotate: -3, y: -6 }} transition={{ duration: 0.9, delay: 0.3, ease }}>
        <div className="visual-card-top"><span className="visual-seal"><ClipboardCheck size={22} /></span><span className="visual-lines"><i /><i /></span></div>
        <div className="visual-rule" />
        {[0, 1, 2].map((row) => <div className="visual-check" key={row}>
          <motion.span className="visual-check-icon" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 420, damping: 22, delay: 0.95 + row * 0.18 }}><Check size={14} /></motion.span>
          <motion.span className="visual-bar" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.5, ease, delay: 1 + row * 0.18 }} />
        </div>)}
        <div className="visual-card-foot"><span /><span /></div>
      </motion.div>
    </motion.div>
    <motion.div className="visual-layer" style={{ x: frontX, y: frontY }}>
      <motion.div className="visual-card visual-card-calendar" initial={{ opacity: 0, y: -30, rotate: 0 }} animate={{ opacity: 1, y: 0, rotate: 9 }} transition={{ duration: 0.9, delay: 0.5, ease }}>
        <div className="calendar-rings"><i /><i /></div>
        <div className="calendar-grid">{Array.from({ length: 12 }, (_, index) => index === 7
          ? <motion.span key={index} className="marked" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 380, damping: 18, delay: 1.5 }} />
          : <span key={index} />)}</div>
      </motion.div>
      <motion.div className="visual-stamp" initial={{ opacity: 0, scale: 0.6, rotate: -8 }} animate={{ opacity: 1, scale: 1, rotate: 5 }} transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.75 }}>
        <ShieldCheck size={23} /><span>PERSONNEL<br />REFERENCE</span>
      </motion.div>
    </motion.div>
  </div>;
}

export function FaqSite() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();
  const visibleCategories = useMemo(() => categories
    .filter((category) => !selectedCategory || category.id === selectedCategory)
    .map((category) => ({ ...category, faqs: category.faqs.filter((faq) => {
      const term = query.trim().toLocaleLowerCase();
      return !term || [faq.question, faq.answer, ...(faq.keywords ?? [])].some((text) => text.toLocaleLowerCase().includes(term));
    }) }))
    .filter((category) => category.faqs.length > 0), [query, selectedCategory]);
  const resultCount = visibleCategories.reduce((sum, category) => sum + category.faqs.length, 0);
  const showLeave = !selectedCategory && (!query || /leave|administration/i.test(query));
  const resultsTitle = query ? `Results for “${query}”` : selectedCategory ? categories.find((category) => category.id === selectedCategory)?.title : "All questions";
  const resultsMeta = query || selectedCategory ? `${resultCount} ${resultCount === 1 ? "answer" : "answers"}` : `${faqCount} answers in ${categories.length} topics`;

  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });
  useMotionValueEvent(scrollY, "change", (value) => {
    setScrolled(value > 8);
    setShowTop(value > 900);
  });

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(pointerX, { stiffness: 90, damping: 18 });
  const smoothY = useSpring(pointerY, { stiffness: 90, damping: 18 });

  function trackHeroPointer(event: React.PointerEvent<HTMLElement>) {
    if (reduceMotion || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - rect.left) / rect.width - 0.5);
    pointerY.set((event.clientY - rect.top) / rect.height - 0.5);
  }

  useEffect(() => {
    function openHash() {
      const id = decodeURIComponent(window.location.hash.slice(1));
      const category = categories.find((item) => item.faqs.some((faq) => faq.id === id));
      if (!category) return;
      setSelectedCategory(null);
      setQuery("");
      window.setTimeout(() => {
        const item = document.getElementById(id) as HTMLDetailsElement | null;
        if (item) { item.open = true; item.scrollIntoView({ block: "center" }); }
      }, 80);
    }
    openHash();
    window.addEventListener("hashchange", openHash);
    return () => window.removeEventListener("hashchange", openHash);
  }, []);

  useEffect(() => {
    function focusSearch(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        document.getElementById("faq-search")?.focus();
      }
    }
    window.addEventListener("keydown", focusSearch);
    return () => window.removeEventListener("keydown", focusSearch);
  }, []);

  function openFaq(id: string) {
    const item = document.getElementById(id) as HTMLDetailsElement | null;
    if (!item) return;
    item.open = true;
    window.history.replaceState(null, "", `#${id}`);
    item.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
    item.querySelector("summary")?.focus({ preventScroll: true });
  }

  function toggleAll(open: boolean) {
    document.querySelectorAll<HTMLDetailsElement>(".faq-content details.faq-item").forEach((item) => { item.open = open; });
  }

  function selectCategory(id: string | null) {
    setSelectedCategory(id);
    setQuery("");
    setMenuOpen(false);
    window.setTimeout(() => document.getElementById("faqs")?.scrollIntoView({ behavior: "smooth" }), 0);
  }

  function browseAll() {
    setSelectedCategory(null);
    setQuery("");
    setMenuOpen(false);
  }

  function handleNav(resets: boolean) {
    if (resets) browseAll();
    else setMenuOpen(false);
  }

  return <MotionConfig reducedMotion="user">
    <motion.div className="scroll-progress" style={{ scaleX: progress }} aria-hidden="true" />
    <a className="skip-link" href="#main">Skip to content</a>
    <header className={scrolled ? "site-header is-scrolled" : "site-header"} id="top">
      <div className="container header-inner">
        <a className="brand" href="#top" aria-label="DOLE Central Luzon, back to top" onClick={browseAll}>
          <Logo />
          <span><strong>DOLE Central Luzon</strong><small>Guidelines & FAQs</small></span>
        </a>
        <nav className="desktop-nav" aria-label="Primary navigation" onPointerLeave={() => setHoveredNav(null)}>
          {navLinks.map((link) => <a key={link.href} href={link.href} onPointerEnter={() => setHoveredNav(link.href)} onFocus={() => setHoveredNav(link.href)} onClick={() => handleNav(link.resets)}>
            {hoveredNav === link.href && <motion.span className="nav-pill" layoutId="nav-pill" transition={{ type: "spring", stiffness: 500, damping: 38 }} />}
            <span className="nav-label">{link.label}</span>
          </a>)}
        </nav>
        <motion.button className="menu-button" type="button" whileTap={tap} aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => setMenuOpen(!menuOpen)}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.span key={menuOpen ? "close" : "open"} className="menu-icon" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.16 }}>
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </motion.span>
          </AnimatePresence>
        </motion.button>
      </div>
      <AnimatePresence>{menuOpen && <MobileNav onNavigate={handleNav} />}</AnimatePresence>
    </header>

    <main id="main">
      <section className="hero" aria-labelledby="page-title" onPointerMove={trackHeroPointer} onPointerLeave={() => { pointerX.set(0); pointerY.set(0); }}>
        <div className="hero-backdrop" aria-hidden="true"><span className="hero-glow hero-glow-blue" /><span className="hero-glow hero-glow-gold" /></div>
        <div className="container hero-grid">
          <motion.div className="hero-copy" variants={stagger(0.12)} initial={false} animate="show">
            <motion.p className="eyebrow" variants={fadeUp}><span className="eyebrow-line" /> DOLE CENTRAL LUZON <span className="eyebrow-separator">/</span> PERSONNEL REFERENCE GUIDE</motion.p>
            <motion.h1 id="page-title" variants={stagger(0.05)}>
              {titleParts.map((part, partIndex) => <span key={part.text}>
                {partIndex > 0 && " "}
                {part.text.split(" ").map((word, index) => <span key={word}>
                  {index > 0 && " "}
                  <motion.span className={part.accent ? "word accent" : "word"} variants={wordReveal}>{word}</motion.span>
                </span>)}
              </span>)}
            </motion.h1>
            <motion.p className="hero-description" variants={fadeUp}>Your quick guide to work schedules, attendance records, official business, and leave-related guidelines.</motion.p>
            <motion.div className="hero-actions" variants={fadeUp}>
              <motion.a className="button button-primary" href="#faqs" onClick={browseAll} whileHover={{ y: -2 }} whileTap={tap}>Browse all {faqCount} FAQs <ArrowDown size={18} /></motion.a>
              <motion.a className="button button-ghost" href="#categories" whileHover={{ y: -2 }} whileTap={tap}>Explore topics <ArrowRight size={17} /></motion.a>
            </motion.div>
            <motion.div className="hero-glance-wrap" variants={fadeUp}>
              <p className="glance-heading" id="glance-heading">AT A GLANCE</p>
              <motion.ul className="hero-glance" aria-labelledby="glance-heading" variants={stagger(0.08, 0.1)}>
                {glance.map((item) => <motion.li key={item.href} variants={fadeUp}>
                  <a className="glance-item" href={item.href}>
                    <span className="glance-value"><CountUp to={item.value} /><small>{item.unit}</small></span>
                    <span className="glance-label">{item.label}</span>
                    <ArrowUpRight className="glance-arrow" size={16} aria-hidden="true" />
                  </a>
                </motion.li>)}
              </motion.ul>
            </motion.div>
          </motion.div>
          <HeroVisual pointerX={smoothX} pointerY={smoothY} />
        </div>
      </section>

      <section className="category-section section-space" id="categories" aria-labelledby="category-heading">
        <div className="container">
          <motion.div className="section-heading" variants={stagger(0.1)} {...inView}>
            <motion.p className="section-kicker" variants={fadeUp}>FIND YOUR TOPIC</motion.p>
            <motion.h2 id="category-heading" variants={fadeUp}>Guidance, organized around your workday.</motion.h2>
            <motion.p variants={fadeUp}>Choose a topic to focus the questions below, or browse all {faqCount} answers.</motion.p>
          </motion.div>
          <motion.div className="category-grid" variants={stagger(0.08)} {...inView}>{categories.map((category, index) => {
            const Icon = categoryIcons[index];
            return <motion.button className="category-card" type="button" key={category.id} variants={fadeUp} whileHover={{ y: -5 }} whileTap={{ scale: 0.985 }} transition={{ type: "spring", stiffness: 400, damping: 30 }} onPointerMove={trackSpotlight} onClick={() => selectCategory(category.id)}>
              <span className="category-icon"><Icon size={27} strokeWidth={1.8} /></span>
              <span className="category-content"><span className="category-title">{category.title}</span><span className="category-description">{category.description}</span><span className="category-count">{category.faqs.length} FAQs</span></span>
              <ArrowUpRight className="category-arrow" size={20} />
            </motion.button>;
          })}</motion.div>
          <motion.div className="leave-preview" variants={fadeUp} {...inView}><div className="leave-icon"><FileClock size={23} /></div><div><strong>Leave Administration</strong><p>Leave administration FAQs will be published once verified and approved.</p></div><span>COMING SOON</span></motion.div>
        </div>
      </section>

      <section className="faq-section section-space" id="faqs" aria-labelledby="faq-heading">
        <div className="container">
          <motion.div className="faq-section-heading" variants={stagger(0.1)} initial={false}>
            <motion.p className="section-kicker" variants={fadeUp}>THE FAQ LIBRARY</motion.p>
            <motion.h2 id="faq-heading" variants={fadeUp}>Questions first. Answers when you need them.</motion.h2>
            <motion.p variants={fadeUp}>Scan the questions, search a term, then open the answer you need. For official interpretation, consult the current signed issuances and your authorized HR/personnel office.</motion.p>
          </motion.div>
          <div className="faq-search-panel">
            <label htmlFor="faq-search"><Search size={19} aria-hidden="true" /><span>Search this guide</span></label>
            <div className="faq-search-field">
              <input id="faq-search" type="search" value={query} onChange={(event) => { setQuery(event.target.value); setSelectedCategory(null); }} placeholder="Try DTR, biometric, overtime, OB, or FWA" autoComplete="off" />
              <span className="faq-search-shortcut" aria-hidden="true">Ctrl / ⌘ K</span>
            </div>
          </div>
          <div className="faq-layout">
            <aside className="faq-sidebar" aria-label="FAQ categories"><div className="sidebar-inner">
              <p className="sidebar-label">BROWSE BY TOPIC</p>
              {[{ id: null, title: "All questions", count: faqCount }, ...categories.map((category) => ({ id: category.id, title: category.title, count: category.faqs.length }))].map((item) => {
                const active = selectedCategory === item.id;
                return <button className={active ? "sidebar-link active" : "sidebar-link"} type="button" key={item.id ?? "all"} aria-pressed={active} onClick={() => selectCategory(item.id)}>
                  {active && <motion.span className="sidebar-indicator" layoutId="sidebar-indicator" transition={{ type: "spring", stiffness: 480, damping: 40 }} />}
                  <span>{item.title}</span><span>{item.count}</span>
                </button>;
              })}
            </div></aside>
            <div className="faq-content">
              <div className="results-bar">
                <div>
                  <motion.strong key={resultsTitle} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, ease }}>{resultsTitle}</motion.strong>
                  <motion.span key={resultsMeta} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25, delay: 0.05 }}>{resultsMeta}</motion.span>
                </div>
                <div className="faq-list-actions">
                  <button type="button" onClick={() => toggleAll(true)}>Expand all</button>
                  <button type="button" onClick={() => toggleAll(false)}>Collapse all</button>
                  {(selectedCategory || query) && <button type="button" onClick={() => { setSelectedCategory(null); setQuery(""); }}>Clear filters <X size={15} /></button>}
                </div>
              </div>
              {visibleCategories.map((category: FAQCategory) => {
                const Icon = categoryIcons[categories.findIndex((item) => item.id === category.id)];
                return <section className="faq-group" key={category.id} aria-labelledby={`${category.id}-heading`}>
                  <div className="faq-group-head"><span className="faq-group-icon"><Icon size={22} strokeWidth={1.8} /></span><div><p>{category.id === "work-schedule" ? "WORK SCHEDULE" : "RECORDS OF ATTENDANCE"}</p><h3 id={`${category.id}-heading`}>{category.title}</h3></div><span className="group-count">{category.faqs.length} {category.faqs.length === 1 ? "QUESTION" : "QUESTIONS"}</span></div>
                  <div className="accordion-list">
                    {category.faqs.map((faq, index) => <details className="faq-item" id={faq.id} key={faq.id}>
                      <summary className="faq-trigger"><span className="faq-question-index" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><h4>{faq.question}</h4><span className="faq-reveal"><span className="faq-reveal-open">Read answer</span><span className="faq-reveal-close">Close answer</span><ChevronDown size={18} aria-hidden="true" /></span></summary>
                      <div className="faq-answer"><div className="faq-answer-content"><span className="faq-answer-mark" aria-hidden="true"><Icon size={24} strokeWidth={1.7} /></span><p>{faq.answer}</p></div>{category.faqs[index + 1] && <div className="faq-answer-actions"><button type="button" onClick={() => openFaq(category.faqs[index + 1].id)}>Next question <ArrowRight size={15} /></button></div>}</div>
                    </details>)}
                  </div>
                  <div className="remember-note"><span className="remember-icon"><Check size={17} /></span><p><strong>Remember</strong><br />{category.remember}</p></div>
                  <a className="back-to-top" href="#top">Back to top <ArrowRight size={15} /></a>
                </section>;
              })}
              {!visibleCategories.length && !showLeave && <div className="empty-state"><Search size={26} /><h3>No matching answers found</h3><p>Try another term, or clear the search to browse all questions.</p><button type="button" onClick={() => setQuery("")}>Show all FAQs <ArrowRight size={16} /></button></div>}
              {showLeave && <motion.div className="leave-notice" id="leave-administration" variants={fadeUp} {...inView}><span className="leave-notice-icon"><FileClock size={21} /></span><div><h3>Leave Administration</h3><p>Additional leave administration questions will appear here after HR verification.</p></div></motion.div>}
            </div>
          </div>
        </div>
      </section>

      <section className="verification"><motion.div className="container verification-inner" variants={fadeUp} {...inView}><ShieldCheck size={27} /><div><h2>A note on official guidance</h2><p>This website is an informational reference. For official interpretation or approval, consult the current signed DOLE issuances and your authorized HR/personnel office.</p></div></motion.div></section>
    </main>
    <footer className="site-footer"><div className="container footer-inner"><div className="footer-brand"><Logo small /><div><strong>DOLE Central Luzon</strong><span>Attendance Monitoring & Leave Administration FAQs</span></div></div><nav aria-label="Footer navigation"><a href="#top">Home</a><a href="#categories">Categories</a><a href="#faqs">Browse FAQs</a></nav></div></footer>

    <AnimatePresence>{showTop && <motion.button className="floating-top" type="button" aria-label="Scroll to top" initial={{ opacity: 0, y: 16, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 16, scale: 0.9 }} whileHover={{ y: -3 }} whileTap={tap} transition={{ type: "spring", stiffness: 400, damping: 28 }} onClick={() => window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" })}><ArrowUp size={20} /></motion.button>}</AnimatePresence>
  </MotionConfig>;
}

