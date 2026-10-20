import React, { useCallback, useEffect, useRef, useState } from 'react';
import { 
  Bot, Hand, Eye, Cpu, Sparkles, Trash2, BatteryCharging, Zap, Globe, 
  MessageSquare, ExternalLink, Menu, X, ArrowUpRight, ShieldCheck, 
  Layers, MapPin, Award, CheckCircle2, ChevronRight
} from 'lucide-react';
import { SplashScreen } from './components/SplashScreen';
import { BrandLogo } from './components/BrandLogo';
import { DigitalAdScreen } from './components/DigitalAdScreen';
import { WebsiteConfigurator } from './components/WebsiteConfigurator';
import { TapTagSection } from './components/TapTagSection';
import { T53Section } from './components/T53Section';
import { Chatbot } from './components/Chatbot';
import { PRODUCTS } from './data/products';
import { Reveal, ScrollProgress, Tilt } from './components/Fx';

// Official WhatsApp Vector Icon
const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.84 9.84 0 0 0 12.04 2m.01 1.67c4.54 0 8.24 3.7 8.24 8.24 0 2.2-.86 4.27-2.42 5.82a8.19 8.19 0 0 1-5.83 2.42c-1.46 0-2.89-.39-4.14-1.13l-.3-.18-3.08.81.82-3-.19-.31c-.81-1.3-1.24-2.81-1.24-4.37 0-4.54 3.7-8.24 8.24-8.24m4.52 11.23c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.66.81-.81.98-.15.17-.3.19-.55.06-.25-.13-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.39-1.72-.15-.25-.02-.38.11-.51.11-.11.25-.29.37-.44.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.76 2.68 4.26 3.76.6.26 1.06.41 1.42.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.07-.1-.23-.17-.48-.3z"/>
  </svg>
);

type Tab = 'all' | 'robotics' | 'hardware';

const TABS: { id: Tab; label: string; match: (category: string) => boolean }[] = [
  { id: 'all', label: 'All projects', match: () => true },
  { id: 'robotics', label: 'Robotics & AI', match: (c) => ['robotics', 'wearable', 'mechatronics', 'ai'].includes(c) },
  { id: 'hardware', label: 'Electronics & devices', match: (c) => ['electronics', 'hardware', 'taptag'].includes(c) },
];

// Order matches the order of the sections on the page.
const NAV_LINKS = [
  { id: 't53', label: 'T53' },
  { id: 'projects', label: 'Projects' },
  { id: 'taptag', label: 'Tap Tag' },
  { id: 'services', label: 'Services' },
  { id: 'milestones', label: 'Milestones' },
  { id: 'contact', label: 'Contact' },
];

const SECTION_TO_NAV: Record<string, string> = {
  t53: 't53', billboard: 'projects', projects: 'projects', taptag: 'taptag',
  'website-studio': '', services: 'services', milestones: 'milestones', contact: 'contact',
};

const WA_START = 'https://wa.me/918149916052?text=Hi%20Adam%2C%20I%20want%20to%20start%20a%20project%20with%20DR53.';

function shouldShowSplash(): boolean {
  try {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
    return sessionStorage.getItem('dr53-splash-seen') !== '1';
  } catch {
    return true;
  }
}

export default function App() {
  const [showSplash, setShowSplash] = useState(shouldShowSplash);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('all');
  const [showWebsiteModal, setShowWebsiteModal] = useState(false);
  const [activeNav, setActiveNav] = useState('');
  const lastFocusRef = useRef<HTMLElement | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  const currentTab = TABS.find((t) => t.id === activeTab) ?? TABS[0];
  const filteredProducts = PRODUCTS.filter((p) => currentTab.match(p.category));

  const openWebsiteModal = useCallback(() => {
    lastFocusRef.current = document.activeElement as HTMLElement | null;
    setMobileMenuOpen(false);
    setShowWebsiteModal(true);
  }, []);

  const closeWebsiteModal = useCallback(() => {
    setShowWebsiteModal(false);
    if (window.location.hash === '#website-builder') {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
    lastFocusRef.current?.focus?.();
  }, []);

  // Deep link: /#website-builder opens the builder (this link is used by the ad screen).
  useEffect(() => {
    const check = () => {
      if (window.location.hash === '#website-builder') setShowWebsiteModal(true);
    };
    check();
    window.addEventListener('hashchange', check);
    return () => window.removeEventListener('hashchange', check);
  }, []);

  // Builder dialog: lock page scroll, move focus in, close on Escape, keep Tab inside.
  useEffect(() => {
    if (!showWebsiteModal) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeBtnRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { closeWebsiteModal(); return; }
      if (e.key !== 'Tab' || !modalRef.current) return;
      const items = modalRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener('keydown', onKey);
    };
  }, [showWebsiteModal, closeWebsiteModal]);

  // Mobile menu closes on Escape.
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMobileMenuOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [mobileMenuOpen]);

  // Highlight the nav item for the section currently on screen.
  useEffect(() => {
    const ids = Object.keys(SECTION_TO_NAV);
    const els = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => !!el);
    if (!('IntersectionObserver' in window) || els.length === 0) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => { if (en.isIntersecting) setActiveNav(SECTION_TO_NAV[en.target.id] ?? ''); });
      },
      { rootMargin: '-35% 0px -60% 0px' }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const finishSplash = useCallback(() => {
    try { sessionStorage.setItem('dr53-splash-seen', '1'); } catch { /* storage unavailable */ }
    setShowSplash(false);
  }, []);

  return (
    <div className="min-h-screen bg-[#030711] text-[#f5f7fb] selection:bg-[#c99a2e] selection:text-black relative">
      
      {/* Splash Screen on Initial Load with Exact Logo */}
      {showSplash && <SplashScreen onComplete={finishSplash} />}

      <ScrollProgress />
      {/* Background Ambience Layers */}
      <div className="fixed inset-0 bg-tech-grid opacity-35 pointer-events-none -z-10" />
      <div className="fixed top-0 left-1/4 w-[600px] h-[500px] bg-[#c99a2e]/10 blur-[140px] rounded-full pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-1/4 w-[600px] h-[500px] bg-[#0c2038]/60 blur-[160px] rounded-full pointer-events-none -z-10" />

      <a href="#main" className="skip-link">Skip to main content</a>

      {/* Navigation Header */}
      <header className="sticky top-0 z-40 w-full border-b border-[rgba(241,202,98,0.2)] bg-[#030711]/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 lg:h-20 flex items-center justify-between gap-4">

          <a href="#" className="flex items-center gap-3 shrink-0" aria-label="Dynamic Robotics 53, back to top">
            <BrandLogo className="w-10 h-10 lg:w-12 lg:h-12" />
            <div>
              <div className="font-bold text-base lg:text-lg tracking-tight text-white">
                Dynamic Robotics <span className="text-[#f1ca62]">53</span>
              </div>
              <span className="text-xs text-zinc-400 block -mt-0.5">Studio · Pune, India</span>
            </div>
          </a>

          <nav aria-label="Main" className="hidden lg:flex items-center gap-1 text-sm">
            {NAV_LINKS.map((l) => (
              <a
                key={l.id}
                href={`#${l.id}`}
                aria-current={activeNav === l.id ? 'location' : undefined}
                className={`nav-link ${activeNav === l.id ? 'nav-link-active' : ''}`}
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button type="button" onClick={openWebsiteModal} className="btn btn-primary hidden sm:inline-flex">
              <Sparkles className="w-4 h-4" aria-hidden="true" />
              Build Your Website
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen((o) => !o)}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
              className="lg:hidden inline-flex items-center justify-center w-11 h-11 rounded-xl bg-white/5 border border-white/10 text-zinc-200 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" aria-hidden="true" /> : <Menu className="w-5 h-5" aria-hidden="true" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <nav
            id="mobile-menu"
            aria-label="Main"
            className="lg:hidden border-t border-white/10 bg-[#06101f]/98 backdrop-blur-2xl px-4 py-4 max-h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain"
          >
            <ul className="flex flex-col">
              {NAV_LINKS.map((l) => (
                <li key={l.id}>
                  <a
                    href={`#${l.id}`}
                    onClick={() => setMobileMenuOpen(false)}
                    aria-current={activeNav === l.id ? 'location' : undefined}
                    className={`flex items-center min-h-12 px-3 rounded-lg text-base font-medium border-b border-white/5 ${activeNav === l.id ? 'text-[#f1ca62]' : 'text-zinc-200'}`}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="pt-4 flex flex-col gap-3">
              <button type="button" onClick={openWebsiteModal} className="btn btn-primary w-full">
                <Sparkles className="w-4 h-4" aria-hidden="true" />
                Build Your Website
              </button>
              <a href={WA_START} target="_blank" rel="noopener noreferrer" className="btn btn-secondary w-full">
                <WhatsAppIcon className="w-4 h-4" />
                Chat with Adam on WhatsApp
              </a>
            </div>
          </nav>
        )}
      </header>

      <main id="main" tabIndex={-1} className="outline-none">

      {/* HERO SECTION */}
      <section className="relative pt-10 pb-12 lg:pt-16 lg:pb-16" aria-labelledby="hero-title">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">

            <div className="lg:col-span-7 space-y-6">
              <p className="hero-in text-sm text-[#f1ca62] font-medium" style={{ ["--d" as string]: "0s" }}>Adam Bhaimia · Engineering studio in Pune, India</p>

              <h1 id="hero-title" style={{ ["--d" as string]: ".1s" }} className="hero-in text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1]">
                Building intelligent machines <span className="text-gradient-animated">and digital systems.</span>
              </h1>

              <p style={{ ["--d" as string]: ".22s" }} className="hero-in text-zinc-300 text-base sm:text-lg max-w-xl leading-relaxed">
                Physical robotics, embedded electronics, AI vision systems, Tap Tag touchless cards, and custom business websites, all built in Pune.
              </p>

              <div style={{ ["--d" as string]: ".34s" }} className="hero-in flex flex-wrap items-center gap-3 pt-1">
                <a href="#projects" className="btn btn-primary btn-shimmer">Explore Robotics Projects</a>
                <button type="button" onClick={openWebsiteModal} className="btn btn-secondary">
                  <Sparkles className="w-4 h-4" aria-hidden="true" />
                  Build Your Website (from ₹5,300)
                </button>
              </div>

              <div style={{ ["--d" as string]: ".46s" }} className="hero-in grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-white/10">
                {[
                  ['7+ Builds', 'Working hardware'],
                  ['BIEA 2026', 'A-Zero milestone'],
                  ['₹5,300', 'Website launch'],
                  ['1:1 Founder', 'Direct WhatsApp'],
                ].map(([value, label]) => (
                  <div key={value} className="space-y-1">
                    <p className="text-xl sm:text-2xl font-bold font-mono text-[#f1ca62]">{value}</p>
                    <p className="text-xs text-zinc-400">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 flex items-center justify-center">
              <div style={{ ["--d" as string]: ".3s" }} className="hero-in relative p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#0c1c30] via-[#06101f] to-black border border-[rgba(241,202,98,0.35)] shadow-[0_20px_70px_rgba(0,0,0,0.6)] max-w-sm w-full">
                <div className="flex flex-col items-center text-center pb-5 border-b border-white/10">
                  <div className="relative mb-3">
                    <div className="absolute -inset-3 rounded-full border border-dashed border-[#f1ca62]/40 animate-spin-slow pointer-events-none" aria-hidden="true" />
                    <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-[#f1ca62] animate-float">
                      <BrandLogo className="w-full h-full" />
                    </div>
                  </div>
                  <span className="text-lg font-bold text-white">
                    Dynamic Robotics <b className="text-[#f1ca62]">53</b>
                  </span>
                  <span className="text-sm text-zinc-400 mt-0.5">Adam Bhaimia · Pune, India</span>
                </div>
                <ul className="pt-3">
                  {[
                    ['Autonomous robotics', '#projects'],
                    ['AI vision inspection', '#projects'],
                    ['Tap Tag device', '#taptag'],
                  ].map(([label, href]) => (
                    <li key={label}>
                      <a href={href} className="flex items-center justify-between rounded-lg px-3 py-3 text-sm text-zinc-200 hover:bg-white/5">
                        {label}
                        <ArrowUpRight className="w-4 h-4 text-[#f1ca62]" aria-hidden="true" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* QUICK START — FRIENDLY LAUNCHER */}
      <section className="dr53-quickstart-wrap" aria-label="Quick start options">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="dr53-quickstart-card">
            <div className="flex flex-col gap-5">
              <div>
                <h2 className=" text-xl sm:text-2xl font-bold text-white">What are you looking to build?</h2>
                <p className="mt-1 text-sm text-zinc-300">Pick the option that matches your idea and jump straight to it.</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 w-full">
                <a href="#projects" className="dr53-quick-action">
                  <Cpu className="w-4 h-4" />
                  <span>Robot / Hardware</span>
                  <ArrowUpRight className="w-3.5 h-3.5 ml-auto opacity-60" />
                </a>
                <a href="#services" className="dr53-quick-action">
                  <Eye className="w-4 h-4" />
                  <span>AI Vision</span>
                  <ArrowUpRight className="w-3.5 h-3.5 ml-auto opacity-60" />
                </a>
                <a href="#taptag" className="dr53-quick-action">
                  <Zap className="w-4 h-4" />
                  <span>Tap Tag</span>
                  <ArrowUpRight className="w-3.5 h-3.5 ml-auto opacity-60" />
                </a>
                <a href="#t53" className="dr53-quick-action dr53-quick-t53">
                  <ShieldCheck className="w-4 h-4" />
                  <span>T53 for Families</span>
                  <ArrowUpRight className="w-3.5 h-3.5 ml-auto opacity-60" />
                </a>
                <button type="button" onClick={openWebsiteModal} className="dr53-quick-action text-left">
                  <Globe className="w-4 h-4" />
                  <span>Build Your Website</span>
                  <ArrowUpRight className="w-3.5 h-3.5 ml-auto opacity-60" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* T53 — FAMILY PHONE PLATFORM */}
      <T53Section />

      {/* CHANGING AD SCREEN (With Actual Photographs & Telemetry) */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 lg:pb-24" id="billboard">
        <DigitalAdScreen />
      </section>

      {/* FEATURED BUILDS PORTFOLIO SECTION (With Actual Photographs) */}
      <section className="relative py-16 lg:py-24 border-t border-[rgba(241,202,98,0.18)]" id="projects">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-sm text-[#f1ca62] block mb-2">Engineering builds and products</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                Real Hardware. <span className="text-[#f1ca62]">Real Systems.</span>
              </h2>
            </div>

            <div role="group" aria-label="Filter projects" className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-black/60 border border-white/10 text-sm">
              {TABS.map((t) => {
                const count = PRODUCTS.filter((p) => t.match(p.category)).length;
                const on = activeTab === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    aria-pressed={on}
                    onClick={() => setActiveTab(t.id)}
                    className={`min-h-10 px-3 py-1.5 rounded-lg transition-colors ${on ? 'bg-[#f1ca62] text-black font-bold' : 'text-zinc-300 hover:text-white'}`}
                  >
                    {t.label} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          {filteredProducts.length === 0 && (
            <p className="text-center text-zinc-300 py-10">
              No projects in this category yet.{' '}
              <button type="button" onClick={() => setActiveTab('all')} className="underline text-[#f1ca62]">Show all projects</button>
            </p>
          )}

          {/* Products Grid with Real Photos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product, idx) => (
              <Reveal key={product.id} delay={(idx % 3) * 0.08}>
              <Tilt className="h-full">
              <div
                className="h-full group relative rounded-2xl bg-gradient-to-b from-[#08172b]/80 to-[#040b15] border border-[rgba(241,202,98,0.2)] hover:border-[#f1ca62] shadow-xl hover:shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_40px_rgba(201,154,46,0.15)] transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                {/* Visual Header with Real Image */}
                <div className="relative aspect-video w-full overflow-hidden bg-black">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-95"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#08172b] via-transparent to-black/40" />

                  <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-black/70 backdrop-blur-md border border-[rgba(241,202,98,0.4)] text-[10px] font-mono text-[#f1ca62] uppercase tracking-wider">
                    {product.tag}
                  </span>

                  {product.price && (
                    <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-400 text-xs font-mono font-bold text-emerald-300 shadow-md">
                      {product.price}
                    </span>
                  )}
                </div>

                <div className="p-6 space-y-3.5">
                  <h3 className="text-xl font-bold text-white group-hover:text-[#f1ca62] transition-colors leading-tight">
                    {product.name}
                  </h3>

                  <p className="text-xs text-zinc-300 leading-relaxed">
                    {product.description}
                  </p>

                  {/* Highlights list */}
                  <div className="space-y-1.5 pt-1">
                    {product.features.slice(0, 3).map((feat, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-zinc-400">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#f1ca62] shrink-0" />
                        <span className="truncate">{feat}</span>
                      </div>
                    ))}
                  </div>

                  {/* Highlight Stat Pill */}
                  <div className="p-2.5 rounded-lg bg-black/50 border border-white/10 font-mono text-xs flex justify-between">
                    <span className="text-zinc-500">{product.highlightStat.label}:</span>
                    <span className="text-[#f1ca62] font-bold">{product.highlightStat.value}</span>
                  </div>
                </div>

                {/* Bottom CTA */}
                <div className="p-6 pt-0">
                  <a
                    href={`https://wa.me/918149916052?text=${encodeURIComponent(product.orderWaText)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-[#f1ca62] text-zinc-300 hover:text-black border border-white/10 font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all font-semibold"
                  >
                    <span>{product.price ? `Order on WhatsApp (${product.price})` : 'Discuss this build on WhatsApp'}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
              </Tilt>
              </Reveal>
            ))}
          </div>

        </div>
      </section>

      {/* TAP TAG SECTION (3D Flipper with Dual Upload) */}
      <TapTagSection />

      {/* WEBSITE BUILDER: visible section + dialog */}
      <section id="website-studio" className="relative py-14 lg:py-20 border-t border-[rgba(241,202,98,0.18)]" aria-labelledby="website-studio-title">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-5">
          <h2 id="website-studio-title" className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Need a website for your business?
          </h2>
          <p className="text-zinc-300 text-base max-w-2xl mx-auto leading-relaxed">
            Choose your business type, package and add-ons, preview the site on desktop, tablet and mobile, then send your request to Adam on WhatsApp. Websites start at ₹5,300.
          </p>
          <button type="button" onClick={openWebsiteModal} className="btn btn-primary">
            <Sparkles className="w-4 h-4" aria-hidden="true" />
            Open the Website Builder
          </button>
        </div>
      </section>

      {showWebsiteModal && (
        <div
          className="fixed inset-0 z-[70] flex items-start sm:items-center justify-center bg-black/85 backdrop-blur-xl p-3 sm:p-6 overflow-y-auto animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-label="Website builder"
          onMouseDown={(e) => { if (e.target === e.currentTarget) closeWebsiteModal(); }}
        >
          <div ref={modalRef} className="relative w-full max-w-6xl rounded-3xl bg-[#030711] border border-[rgba(241,202,98,0.4)] shadow-[0_0_80px_rgba(0,0,0,0.9)] p-5 sm:p-8 my-auto">
            <button
              ref={closeBtnRef}
              type="button"
              onClick={closeWebsiteModal}
              aria-label="Close website builder"
              className="absolute top-4 right-4 z-20 inline-flex items-center justify-center w-11 h-11 rounded-full bg-white/10 hover:bg-[#f1ca62] text-white hover:text-black transition-colors"
            >
              <X className="w-5 h-5 stroke-[2.5]" aria-hidden="true" />
            </button>
            <div className="pt-8 sm:pt-2">
              <WebsiteConfigurator />
            </div>
          </div>
        </div>
      )}

      {/* ENGINEERING SERVICES SECTION */}
      <section className="relative py-16 lg:py-24 border-t border-[rgba(241,202,98,0.18)]" id="services">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-mono text-[#f1ca62] uppercase tracking-wider block">
              Core Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Engineering Services &amp; <span className="text-[#f1ca62]">Custom R&amp;D</span>
            </h2>
            <p className="text-zinc-400 text-sm leading-relaxed">
              From circuit design to autonomous navigation and high-conversion web development, DR53 works with founders, students, and businesses to engineer real-world systems.
            </p>
          </div>

          <Reveal><div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-[#06101f] border border-[rgba(241,202,98,0.2)] space-y-3 hover:border-[#f1ca62] transition-colors">
              <div className="w-10 h-10 rounded-xl bg-[#f1ca62]/10 border border-[#f1ca62]/30 flex items-center justify-center text-[#f1ca62]">
                <Bot className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Robotics &amp; Mechanisms</h3>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Autonomous mobile rovers, multi-link articulated servo robotic arms, obstacle radar avoidance, and high-torque motor actuation.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#06101f] border border-[rgba(241,202,98,0.2)] space-y-3 hover:border-[#f1ca62] transition-colors">
              <div className="w-10 h-10 rounded-xl bg-[#f1ca62]/10 border border-[#f1ca62]/30 flex items-center justify-center text-[#f1ca62]">
                <Eye className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">AI &amp; Computer Vision</h3>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Applied edge neural networks on Raspberry Pi 5 &amp; Coral TPU. Worker safety inspection (helmets, vests) and automated conveyor sorting.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#06101f] border border-[rgba(241,202,98,0.2)] space-y-3 hover:border-[#f1ca62] transition-colors">
              <div className="w-10 h-10 rounded-xl bg-[#f1ca62]/10 border border-[#f1ca62]/30 flex items-center justify-center text-[#f1ca62]">
                <Globe className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Custom Business Websites</h3>
              <p className="text-xs text-zinc-300 leading-relaxed">
                High-performance dark aesthetic websites tailored for clothing, industrial, and retail brands with instant WhatsApp order &amp; lead capture.
              </p>
            </div>
          </div></Reveal>

        </div>
      </section>

      {/* RECENT MILESTONES & ACHIEVEMENTS */}
      <section className="relative py-16 lg:py-24 border-t border-[rgba(241,202,98,0.18)]" id="milestones">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-mono text-[#f1ca62] uppercase tracking-wider block">
              Proven Track Record
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Built. Competed. <span className="text-[#f1ca62]">Kept Moving.</span>
            </h2>
            <p className="text-zinc-400 text-sm">
              Competitions and research milestones achieved by Adam Bhaimia and the DR53 team.
            </p>
          </div>

          <Reveal><div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Milestone 1 */}
            <div className="p-6 rounded-2xl bg-gradient-to-b from-[#081524] to-[#040a12] border border-[rgba(241,202,98,0.25)] space-y-3 relative overflow-hidden">
              <span className="text-xs font-mono text-[#f1ca62] font-semibold">01 · BIEA 2026</span>
              <h3 className="text-xl font-bold text-white">AgriSort Innovators</h3>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Developed and presented <strong>A-Zero</strong>, an autonomous zero-handling food supply chain concept integrating robotics, computer vision, and IoT logistics.
              </p>
              <div className="pt-2 text-[11px] font-mono text-zinc-500 border-t border-white/5">
                Raspberry Pi 5 · Camera Module 3 · AI Vision · Sensors
              </div>
            </div>

            {/* Milestone 2 */}
            <div className="p-6 rounded-2xl bg-gradient-to-b from-[#081524] to-[#040a12] border border-[rgba(241,202,98,0.25)] space-y-3 relative overflow-hidden">
              <span className="text-xs font-mono text-[#f1ca62] font-semibold">02 · WSC 2026</span>
              <h3 className="text-xl font-bold text-white">World Scholar&apos;s Cup</h3>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Competed with the AgriSort team and secured debate victories during the rigorous global round journey.
              </p>
              <div className="pt-2 text-[11px] font-mono text-zinc-500 border-t border-white/5">
                Debate · Collaborative Writing · Scholar&apos;s Bowl
              </div>
            </div>

            {/* Milestone 3 */}
            <div className="p-6 rounded-2xl bg-gradient-to-b from-[#081524] to-[#040a12] border border-[rgba(241,202,98,0.25)] space-y-3 relative overflow-hidden">
              <span className="text-xs font-mono text-[#f1ca62] font-semibold">03 · FTC 2026–27</span>
              <h3 className="text-xl font-bold text-white">Software + Robotics</h3>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Built technical portfolio spanning Java, embedded robotics, and mecanum-drive autonomous control algorithms for First Tech Challenge.
              </p>
              <div className="pt-2 text-[11px] font-mono text-zinc-500 border-t border-white/5">
                Java · FTC · Mecanum Actuation · Autonomous Logic
              </div>
            </div>

          </div></Reveal>

        </div>
      </section>

      {/* CONTACT & DIRECT WHATSAPP ACTION BAND */}
      <section className="relative py-20 lg:py-28 border-t border-[rgba(241,202,98,0.2)] bg-gradient-to-b from-[#030711] via-[#06101f] to-[#030711]" id="contact">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <span className="text-xs font-mono text-[#f1ca62] uppercase tracking-wider block">
            Direct Founder Access
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight">
            Have an idea? Let&apos;s turn it into <br className="hidden sm:inline" />
            <span className="text-[#f1ca62]">something real.</span>
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Tell DR53 what you want to build. Get a direct technical answer from Adam Bhaimia in Pune — no sales funnel, no middleman.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <a
              href="https://wa.me/918149916052?text=Hi%20Adam%2C%20I%20have%20a%20project%20idea%20for%20DR53."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-gradient-to-r from-[#25d366] to-[#128c4a] text-black font-bold text-sm uppercase tracking-wider shadow-[0_0_35px_rgba(37,211,102,0.45)] hover:shadow-[0_0_50px_rgba(37,211,102,0.65)] hover:scale-105 active:scale-95 transition-all"
            >
              <WhatsAppIcon className="w-5 h-5 fill-black" />
              <span>Message Adam on WhatsApp (+91 81499 16052)</span>
            </a>
          </div>
        </div>
      </section>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-[#02050b] py-12 text-xs font-mono text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <BrandLogo className="w-9 h-9" />
            <div>
              <span className="text-white font-bold text-sm font-sans block">Dynamic Robotics 53</span>
              <span>Founded by Adam Bhaimia · Pune, Maharashtra, India</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-zinc-400">
            <a href="#billboard" className="hover:text-white">Live showcase</a>
            <a href="#projects" className="hover:text-white">Projects</a>
            <a href="#taptag" className="hover:text-white">Tap Tag</a>
            <a href="#t53" className="text-[#f1ca62] hover:text-white">T53</a>
            <button type="button" onClick={openWebsiteModal} className="hover:text-[#f1ca62] text-left">
              Website builder
            </button>
            <a href="#milestones" className="hover:text-white">Milestones</a>
            <a href="#contact" className="hover:text-white">Contact</a>
            <a href="https://wa.me/918149916052" target="_blank" rel="noopener noreferrer" className="text-[#25d366] hover:underline flex items-center gap-1">
              <WhatsAppIcon className="w-3.5 h-3.5 fill-[#25d366]" />
              <span>WhatsApp</span>
            </a>
          </div>

          <div>
            © 2026 DR53. All rights reserved.
          </div>
        </div>
      </footer>

      {/* WORKING AI CONCIERGE CHATBOT */}
      <Chatbot />

      {/* FLOATING WHATSAPP BUTTON (With Real WhatsApp Icon) */}
      <a
        href="https://wa.me/918149916052"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-5 sm:right-6 z-50 p-4 rounded-full bg-gradient-to-r from-[#25d366] to-[#128c4a] text-black shadow-[0_0_30px_rgba(37,211,102,0.55)] hover:shadow-[0_0_45px_rgba(37,211,102,0.8)] hover:scale-110 active:scale-95 transition-all"
        title="Chat on WhatsApp with Adam Bhaimia"
        aria-label="Chat on WhatsApp"
      >
        <WhatsAppIcon className="w-6 h-6 fill-black" />
      </a>

    </div>
  );
}
