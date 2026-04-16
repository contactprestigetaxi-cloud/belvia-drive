/* ═══════════════════════════════════════════════════════════════
   BELVIA DRIVE — Shared Components
   Config loader · Nav · Footer · Reveal · FAQ
   ═══════════════════════════════════════════════════════════════ */

'use strict';

/* ─── CONFIG LOADER ─── */
let BD_CONFIG = null;

const CONFIG_API_URL = 'https://admin.belviadrive.be/api/config';

async function loadConfig() {
  // Essaie d'abord l'API temps réel (prix toujours à jour sans redéploiement)
  try {
    const r = await fetch(CONFIG_API_URL + '?v=' + Date.now(), { signal: AbortSignal.timeout(3000) });
    if (r.ok) {
      BD_CONFIG = await r.json();
      return BD_CONFIG;
    }
  } catch(e) { /* fallback */ }

  // Fallback : config.json local embarqué dans le site
  try {
    const r = await fetch('config.json?v=' + Date.now());
    BD_CONFIG = await r.json();
    return BD_CONFIG;
  } catch(e) {
    console.warn('Config non chargée, utilisation des valeurs par défaut.');
    BD_CONFIG = getDefaultConfig();
    return BD_CONFIG;
  }
}

function getDefaultConfig() {
  return {
    marque: { nom: 'Belvia Drive', telephone: '+32 496 20 11 12', email: 'contact@belviadrive.be' },
    tarifs: {
      berline:    { nom: 'Berline Premium', modele: 'Mercedes Classe E', pax_max: 3, bagages_max: 3, base: 8, perKm: 2.5, min: 28 },
      break:      { nom: 'Break Confort', modele: 'Mercedes Classe E Break', pax_max: 4, bagages_max: 5, base: 9.5, perKm: 2.75, min: 32 },
      van:        { nom: 'Van Prestige', modele: 'Mercedes V-Klasse', pax_max: 8, bagages_max: 8, base: 13, perKm: 3.2, min: 42 },
      electrique: { nom: 'Électrique', modele: 'Tesla Model S', pax_max: 3, bagages_max: 3, base: 9, perKm: 2.6, min: 30 }
    },
    supplements: { nuit: { actif: true, multiplicateur: 1.25, heure_debut: 22, heure_fin: 6 }, weekend: { actif: true, multiplicateur: 1.10 }, aeroport_accueil: { actif: true, montant_fixe: 5 } },
    forfaits_aeroport: { bru: { berline: 65, break: 75, van: 92, electrique: 70 }, crl: { berline: 115, break: 130, van: 155, electrique: 125 } },
    forfaits_longue_distance: { paris: { berline: 360, multiplicateur_autres: 1.35 }, amsterdam: { berline: 295, multiplicateur_autres: 1.35 }, luxembourg: { berline: 265, multiplicateur_autres: 1.35 } },
    webhook: { url: '', actif: false },
    google_maps: { api_key: '', actif: false }
  };
}

/* ─── PRICE CALCULATOR ─── */
function calculerPrix(vehiculeKey, distanceKm, options = {}) {
  if (!BD_CONFIG) return 0;
  const t = BD_CONFIG.tarifs[vehiculeKey];
  if (!t) return 0;

  // Vérifier les forfaits aéroport (Bruxelles 19 communes uniquement)
  if (options.isAeroport && BD_CONFIG.forfaits_aeroport) {
    const dest = (options.destination || '').toLowerCase();
    const dep = (options.depart || '').toLowerCase();
    const combined = dest + ' ' + dep;
    
    // Bruxelles 19 communes → forfait
    const bxl19 = /bruxelles|brussels|brussel|ixelles|uccle|etterbeek|schaerbeek|anderlecht|molenbeek|forest|saint-gilles|jette|laeken|evere|ganshoren|koekelberg|woluwe|auderghem|watermael|berchem|\b10[0-9]{2}\b|\b11[0-9]{2}\b|\b12[0-9]{2}\b/i;
    
    if (bxl19.test(dep)) {
      let forfaitKey = null;
      if (combined.match(/zaventem|\bbru\b|brussels airport|brucargo/i)) forfaitKey = 'bru';
      else if (combined.match(/charleroi|\bcrl\b|gosselies|brussels south/i)) forfaitKey = 'crl';
      
      if (forfaitKey && BD_CONFIG.forfaits_aeroport[forfaitKey]?.[vehiculeKey]) {
        let prix = BD_CONFIG.forfaits_aeroport[forfaitKey][vehiculeKey];
        if (options.allerRetour) prix *= 2;
        return Math.round(prix * 100) / 100;
      }
    }
  }

  // Brabant (rayon 25km, hors Bruxelles 19) → ristourne 15% sur le calcul kilométrique
  const brabant25 = /waterloo|braine|la hulpe|rixensart|tervuren|overijse|wavre|louvain-la-neuve|la louvi[eè]re|seneffe|manage|zaventem|vilvoorde|grimbergen|machelen|diegem|kraainem|wezembeek|sterrebeek|hoeilaart|genval|ottignies|nivelles|tubize|halle|\b13[0-9]{2}\b|\b14[0-9]{2}\b|\b15[0-9]{2}\b|\b16[0-9]{2}\b|\b17[0-9]{2}\b|\b19[0-9]{2}\b|\b30[0-9]{2}\b/i;
  const bxl19check = /bruxelles|brussels|brussel|ixelles|uccle|etterbeek|schaerbeek|anderlecht|molenbeek|forest|saint-gilles|jette|laeken|evere|ganshoren|koekelberg|woluwe|auderghem|watermael|berchem|\b10[0-9]{2}\b|\b11[0-9]{2}\b|\b12[0-9]{2}\b/i;
  const depStr = (options.depart || '').toLowerCase();
  const isBrabant = brabant25.test(depStr) && !bxl19check.test(depStr);

  // Vérifier les forfaits longue distance
  if (BD_CONFIG.forfaits_longue_distance) {
    const dest = (options.destination || '').toLowerCase();
    for (const [ville, f] of Object.entries(BD_CONFIG.forfaits_longue_distance)) {
      if (dest.includes(ville)) {
        let prix = f[vehiculeKey] || f.berline * (f.multiplicateur_autres || 1.1);
        if (options.allerRetour) prix *= 2;
        return Math.round(prix * 100) / 100;
      }
    }
  }

  // Calcul standard
  let prix = t.base + (distanceKm * t.perKm);
  prix = Math.max(prix, t.min);

  // Supplément nuit
  if (options.isNuit && BD_CONFIG.supplements?.nuit?.actif) {
    prix *= BD_CONFIG.supplements.nuit.multiplicateur;
  }
  // Supplément week-end
  if (options.isWeekend && BD_CONFIG.supplements?.weekend?.actif) {
    prix *= BD_CONFIG.supplements.weekend.multiplicateur;
  }
  // Accueil aéroport
  if (options.isAeroport && BD_CONFIG.supplements?.aeroport_accueil?.actif) {
    prix += BD_CONFIG.supplements.aeroport_accueil.montant_fixe;
  }
  // Ristourne Brabant 25km : -15%
  if (isBrabant) prix *= 0.85;

  // Aller-retour
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

  const links = [
    { href: 'transfert-aeroport.html', label: 'Aéroport', key: 'aeroport' },
    { href: 'voyage-affaires.html', label: 'Affaires', key: 'affaires' },
    { href: 'van-premium.html', label: 'Van Premium', key: 'van' },
    { href: 'soirees-evenements.html', label: 'Soirées', key: 'soirees' },
    { href: 'longue-distance.html', label: 'Longue Distance', key: 'longue' },
  ];

  nav.innerHTML = `
    <a href="index.html" class="nav-logo" aria-label="Belvia Drive — Accueil">
      <span class="logo-accent">Belvia</span> Drive
      <span class="logo-sub">Bruxelles</span>
    </a>
    <ul class="nav-links" role="navigation" aria-label="Navigation principale">
      ${links.map(l => `<li><a href="${l.href}" ${activePage === l.key ? 'class="active" aria-current="page"' : ''}>${l.label}</a></li>`).join('')}
    </ul>
    <a href="reservation.html" class="nav-cta" aria-label="Réserver — Tarif immédiat">Tarif immédiat</a>
    <button class="nav-mobile-btn" id="navMobileBtn" aria-label="Menu" aria-expanded="false">
      <span></span><span></span><span></span>
    </button>
  `;

  // Scroll effect
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 50);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile menu (simple toggle)
  document.getElementById('navMobileBtn')?.addEventListener('click', function() {
    const expanded = this.getAttribute('aria-expanded') === 'true';
    this.setAttribute('aria-expanded', String(!expanded));
    const ul = nav.querySelector('.nav-links');
    if (!ul) return;
    if (expanded) {
      // Close menu
      ul.style.display = '';
    } else {
      // Open menu
      ul.style.display = 'flex';
      ul.style.flexDirection = 'column';
      ul.style.position = 'absolute';
      ul.style.top = 'var(--nav-h)';
      ul.style.left = '0';
      ul.style.right = '0';
      ul.style.background = 'rgba(8,8,8,.98)';
      ul.style.padding = '1.5rem 5vw 2rem';
      ul.style.borderBottom = '1px solid rgba(201,165,90,.15)';
      ul.style.zIndex = '899';
      ul.style.gap = '1.5rem';
    }
  });
}

/* ─── FOOTER BUILDER ─── */
function buildFooter() {
  const footer = document.querySelector('footer');
  if (!footer) return;
  const phone = BD_CONFIG?.marque?.telephone || '+32 496 20 11 12';
  const email = BD_CONFIG?.marque?.email || 'contact@belviadrive.be';

  footer.innerHTML = `
    <div class="footer-top">
      <div>
        <div class="footer-brand-logo"><span>Belvia</span> Drive</div>
        <p class="footer-tagline">Chauffeur privé et VTC premium à Bruxelles et en Belgique. Transferts aéroport Zaventem (BRU), voyages d'affaires, soirées et longue distance. Taxi agréé disponible 24h/24, 7j/7.</p>
        <div class="footer-cert">✓ Taxi agréé Région Bruxelles-Capitale</div>
      </div>
      <div class="footer-col">
        <h4>Services</h4>
        <ul>
          <li><a href="transfert-aeroport.html">Transfert aéroport</a></li>
          <li><a href="voyage-affaires.html">Voyage d'affaires</a></li>
          <li><a href="van-premium.html">Van Premium</a></li>
          <li><a href="soirees-evenements.html">Soirées & événements</a></li>
          <li><a href="longue-distance.html">Longue distance</a></li>
          <li><a href="reservation.html">Réserver en ligne</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Destinations</h4>
        <ul>
          <li><a href="transfert-aeroport.html">BRU — Zaventem</a></li>
          <li><a href="transfert-aeroport.html">CRL — Charleroi</a></li>
          <li><a href="longue-distance.html">Bruxelles → Paris</a></li>
          <li><a href="longue-distance.html">Bruxelles → Amsterdam</a></li>
          <li><a href="longue-distance.html">Bruxelles → Luxembourg</a></li>
          <li><a href="longue-distance.html">Brabant Wallon</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Zones desservies</h4>
        <ul>
          <li><span style="color:rgba(200,194,180,.5);font-size:.72rem">Bruxelles · Ixelles · Uccle</span></li>
          <li><span style="color:rgba(200,194,180,.5);font-size:.72rem">Waterloo · Braine-l'Alleud</span></li>
          <li><span style="color:rgba(200,194,180,.5);font-size:.72rem">Zaventem · Tervuren · La Hulpe</span></li>
          <li><span style="color:rgba(200,194,180,.5);font-size:.72rem">La Louvière · Seneffe · Manage</span></li>
          <li><span style="color:rgba(200,194,180,.5);font-size:.72rem">Schaerbeek · Anderlecht · Evere</span></li>
          <li><span style="color:rgba(200,194,180,.5);font-size:.72rem">Louvain-la-Neuve · Wavre · Rixensart</span></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Contact</h4>
        <ul>
          <li><a href="tel:${phone.replace(/\s/g,'')}">${phone}</a></li>
          <li><a href="mailto:${email}">${email}</a></li>
          <li><a href="#">Conditions générales</a></li>
          <li><a href="#">Politique de confidentialité</a></li>
          <li><a href="#">Mentions légales</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <div class="footer-copy">© ${new Date().getFullYear()} Belvia Drive — Chauffeur Privé Bruxelles.</div>
      <div class="footer-copy">L'excellence à votre bord</div>
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

/* ─── SCHEMA.ORG JSON-LD PRICE UPDATER ─── */
function updateSchemaPrices() {
  if (!BD_CONFIG) return;
  const fa = BD_CONFIG.forfaits_aeroport || {};
  const fl = BD_CONFIG.forfaits_longue_distance || {};
  const phone = (BD_CONFIG.marque?.telephone || '+32 496 20 11 12').replace(/\s/g, '');

  document.querySelectorAll('script[type="application/ld+json"]').forEach(script => {
    try {
      const data = JSON.parse(script.textContent);
      let modified = false;

      // --- Service / TaxiService with offers ---
      if ((data['@type'] === 'Service' || data['@type'] === 'TaxiService') && Array.isArray(data.offers)) {
        data.offers.forEach(offer => {
          if (!offer.priceSpecification) return;
          const name = (offer.name || '').toLowerCase();

          if (name.includes('bru') && name.includes('van')) {
            offer.priceSpecification.price = String(fa.bru?.van ?? offer.priceSpecification.price);
            modified = true;
          } else if (name.includes('crl') && name.includes('van')) {
            offer.priceSpecification.price = String(fa.crl?.van ?? offer.priceSpecification.price);
            modified = true;
          } else if (name.includes('bru') && !name.includes('van')) {
            offer.priceSpecification.price = String(fa.bru?.berline ?? offer.priceSpecification.price);
            modified = true;
          } else if (name.includes('crl') && !name.includes('van')) {
            offer.priceSpecification.price = String(fa.crl?.berline ?? offer.priceSpecification.price);
            modified = true;
          } else if (name.includes('paris') && name.includes('van')) {
            const v = fl.paris ? Math.round(fl.paris.berline * (fl.paris.multiplicateur_autres || 1.35)) : null;
            if (v) { offer.priceSpecification.price = String(v); modified = true; }
          } else if (name.includes('paris')) {
            offer.priceSpecification.price = String(fl.paris?.berline ?? offer.priceSpecification.price);
            modified = true;
          } else if (name.includes('amsterdam')) {
            offer.priceSpecification.price = String(fl.amsterdam?.berline ?? offer.priceSpecification.price);
            modified = true;
          } else if (name.includes('luxembourg')) {
            offer.priceSpecification.price = String(fl.luxembourg?.berline ?? offer.priceSpecification.price);
            modified = true;
          } else if (name.includes('cologne')) {
            offer.priceSpecification.price = String(fl.cologne?.berline ?? offer.priceSpecification.price);
            modified = true;
          } else if (name.includes('lille')) {
            offer.priceSpecification.price = String(fl.lille?.berline ?? offer.priceSpecification.price);
            modified = true;
          }
        });
        // Update provider telephone
        if (data.provider?.telephone) { data.provider.telephone = phone; modified = true; }
      }

      // --- LocalBusiness / TaxiService telephone (supports array @type) ---
      const typeArr = Array.isArray(data['@type']) ? data['@type'] : [data['@type']];
      if (typeArr.some(t => ['LocalBusiness', 'TaxiService', 'Organization'].includes(t)) && data.telephone) {
        data.telephone = phone; modified = true;
      }

      // --- FAQPage: replace known hardcoded prices in answer text ---
      if (data['@type'] === 'FAQPage' && Array.isArray(data.mainEntity)) {
        data.mainEntity.forEach(item => {
          if (!item.acceptedAnswer?.text) return;
          let t = item.acceptedAnswer.text;
          let changed = false;
          if (fa.bru?.berline)  { const re = /\b65€\b/g; if (re.test(t)) { t = t.replace(/\b65€\b/g, fa.bru.berline + '€'); changed = true; } }
          if (fa.crl?.berline)  { const re = /\b115€\b/g; if (re.test(t)) { t = t.replace(/\b115€\b/g, fa.crl.berline + '€'); changed = true; } }
          if (fl.paris?.berline){ const re = /\b360€\b/g; if (re.test(t)) { t = t.replace(/\b360€\b/g, fl.paris.berline + '€'); changed = true; } }
          if (fa.bru?.van)      { const re = /\b92€\b/g; if (re.test(t)) { t = t.replace(/\b92€\b/g, fa.bru.van + '€'); changed = true; } }
          if (changed) { item.acceptedAnswer.text = t; modified = true; }
        });
      }

      if (modified) script.textContent = JSON.stringify(data);
    } catch(e) { /* skip malformed schemas */ }
  });
}

/* ─── VISIBLE PRICE UPDATER ─── */
function updateVisiblePrices() {
  if (!BD_CONFIG) return;
  const fa = BD_CONFIG.forfaits_aeroport || {};
  const fl = BD_CONFIG.forfaits_longue_distance || {};
  const vanParis = fl.paris ? Math.round(fl.paris.berline * (fl.paris.multiplicateur_autres || 1.35)) : null;

  const map = {
    // transfert-aeroport.html
    'price-bru-berline':     fa.bru?.berline,
    'price-bru-berline-2':   fa.bru?.berline,
    'price-bru-berline-faq': fa.bru?.berline,
    'price-crl-berline-faq': fa.crl?.berline,
    // van-premium.html
    'price-van-bru':         fa.bru?.van,
    'price-van-bru-2':       fa.bru?.van,
    'price-van-bru-3':       fa.bru?.van,
    'price-van-bru-4':       fa.bru?.van,
    'price-van-crl-1':       fa.crl?.van,
    'price-van-paris-1':     vanParis,
    // longue-distance.html
    'price-paris-faq':       fl.paris?.berline,
    'price-van-paris-ld':    vanParis,
    // index.html
    'price-badge-berline-bru': fa.bru?.berline,
    'price-badge-crl-berline': fa.crl?.berline,
  };

  Object.entries(map).forEach(([id, val]) => {
    if (val == null) return;
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  });

  // Class-based (review texts use class since same element can't have two ids)
  if (fa.bru?.berline) {
    document.querySelectorAll('.review-price-bru-berline').forEach(el => { el.textContent = fa.bru.berline; });
  }
  if (fa.bru?.van) {
    document.querySelectorAll('.review-price-van-bru').forEach(el => { el.textContent = fa.bru.van; });
  }
}

/* ─── DATE VALIDATION ─── */
function initDateValidation() {
  const now = new Date();
  const today = now.toISOString().split('T')[0];

  document.querySelectorAll('input[type="date"]').forEach(input => {
    input.min = today;
    input.addEventListener('change', function() {
      const timeInput = this.closest('form, .form-group, .form-row-2, .booking-wrap, .qb-inner, #quick-book')
        ?.querySelector('input[type="time"]');
      if (!timeInput) return;
      if (this.value === today) {
        const minTime = new Date(now.getTime() + 2 * 60 * 60 * 1000);
        const hh = String(minTime.getHours()).padStart(2,'0');
        const mm = String(minTime.getMinutes()).padStart(2,'0');
        timeInput.min = `${hh}:${mm}`;
      } else {
        timeInput.min = '';
      }
    });
  });

  // Aussi pour le quick book date
  const qbDate = document.getElementById('qb-date');
  if (qbDate) qbDate.min = today;
}

/* ─── INIT ─── */
let _bdInitDone = false;
document.addEventListener('DOMContentLoaded', async () => {
  if (_bdInitDone) return;
  _bdInitDone = true;
  await loadConfig();
  const page = document.body.dataset.page || '';
  buildNav(page);
  buildFooter();
  initReveal();
  initFaq();
  updateSchemaPrices();
  updateVisiblePrices();
  initDateValidation();
});
