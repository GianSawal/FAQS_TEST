"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, MotionConfig, animate, useInView, motion, useDragControls, useIsPresent, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue, type Variants } from "framer-motion";
import { ArrowRight, ArrowUp, ArrowUpRight, BriefcaseBusiness, Check, ChevronDown, ClipboardCheck, Clock3, FileClock, Fingerprint, Menu, Search, ShieldCheck, X, type LucideIcon } from "lucide-react";
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

/** Myth-or-fact statements; each verdict and note is taken from the linked FAQ answer. */
const quiz = [
  { statement: "With an approved FWA, I can choose my own working hours.", fact: false, note: "You must follow the work schedule approved for you, plus the rules on attendance and reporting.", faq: "work-schedule-3" },
  { statement: "Working past my regular hours automatically earns overtime pay.", fact: false, note: "Overtime needs approval first, and must follow the rules before pay or time credits apply.", faq: "work-schedule-4" },
  { statement: "Employees on an approved FWA still need to record their attendance.", fact: true, note: "Yes, unless another authorized attendance monitoring arrangement applies.", faq: "attendance-recording-4" },
  { statement: "I have five working days to submit my validated DTR.", fact: true, note: "Counted from when you receive it or it becomes available, unless another deadline is announced.", faq: "daily-time-record-1" },
  { statement: "I can write my attendance entries by hand whenever I want.", fact: false, note: "Only if the system is unavailable or there is another valid reason, with proof and validation.", faq: "daily-time-record-3" },
  { statement: "I need approval before going on official business (OB).", fact: true, note: "Yes, except in emergencies when getting prior approval isn't possible.", faq: "official-business-1" }
];
const popularSearches = ["DTR", "Biometric", "Overtime", "OB", "FWA"];

const ease = [0.22, 1, 0.36, 1] as const;
const fadeUp: Variants = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } } };
const wordReveal: Variants = { hidden: { opacity: 0, y: "0.35em" }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } } };
const stagger = (each = 0.08, delay = 0): Variants => ({ hidden: {}, show: { transition: { staggerChildren: each, delayChildren: delay } } });
const inView = { initial: "hidden", whileInView: "show", viewport: { once: true, amount: 0.2 } } as const;
const tap = { scale: 0.97 };

function Logo({ small = false }: { small?: boolean }) {
  return <Image className={small ? "logo-image logo-image-small" : "logo-image"} src="/images/dole.jpg" alt="DOLE Central Luzon seal" width={58} height={58} priority={!small} />;
}

/** Counts 0 → `to` once on first view; renders the final value on the server and with reduced motion. */
function CountUp({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const seen = useInView(ref, { once: true });
  const reduceMotion = useReducedMotion();
  useEffect(() => {
    if (!seen || reduceMotion || !ref.current) return;
    const node = ref.current;
    const controls = animate(0, to, { duration: 1.2, ease, delay: 0.3, onUpdate: (value) => { node.textContent = String(Math.round(value)); } });
    return () => controls.stop();
  }, [seen, reduceMotion, to]);
  return <span ref={ref}>{to}</span>;
}

/** Brief highlight on the FAQ a link or "Next question" lands on. */
function flash(item: HTMLElement) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  animate(item, { boxShadow: ["0 0 0 0 rgba(37,99,235,0)", "0 0 0 5px rgba(37,99,235,.28)", "0 0 0 0 rgba(37,99,235,0)"] }, { duration: 1.1, ease });
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

/** "Myth or fact?" quick check; "Read full answer" links open the FAQ popup via the URL hash. */
function MythOrFact() {
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const nextRef = useRef<HTMLButtonElement>(null);
  const done = index >= quiz.length;
  const item = quiz[Math.min(index, quiz.length - 1)];
  const correct = picked === item.fact;

  useEffect(() => { if (picked !== null) nextRef.current?.focus({ preventScroll: true }); }, [picked]);

  function answer(fact: boolean) {
    if (picked !== null) return;
    setPicked(fact);
    if (fact === item.fact) setScore((value) => value + 1);
  }
  function next() { setPicked(null); setIndex((value) => value + 1); }
  function restart() { setPicked(null); setScore(0); setIndex(0); }

  return <section className="quiz-section section-space" id="quick-check" aria-labelledby="quiz-heading">
    <div className="container quiz-grid">
      <motion.div className="quiz-intro" variants={stagger(0.1)} {...inView}>
        <motion.p className="section-kicker" variants={fadeUp}>QUICK CHECK</motion.p>
        <motion.h2 id="quiz-heading" variants={fadeUp}>Myth or fact?</motion.h2>
        <motion.p variants={fadeUp}>Six common assumptions about schedules, attendance, and official business. See how many you get right.</motion.p>
        <motion.div className="quiz-progress" variants={fadeUp} aria-hidden="true">{quiz.map((_, step) => <span key={step} className={step < index ? "is-done" : step === index ? "is-current" : undefined} />)}</motion.div>
      </motion.div>
      <motion.div className="quiz-stage" aria-live="polite" variants={fadeUp} {...inView}>
        <AnimatePresence mode="wait" initial={false}>
          {done ? <motion.div key="done" className="quiz-card quiz-done" initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ type: "spring", stiffness: 300, damping: 26 }}>
            <span className="quiz-score"><CountUp to={score} /><small>/{quiz.length}</small></span>
            <h3>{score === quiz.length ? "Perfect score!" : score >= 4 ? "Nicely done." : "Worth a quick review."}</h3>
            <p>Open the topics above for the full answers.</p>
            <motion.button className="quiz-primary" type="button" whileTap={tap} onClick={restart}>Try again <ArrowRight size={15} /></motion.button>
          </motion.div> : <motion.div key={index} className="quiz-card" initial={{ opacity: 0, x: 48, rotate: 2 }} animate={{ opacity: 1, x: 0, rotate: 0 }} exit={{ opacity: 0, x: -48, rotate: -2 }} transition={{ duration: 0.35, ease }}>
            <span className="quiz-count">{index + 1} / {quiz.length}</span>
            <p className="quiz-statement">“{item.statement}”</p>
            {picked === null ? <div className="quiz-actions">
              <motion.button className="quiz-btn is-myth" type="button" whileHover={{ y: -2 }} whileTap={tap} onClick={() => answer(false)}><X size={18} /> Myth</motion.button>
              <motion.button className="quiz-btn is-fact" type="button" whileHover={{ y: -2 }} whileTap={tap} onClick={() => answer(true)}><Check size={18} /> Fact</motion.button>
            </div> : <motion.div className={correct ? "quiz-verdict is-right" : "quiz-verdict is-wrong"} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease }}>
              <motion.span className="quiz-badge" initial={{ scale: 0.4 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500, damping: 18 }}>{correct ? <Check size={18} /> : <X size={18} />}</motion.span>
              <div>
                <strong>{correct ? "Correct" : "Not quite"}: it’s a {item.fact ? "fact" : "myth"}.</strong>
                <p>{item.note}</p>
                <div className="quiz-links">
                  <a href={`#${item.faq}`}>Read full answer <ArrowUpRight size={14} /></a>
                  <motion.button ref={nextRef} className="quiz-primary" type="button" whileTap={tap} onClick={next}>{index + 1 === quiz.length ? "See my score" : "Next"} <ArrowRight size={15} /></motion.button>
                </div>
              </div>
            </motion.div>}
          </motion.div>}
        </AnimatePresence>
      </motion.div>
    </div>
  </section>;
}

/** Owns its own scroll subscription so showing/hiding it re-renders only this button. */
function ScrollTopButton() {
  const [show, setShow] = useState(false);
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (value) => setShow(value > 900));
  return <AnimatePresence>{show && <motion.button className="floating-top" type="button" aria-label="Scroll to top" initial={{ opacity: 0, y: 16, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 16, scale: 0.9 }} whileHover={{ y: -3 }} whileTap={tap} transition={{ type: "spring", stiffness: 400, damping: 28 }} onClick={() => window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" })}><ArrowUp size={20} /></motion.button>}</AnimatePresence>;
}

type OpenState = { id: string; faq?: string; sheet: boolean; origin: { x: number; y: number } };

/** Id of the FAQ the URL hash points to, if any. */
function faqHashId() {
  const id = decodeURIComponent(window.location.hash.slice(1));
  return categories.some((category) => category.faqs.some((faq) => faq.id === id)) ? id : null;
}

/** Toggles in JS instead of relying on the native <summary> toggle, which some mobile browsers drop on the first tap. */
function toggleItem(event: React.MouseEvent<HTMLElement>) {
  event.preventDefault();
  const item = event.currentTarget.parentElement as HTMLDetailsElement;
  item.open = !item.open;
}

/** Topic popup: grows out of the clicked card on desktop, slides up as a draggable sheet on phones. */
function FaqDialog({ category, Icon, faqId, sheet, origin, onClose }: { category: FAQCategory; Icon: LucideIcon; faqId?: string; sheet: boolean; origin: { x: number; y: number }; onClose: () => void }) {
  const isPresent = useIsPresent();
  const reduceMotion = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const dragControls = useDragControls();

  const openFaq = useCallback((id: string) => {
    const item = document.getElementById(id) as HTMLDetailsElement | null;
    if (!item) return;
    item.open = true;
    window.history.replaceState(null, "", `#${id}`);
    item.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
    item.querySelector("summary")?.focus({ preventScroll: true });
    flash(item);
  }, [reduceMotion]);

  function toggleAll(open: boolean) {
    panelRef.current?.querySelectorAll<HTMLDetailsElement>("details.faq-item").forEach((item) => { item.open = open; });
  }

  // Scroll lock reflows the whole page, so on phones it waits until the sheet has landed.
  useEffect(() => {
    const previous = document.body.style.overflow;
    panelRef.current?.focus({ preventScroll: true });
    const timer = window.setTimeout(() => { document.body.style.overflow = "hidden"; }, sheet ? 420 : 0);
    return () => { window.clearTimeout(timer); document.body.style.overflow = previous; };
  }, [sheet]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") { onClose(); return; }
      if (event.key !== "Tab" || !panelRef.current) return;
      const focusable = Array.from(panelRef.current.querySelectorAll<HTMLElement>("button, summary, a[href]"));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      if (event.shiftKey && (active === first || active === panelRef.current)) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && active === last) { event.preventDefault(); first.focus(); }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    if (!faqId) return;
    const timer = window.setTimeout(() => openFaq(faqId), 420);
    return () => window.clearTimeout(timer);
  }, [faqId, openFaq]);

  const from = sheet ? { y: "100%" } : { opacity: 0, scale: 0.9, x: origin.x, y: origin.y };
  return <>
    <motion.div className="dialog-backdrop" onClick={onClose} aria-hidden="true" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} />
    <div className="dialog-layer">
      <motion.div ref={panelRef} className={sheet ? "dialog-panel is-sheet" : "dialog-panel"} role="dialog" aria-modal="true" aria-labelledby="dialog-title" tabIndex={-1} style={{ pointerEvents: isPresent ? undefined : "none" }}
        initial={sheet ? false : from} animate={sheet ? { y: 0 } : { opacity: 1, scale: 1, x: 0, y: 0 }} exit={{ ...from, transition: { duration: 0.22, ease } }} transition={{ type: "spring", stiffness: 320, damping: 34 }}
        drag={sheet ? "y" : false} dragControls={dragControls} dragListener={false} dragConstraints={{ top: 0, bottom: 0 }} dragElastic={{ top: 0, bottom: 0.6 }}
        onDragEnd={(_, info) => { if (info.offset.y > 110 || info.velocity.y > 600) onClose(); }}>
        <div className="dialog-head">
          {sheet && <div className="dialog-handle" aria-hidden="true" onPointerDown={(event) => dragControls.start(event)}><span /></div>}
          <div className="dialog-title-row">
            <span className="faq-group-icon"><Icon size={22} strokeWidth={1.8} /></span>
            <div><p>{category.faqs.length} {category.faqs.length === 1 ? "QUESTION" : "QUESTIONS"}</p><h3 id="dialog-title">{category.title}</h3></div>
            <motion.button className="dialog-close" type="button" aria-label="Close" whileTap={tap} onClick={onClose}><X size={20} /></motion.button>
          </div>
          <p className="dialog-desc">{category.description}</p>
          <div className="faq-list-actions"><button type="button" onClick={() => toggleAll(true)}>Expand all</button><button type="button" onClick={() => toggleAll(false)}>Collapse all</button></div>
        </div>
        <motion.div className="dialog-body" variants={stagger(0.06, 0.15)} initial={sheet ? false : "hidden"} animate="show">
          <div className="accordion-list">
            {category.faqs.map((faq, index) => <motion.details className="faq-item" id={faq.id} key={faq.id} variants={fadeUp}>
              <summary className="faq-trigger" onClick={toggleItem}><span className="faq-question-index" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><h4>{faq.question}</h4><span className="faq-reveal"><span className="faq-reveal-open">Read answer</span><span className="faq-reveal-close">Close answer</span><ChevronDown size={18} aria-hidden="true" /></span></summary>
              <div className="faq-answer"><div className="faq-answer-content"><span className="faq-answer-mark" aria-hidden="true"><Icon size={24} strokeWidth={1.7} /></span><p>{faq.answer}</p></div>{category.faqs[index + 1] && <div className="faq-answer-actions"><button type="button" onClick={() => openFaq(category.faqs[index + 1].id)}>Next question <ArrowRight size={15} /></button></div>}</div>
            </motion.details>)}
          </div>
          <motion.div className="remember-note" variants={fadeUp}><span className="remember-icon"><Check size={17} /></span><p><strong>Remember</strong><br />{category.remember}</p></motion.div>
        </motion.div>
      </motion.div>
    </div>
  </>;
}

export function FaqSite() {
  const [open, setOpen] = useState<OpenState | null>(null);
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const reduceMotion = useReducedMotion();
  const term = query.trim().toLocaleLowerCase();
  const matches = useMemo(() => !term ? [] : categories.flatMap((category, index) => category.faqs
    .filter((faq) => [faq.question, faq.answer, ...(faq.keywords ?? [])].some((text) => text.toLocaleLowerCase().includes(term)))
    .map((faq) => ({ faq, category, Icon: categoryIcons[index] }))), [term]);
  const activeIndex = open ? categories.findIndex((category) => category.id === open.id) : -1;

  const { scrollY, scrollYProgress } = useScroll();
  // Toggled on the DOM directly: a state update here would re-render the whole page mid-scroll.
  useMotionValueEvent(scrollY, "change", (value) => { headerRef.current?.classList.toggle("is-scrolled", value > 8); });

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

  const openDialog = useCallback((id: string, faq?: string, trigger?: HTMLElement) => {
    const rect = trigger?.getBoundingClientRect();
    triggerRef.current = trigger ?? null;
    setOpen({
      id, faq,
      sheet: window.matchMedia("(max-width: 620px)").matches,
      origin: rect ? { x: rect.left + rect.width / 2 - window.innerWidth / 2, y: rect.top + rect.height / 2 - window.innerHeight / 2 } : { x: 0, y: 24 }
    });
  }, []);

  const closeDialog = useCallback(() => {
    setOpen(null);
    if (faqHashId()) window.history.replaceState(null, "", window.location.pathname + window.location.search);
    triggerRef.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    function openHash() {
      const id = faqHashId();
      const category = categories.find((item) => item.faqs.some((faq) => faq.id === id));
      if (!id || !category) return;
      setQuery("");
      openDialog(category.id, id);
    }
    openHash();
    window.addEventListener("hashchange", openHash);
    return () => window.removeEventListener("hashchange", openHash);
  }, [openDialog]);

  useEffect(() => {
    function focusSearch(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        if (!open) document.getElementById("faq-search")?.focus();
      }
    }
    window.addEventListener("keydown", focusSearch);
    return () => window.removeEventListener("keydown", focusSearch);
  }, [open]);

  function browseAll() {
    setQuery("");
    setMenuOpen(false);
  }

  /** Scrolls to the search bar and puts the cursor in it, ready to type. */
  function startSearch(event: React.MouseEvent) {
    event.preventDefault();
    document.getElementById("categories")?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
    document.getElementById("faq-search")?.focus({ preventScroll: true });
  }

  function handleNav(resets: boolean) {
    if (resets) browseAll();
    else setMenuOpen(false);
  }

  return <MotionConfig reducedMotion="user">
    <motion.div className="scroll-progress" style={{ scaleX: scrollYProgress }} aria-hidden="true" />
    <a className="skip-link" href="#main">Skip to content</a>
    <header ref={headerRef} className="site-header" id="top">
      <div className="container header-inner">
        <a className="brand" href="#top" aria-label="DOLE Central Luzon, back to top" onClick={browseAll}>
          <Logo />
          <span><strong>DOLE Central Luzon</strong><small>Guidelines & FAQs</small></span>
        </a>
        <nav className="desktop-nav" aria-label="Primary navigation" onPointerLeave={() => setHoveredNav(null)}>
          {navLinks.map((link) => <a key={link.href} href={link.href} onPointerEnter={() => setHoveredNav(link.href)} onFocus={() => setHoveredNav(link.href)} onClick={() => handleNav(link.resets)}>
            {hoveredNav === link.href && <motion.span className="nav-pill" layoutId="nav-pill" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ type: "spring", stiffness: 500, damping: 38 }} />}
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
          <motion.div className="hero-copy" variants={stagger(0.12)} initial="hidden" animate="show">
            <motion.p className="eyebrow" variants={fadeUp}><span className="eyebrow-line" /> DOLE CENTRAL LUZON <span className="eyebrow-separator">/</span> PERSONNEL REFERENCE GUIDE</motion.p>
            <motion.h1 id="page-title" variants={stagger(0.05)}>
              {titleParts.map((part, partIndex) => <span key={part.text} className={`title-line title-line-${partIndex}`}>
                {partIndex > 0 && " "}
                {part.text.split(" ").map((word, index) => <span key={word}>
                  {index > 0 && " "}
                  <motion.span className={part.accent ? "word accent" : "word"} variants={wordReveal}>{word}</motion.span>
                </span>)}
              </span>)}
            </motion.h1>
            <motion.p className="hero-description" variants={fadeUp}>Your quick guide to work schedules, attendance records, official business, and leave-related guidelines.</motion.p>
            <motion.div className="hero-actions" variants={fadeUp}>
              <motion.a className="button button-primary" href="#categories" onClick={startSearch} whileHover={{ y: -2 }} whileTap={tap}>Search the FAQs <Search size={18} /></motion.a>
              <motion.a className="button button-ghost" href="#quick-check" whileHover={{ y: -2 }} whileTap={tap}>Take the quick check <ArrowRight size={17} /></motion.a>
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

      <section className="category-section section-space" id="faqs" aria-labelledby="category-heading">
        <div className="container">
          <motion.div className="section-heading" variants={stagger(0.1)} {...inView}>
            <motion.p className="section-kicker" variants={fadeUp}>FIND YOUR TOPIC</motion.p>
            <motion.h2 id="category-heading" variants={fadeUp}>Guidance, organized around your workday.</motion.h2>
            <motion.p variants={fadeUp}>Choose a topic to open its questions, or search all {faqCount} answers. For official interpretation, consult the current signed issuances and your authorized HR/personnel office.</motion.p>
          </motion.div>
          <div id="categories">
            <div className="faq-search-panel">
              <label htmlFor="faq-search"><Search size={19} aria-hidden="true" /><span>Search this guide</span></label>
              <div className="faq-search-field">
                <input id="faq-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try DTR, biometric, overtime, OB, or FWA" autoComplete="off" />
                <span className="faq-search-shortcut" aria-hidden="true">Ctrl / ⌘ K</span>
              </div>
            </div>
            <div className="search-chips"><span>POPULAR</span>{popularSearches.map((item) => {
              const active = term === item.toLocaleLowerCase();
              return <motion.button className={active ? "search-chip is-active" : "search-chip"} type="button" key={item} aria-pressed={active} whileTap={tap} onClick={() => setQuery(active ? "" : item)}>{item}</motion.button>;
            })}</div>
            {term ? <motion.div className="search-results" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease }}>
              <div className="results-bar">
                <div><strong>Results for “{query.trim()}”</strong><span>{matches.length} {matches.length === 1 ? "answer" : "answers"}</span></div>
                <div className="faq-list-actions"><button type="button" onClick={() => setQuery("")}>Clear search <X size={15} /></button></div>
              </div>
              {matches.length ? <motion.ul className="result-list" variants={stagger(0.04)} initial="hidden" animate="show">
                {matches.map(({ faq, category, Icon }) => <motion.li key={faq.id} variants={fadeUp}>
                  <button className="result-item" type="button" aria-haspopup="dialog" onClick={(event) => openDialog(category.id, faq.id, event.currentTarget)}>
                    <span className="result-icon"><Icon size={18} /></span>
                    <span className="result-text"><strong>{faq.question}</strong><small>{category.title}</small></span>
                    <ArrowUpRight size={18} />
                  </button>
                </motion.li>)}
              </motion.ul> : <div className="empty-state"><Search size={26} /><h3>No matching answers found</h3><p>{/leave/i.test(term) ? "Leave administration FAQs will be published once verified and approved." : "Try another term, or clear the search to browse by topic."}</p><button type="button" onClick={() => setQuery("")}>Show all topics <ArrowRight size={16} /></button></div>}
            </motion.div> : <>
              <motion.div className="category-grid" variants={stagger(0.08)} {...inView}>{categories.map((category, index) => {
                const Icon = categoryIcons[index];
                return <motion.button className="category-card" type="button" key={category.id} aria-haspopup="dialog" variants={fadeUp} whileHover={{ y: -5 }} whileTap={{ scale: 0.985 }} transition={{ type: "spring", stiffness: 400, damping: 30 }} onPointerMove={trackSpotlight} onClick={(event) => openDialog(category.id, undefined, event.currentTarget)}>
                  <Icon className="category-watermark" size={170} strokeWidth={1.1} aria-hidden="true" />
                  <span className="category-icon"><Icon size={27} strokeWidth={1.8} /></span>
                  <span className="category-content">
                    <span className="category-title">{category.title}</span>
                    <span className="category-description">{category.description}</span>
                    <span className="category-preview">{category.faqs.slice(0, index % 3 === 0 ? 3 : 2).map((faq) => <span key={faq.id}>{faq.question}</span>)}</span>
                    <span className="category-foot"><span className="category-count">{category.faqs.length} FAQs</span><span className="category-open">Open topic <ArrowRight size={14} /></span></span>
                  </span>
                  <ArrowUpRight className="category-arrow" size={20} />
                </motion.button>;
              })}</motion.div>
              <motion.div className="leave-preview" variants={fadeUp} {...inView}><div className="leave-icon"><FileClock size={23} /></div><div><strong>Leave Administration</strong><p>Leave administration FAQs will be published once verified and approved.</p></div><span>COMING SOON</span></motion.div>
            </>}
          </div>
        </div>
      </section>

      <MythOrFact />

      <section className="verification"><motion.div className="container verification-inner" variants={fadeUp} {...inView}><ShieldCheck size={27} /><div><h2>A note on official guidance</h2><p>This website is an informational reference. For official interpretation or approval, consult the current signed DOLE issuances and your authorized HR/personnel office.</p></div></motion.div></section>
    </main>
    <footer className="site-footer"><div className="container footer-inner"><div className="footer-brand"><Logo small /><div><strong>DOLE Central Luzon</strong><span>Attendance Monitoring & Leave Administration FAQs</span></div></div><nav aria-label="Footer navigation"><a href="#top">Home</a><a href="#categories">Categories</a><a href="#faqs">Browse FAQs</a></nav></div></footer>

    <AnimatePresence>{open && activeIndex >= 0 && <FaqDialog key={open.id} category={categories[activeIndex]} Icon={categoryIcons[activeIndex]} faqId={open.faq} sheet={open.sheet} origin={open.origin} onClose={closeDialog} />}</AnimatePresence>
    <ScrollTopButton />
  </MotionConfig>;
}

