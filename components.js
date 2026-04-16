/* ═══════════════════════════════════════════════════════════════
   BELVIA DRIVE — Shared Components
   Config loader · Nav · Footer · Reveal · FAQ · Multilingual
   ═══════════════════════════════════════════════════════════════ */

'use strict';

/* ─── CONFIG LOADER ─── */
let BD_CONFIG = null;

async function loadConfig() {
  try {
    const r = await fetch('config.json?v=' + Date.now());
    BD_CONFIG = await r.json();
    return BD_CONFIG;
  } catch(e) {
    // Try parent directory (for /en/ and /nl/ pages)
    try {
      const r2 = await fetch('../config.json?v=' + Date.now());
      BD_CONFIG = await r2.json();
      return BD_CONFIG;
    } catch(e2) {
      console.warn('Config non chargée, utilisation des valeurs par défaut.');
      BD_CONFIG = getDefaultConfig();
      return BD_CONFIG;
    }
  }
}

function getDefaultConfig() {
  return {
    marque: { nom: 'Belvia Drive', telephone: '+32 400 00 00 00', email: 'contact@belviadrive.be' },
    tarifs: {
      berline:    { nom: 'Berline Premium', modele: 'Mercedes Classe E', pax_max: 3, bagages_max: 3, base: 8, perKm: 2.5, min: 28 },
      break:      { nom: 'Break Confort', modele: 'Mercedes Classe E Break', pax_max: 4, bagages_max: 5, base: 9.5, perKm: 2.75, min: 32 },
      van:        { nom: 'Van Prestige', modele: 'Mercedes V-Klasse', pax_max: 7, bagages_max: 7, base: 13, perKm: 3.2, min: 42 },
      electrique: { nom: 'Électrique', modele: 'Tesla Model S', pax_max: 3, bagages_max: 3, base: 9, perKm: 2.6, min: 30 }
    },
    supplements: { nuit: { actif: true, multiplicateur: 1.25, heure_debut: 22, heure_fin: 6 }, weekend: { actif: true, multiplicateur: 1.10 }, aeroport_accueil: { actif: true, montant_fixe: 5 } },
    forfaits_aeroport: { bru: { berline: 65, break: 75, van: 92, electrique: 70 }, crl: { berline: 115, break: 130, van: 155, electrique: 125 } },
    forfaits_longue_distance: { paris: { berline: 360, multiplicateur_autres: 1.35 }, amsterdam: { berline: 295, multiplicateur_autres: 1.35 }, luxembourg: { berline: 265, multiplicateur_autres: 1.35 } },
    webhook: { url: '', actif: false },
    google_maps: { api_key: '', actif: false }
  };
}

/* ─── LANGUAGE DETECTION ─── */
function detectLang() {
  const path = window.location.pathname;
  if (path.startsWith('/en/') || path.includes('/en/')) return 'en';
  if (path.startsWith('/nl/') || path.includes('/nl/')) return 'nl';
  return 'fr';
}

function getPrefix() {
  const lang = detectLang();
  if (lang === 'en') return '../';
  if (lang === 'nl') return '../';
  return '';
}

/* ─── PAGE MAP ─── */
const PAGE_MAP = {
  home:       { fr: '/',             en: '/',             nl: '/' },
  aeroport:   { fr: '/transfert-aeroport',  en: '/airport-transfer',   nl: '/luchthaven-transfer' },
  affaires:   { fr: '/voyage-affaires',      en: '/business-travel',    nl: '/zakelijk-vervoer' },
  van:        { fr: '/van-premium',          en: '/van-premium',        nl: '/van-premium' },
  soirees:    { fr: '/soirees-evenements',   en: '/events-evenings',    nl: '/avond-evenementen' },
  longue:     { fr: '/longue-distance',      en: '/long-distance',      nl: '/long-distance' },
  reservation:{ fr: '/reservation',          en: '/reservation',        nl: '/reservatie' },
  b2b:        { fr: '/b2b',                   en: '/b2b',                nl: '/b2b' },
  conditions:{ fr: '/conditions',            en: '/terms',              nl: '/voorwaarden' },
  privacy:    { fr: '/privacy',              en: '/privacy',            nl: '/privacy' },
  legal:      { fr: '/legal',                en: '/legal',              nl: '/legal' }
};

const I18N = {
  fr: {
    navLinks: [
      { key: 'aeroport', label: 'Aéroport' },
      { key: 'affaires', label: 'Affaires' },
      { key: 'van', label: 'Van Premium' },
      { key: 'soirees', label: 'Soirées' },
      { key: 'longue', label: 'Longue Distance' },
      { key: 'b2b', label: 'Corporate' },
    ],
    navCta: 'Tarif immédiat',
    homeLabel: 'Accueil',
    footerTagline: 'Chauffeur privé premium à Bruxelles et en Belgique. Transferts aéroport, voyages d\'affaires, soirées et longue distance. Disponible 24h/24, 7j/7.',
    footerCert: '✓ Taxi agréé Région Bruxelles-Capitale',
    footerServices: 'Services',
    footerServicesList: [
      { key: 'aeroport', label: 'Transfert aéroport' },
      { key: 'affaires', label: 'Voyage d\'affaires' },
      { key: 'van', label: 'Van Premium' },
      { key: 'soirees', label: 'Soirées & événements' },
      { key: 'longue', label: 'Longue distance' },
      { key: 'reservation', label: 'Réserver en ligne' },
    ],
    footerDest: 'Destinations',
    footerDestList: [
      { key: 'aeroport', label: 'BRU — Zaventem' },
      { key: 'aeroport', label: 'CRL — Charleroi' },
      { key: 'longue', label: 'Bruxelles → Paris' },
      { key: 'longue', label: 'Bruxelles → Amsterdam' },
      { key: 'longue', label: 'Bruxelles → Luxembourg' },
      { key: 'longue', label: 'Brabant Wallon' },
    ],
    footerContact: 'Contact',
    footerTerms: 'Conditions générales',
    footerPrivacy: 'Politique de confidentialité',
    footerLegal: 'Mentions légales',
    footerExcellence: 'L\'excellence à votre bord',
    langLinks: [
      { code: 'fr', label: 'FR' },
      { code: 'en', label: 'EN' },
      { code: 'nl', label: 'NL' },
    ]
  },
  en: {
    navLinks: [
      { key: 'aeroport', label: 'Airport' },
      { key: 'affaires', label: 'Business' },
      { key: 'van', label: 'Van Premium' },
      { key: 'soirees', label: 'Events' },
      { key: 'longue', label: 'Long Distance' },
      { key: 'b2b', label: 'Corporate' },
    ],
    navCta: 'Get a Quote',
    homeLabel: 'Home',
    footerTagline: 'Premium private driver in Brussels and Belgium. Airport transfers, business travel, events and long distance. Available 24/7.',
    footerCert: '✓ Licensed Taxi — Brussels-Capital Region',
    footerServices: 'Services',
    footerServicesList: [
      { key: 'aeroport', label: 'Airport transfer' },
      { key: 'affaires', label: 'Business travel' },
      { key: 'van', label: 'Van Premium' },
      { key: 'soirees', label: 'Events & Evenings' },
      { key: 'longue', label: 'Long distance' },
      { key: 'reservation', label: 'Book online' },
    ],
    footerDest: 'Destinations',
    footerDestList: [
      { key: 'aeroport', label: 'BRU — Zaventem' },
      { key: 'aeroport', label: 'CRL — Charleroi' },
      { key: 'longue', label: 'Brussels → Paris' },
      { key: 'longue', label: 'Brussels → Amsterdam' },
      { key: 'longue', label: 'Brussels → Luxembourg' },
      { key: 'longue', label: 'Walloon Brabant' },
    ],
    footerContact: 'Contact',
    footerTerms: 'Terms & Conditions',
    footerPrivacy: 'Privacy Policy',
    footerLegal: 'Legal Notice',
    footerExcellence: 'Excellence on board',
    langLinks: [
      { code: 'fr', label: 'FR' },
      { code: 'en', label: 'EN' },
      { code: 'nl', label: 'NL' },
    ]
  },
  nl: {
    navLinks: [
      { key: 'aeroport', label: 'Luchthaven' },
      { key: 'affaires', label: 'Zakelijk' },
      { key: 'van', label: 'Van Premium' },
      { key: 'soirees', label: 'Evenementen' },
      { key: 'longue', label: 'Lange Afstand' },
      { key: 'b2b', label: 'Corporate' },
    ],
    navCta: 'Offerte',
    homeLabel: 'Home',
    footerTagline: 'Premium particuliere chauffeur in Brussel en België. Luchthaventransfers, zakelijk vervoer, evenementen en lange afstand. 24/7 beschikbaar.',
    footerCert: '✓ Erkende taxi — Gewest Brussel-Hoofdstad',
    footerServices: 'Diensten',
    footerServicesList: [
      { key: 'aeroport', label: 'Luchthaventransfer' },
      { key: 'affaires', label: 'Zakelijk vervoer' },
      { key: 'van', label: 'Van Premium' },
      { key: 'soirees', label: 'Avond & Evenementen' },
      { key: 'longue', label: 'Lange afstand' },
      { key: 'reservation', label: 'Online reserveren' },
    ],
    footerDest: 'Bestemmingen',
    footerDestList: [
      { key: 'aeroport', label: 'BRU — Zaventem' },
      { key: 'aeroport', label: 'CRL — Charleroi' },
      { key: 'longue', label: 'Brussel → Parijs' },
      { key: 'longue', label: 'Brussel → Amsterdam' },
      { key: 'longue', label: 'Brussel → Luxemburg' },
      { key: 'longue', label: 'Waals-Brabant' },
    ],
    footerContact: 'Contact',
    footerTerms: 'Algemene voorwaarden',
    footerPrivacy: 'Privacybeleid',
    footerLegal: 'Juridische kennisgeving',
    footerExcellence: 'Uitmuntendheid aan boord',
    langLinks: [
      { code: 'fr', label: 'FR' },
      { code: 'en', label: 'EN' },
      { code: 'nl', label: 'NL' },
    ]
  }
};

function getHref(pageKey, targetLang) {
  const page = PAGE_MAP[pageKey] || PAGE_MAP.home;
  const path = page[targetLang];
  if (targetLang === 'fr') return path;
  return '/' + targetLang + path;
}

/* ─── PRICE CALCULATOR ─── */
function calculerPrix(vehiculeKey, distanceKm, options = {}) {
  if (!BD_CONFIG) return 0;
  const t = BD_CONFIG.tarifs[vehiculeKey];
  if (!t) return 0;

  let prix = t.base + (distanceKm * t.perKm);
  prix = Math.max(prix, t.min);

  if (options.isNuit && BD_CONFIG.supplements?.nuit?.actif) {
    prix *= BD_CONFIG.supplements.nuit.multiplicateur;
  }
  if (options.isWeekend && BD_CONFIG.supplements?.weekend?.actif) {
    prix *= BD_CONFIG.supplements.weekend.multiplicateur;
  }
  if (options.isAeroport && BD_CONFIG.supplements?.aeroport_accueil?.actif) {
    prix += BD_CONFIG.supplements.aeroport_accueil.montant_fixe;
  }
  if (options.allerRetour) prix *= 2;

  return Math.round(prix * 100) / 100;
}

function isNuitActuelle() {
  const h = new Date().getHours();
  const cfg = BD_CONFIG?.supplements?.nuit;
  if (!cfg?.actif) return false;
  return h >= cfg.heure_debut || h < cfg.heure_fin;
}

function isWeekendActuel() {
  const j = new Date().getDay();
  return j === 0 || j === 6;
}

/* ─── NAV BUILDER ─── */
function buildNav(activePage = '') {
  const nav = document.getElementById('nav');
  if (!nav) return;

  const lang = detectLang();
  const t = I18N[lang];
  const prefix = getPrefix();

  const links = t.navLinks.map(l => {
    const href = getHref(l.key, lang);
    return { href, label: l.label, key: l.key };
  });

  const resHref = getHref('reservation', lang);

  const homeHref = getHref('home', lang);

  // Language switcher for current page
  const currentPageKey = activePage || 'home';
  const langSwitcher = t.langLinks.map(ll => {
    const href = getHref(currentPageKey, ll.code);
    const current = ll.code === lang ? ' style="color:var(--gold);font-weight:600"' : '';
    return `<a href="${href}"${current} style="font-size:.65rem;letter-spacing:.15em">${ll.label}</a>`;
  }).join('<span style="color:rgba(201,165,90,.3);font-size:.6rem">|</span>');

  nav.innerHTML = `
    <a href="${homeHref}" class="nav-logo" aria-label="Belvia Drive — ${t.homeLabel}">
      <span class="logo-accent">Belvia</span> Drive
      <span class="logo-sub">Bruxelles</span>
    </a>
    <ul class="nav-links" role="navigation" aria-label="${lang==='fr'?'Navigation principale':lang==='en'?'Main navigation':'Hoofdnavigatie'}">
      ${links.map(l => `<li><a href="${l.href}" ${activePage === l.key ? 'class="active" aria-current="page"' : ''}>${l.label}</a></li>`).join('')}
      <li class="nav-mobile-lang">${langSwitcher}</li>
      <li class="nav-mobile-cta"><a href="${resHref}" class="btn btn-gold" style="font-size:.65rem;padding:.6rem 1.5rem;width:100%;text-align:center">${t.navCta}</a></li>
    </ul>
    <div class="nav-desktop-right" style="display:flex;align-items:center;gap:1.2rem">
      <div style="display:flex;gap:.5rem;align-items:center">${langSwitcher}</div>
      <a href="${resHref}" class="nav-cta" aria-label="${t.navCta}">${t.navCta}</a>
    </div>
    <button class="nav-mobile-btn" id="navMobileBtn" aria-label="Menu" aria-expanded="false">
      <span></span><span></span><span></span>
    </button>
  `;

  // Inject mobile nav styles
  if (!document.getElementById('nav-mobile-styles')) {
    const style = document.createElement('style');
    style.id = 'nav-mobile-styles';
    style.textContent = `
      .nav-mobile-lang, .nav-mobile-cta { display: none; }
      @media(max-width:900px) {
        .nav-desktop-right { display: none !important; }
        .nav-mobile-lang { display: block !important; padding-top: 1rem; margin-top: 1rem; border-top: 1px solid rgba(201,165,90,.15); font-size: .9rem; letter-spacing: .2em; }
        .nav-mobile-cta { display: block !important; padding-top: .5rem; }
      }
    `;
    document.head.appendChild(style);
  }

  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 50);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  document.getElementById('navMobileBtn')?.addEventListener('click', function() {
    const expanded = this.getAttribute('aria-expanded') === 'true';
    this.setAttribute('aria-expanded', String(!expanded));
    const ul = nav.querySelector('.nav-links');
    if (ul) {
      ul.style.display = expanded ? '' : 'flex';
      ul.style.flexDirection = 'column';
      ul.style.position = 'absolute';
      ul.style.top = 'var(--nav-h)';
      ul.style.left = '0'; ul.style.right = '0';
      ul.style.background = 'rgba(8,8,8,.98)';
      ul.style.padding = '1.5rem 5vw 2rem';
      ul.style.borderBottom = '1px solid rgba(201,165,90,.15)';
    }
  });
}

/* ─── FOOTER BUILDER ─── */
function buildFooter() {
  const footer = document.querySelector('footer');
  if (!footer) return;

  const lang = detectLang();
  const t = I18N[lang];
  const phone = BD_CONFIG?.marque?.telephone || '+32 400 00 00 00';
  const email = BD_CONFIG?.marque?.email || 'contact@belviadrive.be';
  const prefix = getPrefix();

  const svcLinks = t.footerServicesList.map(s => {
    const href = getHref(s.key, lang);
    return `<li><a href="${href}">${s.label}</a></li>`;
  }).join('');

  const destLinks = t.footerDestList.map(s => {
    const href = getHref(s.key, lang);
    return `<li><a href="${href}">${s.label}</a></li>`;
  }).join('');

  footer.innerHTML = `
    <div class="footer-top">
      <div>
        <div class="footer-brand-logo"><span>Belvia</span> Drive</div>
        <p class="footer-tagline">${t.footerTagline}</p>
        <div class="footer-cert">${t.footerCert}</div>
      </div>
      <div class="footer-col">
        <h4>${t.footerServices}</h4>
        <ul>${svcLinks}</ul>
      </div>
      <div class="footer-col">
        <h4>${t.footerDest}</h4>
        <ul>${destLinks}</ul>
      </div>
      <div class="footer-col">
        <h4>${t.footerContact}</h4>
        <ul>
          <li><a href="tel:${phone.replace(/\s/g,'')}">${phone}</a></li>
          <li><a href="mailto:${email}">${email}</a></li>
          <li><a href="${getHref('conditions', lang)}">${t.footerTerms}</a></li>
          <li><a href="${getHref('privacy', lang)}">${t.footerPrivacy}</a></li>
          <li><a href="${getHref('legal', lang)}">${t.footerLegal}</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <div class="footer-copy">© ${new Date().getFullYear()} Belvia Drive — ${lang==='fr'?'Chauffeur Privé Bruxelles':lang==='en'?'Private Driver Brussels':'Particuliere Chauffeur Brussel'}. ${BD_CONFIG?.marque?.tva || 'TVA BE 0XXX.XXX.XXX'}</div>
      <div class="footer-copy">${t.footerExcellence}</div>
    </div>
  `;
}

/* ─── REVEAL ON SCROLL ─── */
function initReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

/* ─── FAQ ACCORDION ─── */
function initFaq() {
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const answer = btn.nextElementSibling;
      const isOpen = answer.classList.contains('open');
      document.querySelectorAll('.faq-a').forEach(a => a.classList.remove('open'));
      document.querySelectorAll('.faq-q').forEach(b => b.classList.remove('open'));
      if (!isOpen) { answer.classList.add('open'); btn.classList.add('open'); }
    });
  });
}

/* ─── WEBHOOK SENDER ─── */
async function sendToWebhook(data) {
  if (!BD_CONFIG?.webhook?.actif || !BD_CONFIG?.webhook?.url) {
    console.log('📦 Webhook non configuré. Données de réservation:', data);
    return { success: false, reason: 'webhook_not_configured' };
  }
  try {
    await fetch(BD_CONFIG.webhook.url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, source: 'belviadrive.be', timestamp: new Date().toISOString() })
    });
    return { success: true };
  } catch(e) {
    console.error('Erreur webhook:', e);
    return { success: false, reason: 'network_error' };
  }
}

/* ─── INIT ─── */
document.addEventListener('DOMContentLoaded', async () => {
  await loadConfig();
  const page = document.body.dataset.page || '';
  buildNav(page);
  buildFooter();
  initReveal();
  initFaq();
});
