# 🚗 Belvia Drive — Site VTC Premium Bruxelles

Site vitrine multilingue (FR/EN/NL) pour Belvia Drive, service de chauffeur privé premium à Bruxelles.

**URL :** https://belviadrive.be  
**Repo :** https://github.com/contactprestigetaxi-cloud/belvia-drive

---

## 📁 Structure du projet

```
belvia-drive/
│
├── 🏠 PAGES FRANÇAIS (racine = /)
│   ├── index.html              → Page d'accueil
│   ├── reservation.html        → Formulaire réservation 4 étapes
│   ├── transfert-aeroport.html → Service transfert aéroport
│   ├── longue-distance.html    → Service longue distance
│   ├── soirees-evenements.html → Service soirées & événements
│   ├── van-premium.html        → Service Van Premium
│   ├── voyage-affaires.html    → Service voyage d'affaires
│   ├── b2b.html                → Page Corporate / B2B
│   ├── taxi-ixelles-aeroport.html → Landing page locale (SEO)
│   ├── conditions.html         → Conditions générales
│   ├── legal.html              → Mentions légales
│   └── privacy.html            → Politique de confidentialité
│
├── 🇬🇧 PAGES ANGLAIS (/en/)
│   ├── en/index.html           → Homepage EN
│   ├── en/reservation.html     → Booking form EN (4 steps)
│   ├── en/airport-transfer.html
│   ├── en/long-distance.html
│   ├── en/events-evenings.html
│   ├── en/van-premium.html
│   ├── en/business-travel.html
│   ├── en/b2b.html             → Corporate EN
│   ├── en/terms.html           → Terms & Conditions EN
│   ├── en/legal.html           → Legal notice EN
│   └── en/privacy.html         → Privacy policy EN
│
├── 🇳🇱 PAGES NÉERLANDAIS (/nl/)
│   ├── nl/index.html           → Homepage NL
│   ├── nl/reservatie.html      → Reservatie formulier NL (4 stappen)
│   ├── nl/luchthaven-transfer.html
│   ├── nl/long-distance.html
│   ├── nl/avond-evenementen.html
│   ├── nl/van-premium.html
│   ├── nl/zakelijk-vervoer.html
│   ├── nl/b2b.html             → Zakelijk NL
│   ├── nl/voorwaarden.html     → Voorwaarden NL
│   ├── nl/legal.html           → Juridische kennisgeving NL
│   └── nl/privacy.html         → Privacybeleid NL
│
├── 📝 BLOG (/blog/)
│   ├── blog/taxi-aeroport-bruxelles-guide-complet.html  → FR
│   ├── blog/airport-taxi-brussels-private-transfer.html  → EN
│   └── blog/taxi-luchthaven-brussel-vtc.html             → NL
│
├── 🎨 ASSETS (/assets/)
│   ├── berline-1.jpg à 6.jpg  → Photos véhicules
│   ├── hero-desk.mp4           → Vidéo hero desktop
│   ├── hero-video-9x16-hq.mp4 → Vidéo hero mobile
│   └── og.jpg                  → Image Open Graph (partage social)
│
├── ⚙️ FICHIERS TECHNIQUES
│   ├── style.css               → Styles globaux (design premium)
│   ├── components.js           → Header, footer, lang switcher, nav
│   ├── config.json             → Config site (prix, véhicules, zones)
│   ├── 404.html                → Page erreur personnalisée
│   ├── robots.txt              → Instructions crawlers SEO
│   ├── sitemap.xml             → Plan du site (33 URLs)
│   └── netlify.toml            → Config Netlify (legacy, plus utilisé)
│
└── 🛠️ SERVEUR (hors repo)
    └── ../serve-site.js         → Serveur Node.js (port interne + Cloudflare Tunnel)
```

---

## 🔄 Workflow Git

| Branche | Usage | URL |
|---------|-------|-----|
| `main` | **Production** — ce qui est en live | belviadrive.be |
| `dev` | **Développement** — modifs et tests en cours | test.belviadrive.be *(à configurer)* |

**Règle :** Jamais de modif directe sur `main`. Toujours travailler sur `dev`, tester, puis merge.

---

## 🌐 Mapping pages FR → EN → NL

| Page | FR (racine) | EN (/en/) | NL (/nl/) |
|------|-------------|-----------|-----------|
| Accueil | `/` | `/en/` | `/nl/` |
| Réservation | `/reservation` | `/en/reservation` | `/nl/reservatie` |
| Aéroport | `/transfert-aeroport` | `/en/airport-transfer` | `/nl/luchthaven-transfer` |
| Longue distance | `/longue-distance` | `/en/long-distance` | `/nl/long-distance` |
| Soirées | `/soirees-evenements` | `/en/events-evenings` | `/nl/avond-evenementen` |
| Van Premium | `/van-premium` | `/en/van-premium` | `/nl/van-premium` |
| Affaires | `/voyage-affaires` | `/en/business-travel` | `/nl/zakelijk-vervoer` |
| Corporate | `/b2b` | `/en/b2b` | `/nl/b2b` |
| CGV | `/conditions` | `/en/terms` | `/nl/voorwaarden` |
| Légal | `/legal` | `/en/legal` | `/nl/legal` |
| Privacy | `/privacy` | `/en/privacy` | `/nl/privacy` |
| Blog aéroport | `/blog/taxi-aeroport-bruxelles-guide-complet` | `/blog/airport-taxi-brussels-private-transfer` | `/blog/taxi-luchthaven-brussel-vtc` |
| Landing Ixelles | `/taxi-ixelles-aeroport` | — | — |

---

## 🔧 Stack technique

- **Frontend :** HTML/CSS/JS statique (pas de framework)
- **Serveur :** Node.js (`serve-site.js`) avec clean URLs
- **DNS :** OVH → Cloudflare
- **HTTPS :** Cloudflare Tunnel
- **SEO :** hreflang (fr-BE, en, nl-BE, x-default), sitemap.xml, robots.txt

---

## ⚠️ Points d'attention

- **`config.json`** contient les prix et configs véhicules — ne pas modifier sans demande explicite de Batiyo
- **`components.js`** gère le header/footer/nav — toute nouvelle page doit être ajoutée dans `PAGE_MAP` ET `navLinks`
- Les chemins dans EN/NL doivent être **absolus** (`/style.css`, `/components.js`) pas relatifs
- Les vidéos hero doivent être encodées H.264 Baseline pour iOS Safari
