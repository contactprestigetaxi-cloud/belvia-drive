# Belvia Drive — Guide de déploiement & intégrations

## 📁 Structure des fichiers

```
belvia-drive/
├── config.json             ← SEUL fichier à modifier pour changer les prix
├── style.css               ← Design system complet (ne pas modifier)
├── components.js           ← Nav, footer, webhook, calculs (ne pas modifier)
├── index.html              ← Homepage
├── reservation.html        ← Simulateur 5 étapes
├── transfert-aeroport.html ← Page SEO aéroport
├── van-premium.html        ← Page SEO Van
├── voyage-affaires.html    ← Page SEO affaires + B2B
├── soirees-evenements.html ← Page soirées + formulaire
├── longue-distance.html    ← Page longue distance
├── sitemap.xml             ← Soumettez à Google Search Console
└── robots.txt              ← SEO crawling
```

---

## 🚀 Mise en ligne en 5 minutes (Netlify)

1. Allez sur **netlify.com** → "Add new site" → "Deploy manually"
2. Glissez-déposez le dossier `belvia-drive/` dans la zone de drop
3. Votre site est en ligne sur une URL netlify.app en 30 secondes
4. Allez dans "Domain settings" → ajoutez `belviadrive.be`
5. Suivez les instructions DNS (pointez vers Netlify sur dns.be)

---

## 💶 Modifier vos tarifs (UNIQUEMENT `config.json`)

Ouvrez `config.json` avec n'importe quel éditeur de texte (Notepad, VS Code).

### Changer le tarif kilométrique d'une berline :
```json
"berline": {
  "base": 8.00,      ← Prise en charge (€)
  "perKm": 2.50,     ← Prix par km (€) — MODIFIEZ ICI
  "min": 28.00       ← Course minimum (€)
}
```

### Changer un forfait aéroport :
```json
"forfaits_aeroport": {
  "bru": {
    "berline": 65,   ← MODIFIEZ CE CHIFFRE
    "van": 92
  }
}
```

**Important** : Sauvegardez → Ré-uploadez le fichier sur Netlify → Les prix se mettent à jour instantanément.

Sur Netlify, vous pouvez aussi éditer `config.json` directement depuis leur interface web.

---

## 📬 Activer les emails de confirmation (Make.com — GRATUIT)

### Étape 1 — Créer le webhook Make.com
1. Allez sur **make.com** → Créer un scénario
2. Cliquez "+" → Cherchez **"Webhooks"** → "Custom webhook"
3. Cliquez "Add" → nommez-le "Belvia Drive réservations"
4. **Copiez l'URL générée** (format : `https://hook.eu1.make.com/XXXXXXXX`)

### Étape 2 — Coller l'URL dans config.json
```json
"webhook": {
  "url": "https://hook.eu1.make.com/VOTRE_ID_ICI",
  "actif": true
}
```

### Étape 3 — Configurer l'email de confirmation dans Make.com
Après le module Webhook, ajoutez :
- **Gmail** → Send Email → À : `{{bookingData.client.email}}`
- Objet : `Confirmation réservation Belvia Drive {{bookingData.ref}}`
- Corps : utilisez les variables `{{bookingData.client.prenom}}`, `{{bookingData.depart}}`, `{{bookingData.arrivee}}`, `{{bookingData.date}}`, `{{bookingData.prix_estime}}`

### Bonus : Notification à vous-même
Ajoutez un 2ème module Gmail → Envoyez-vous un email avec tous les détails à chaque réservation.

### Variables disponibles dans le webhook :
```
bookingData.ref            → Numéro de réservation (ex: BD-A3X7K2)
bookingData.service        → Type de service
bookingData.depart         → Adresse de départ
bookingData.arrivee        → Adresse d'arrivée
bookingData.date           → Date du trajet
bookingData.heure          → Heure de prise en charge
bookingData.passagers      → Nombre de passagers
bookingData.vehicule       → Nom du véhicule
bookingData.prix_estime    → Tarif estimé (€)
bookingData.paiement       → "enligne" ou "abord"
bookingData.client.prenom  → Prénom du client
bookingData.client.nom     → Nom du client
bookingData.client.gsm     → Téléphone
bookingData.client.email   → Email
bookingData.client.notes   → Demandes particulières
bookingData.timestamp      → Horodatage ISO
```

---

## 🗺 Activer Google Maps (adresses + calcul de distance)

1. Allez sur **console.cloud.google.com**
2. Créez un projet → Activez **"Places API"** + **"Distance Matrix API"**
3. Créez une clé API → Collez-la dans `config.json` :
```json
"google_maps": {
  "api_key": "AIzaSy_VOTRE_CLE_ICI",
  "actif": true
}
```
4. Dans `reservation.html`, recherchez les commentaires `/* GM: */` et décommentez les blocs indiqués.

---

## 💳 Activer le paiement en ligne (Mollie — recommandé Belgique)

1. Créez un compte sur **mollie.com** (certifié Belgique, KBC, BNP, Belfius)
2. Récupérez votre clé API Mollie
3. Dans Make.com, ajoutez un module Mollie pour créer un lien de paiement
4. Envoyez le lien dans l'email de confirmation au client

---

## 📊 Google Search Console (SEO)

1. Allez sur **search.google.com/search-console**
2. Ajoutez `belviadrive.be` → Vérification via DNS
3. Soumettez `https://www.belviadrive.be/sitemap.xml`
4. Attendez 48-72h pour l'indexation

---

## 📅 Google My Business (indispensable)

1. Allez sur **business.google.com**
2. Catégorie : **"Service de limousine"**
3. Zone de service : rayon 25km autour de Bruxelles
4. Ajoutez vos photos de véhicules
5. Répondez aux premiers avis → boost SEO local immédiat

---

## ✅ Checklist de lancement

- [ ] Enregistrer `belviadrive.be` sur dns.be (~€10/an)
- [ ] Déployer sur Netlify (glisser-déposer)
- [ ] Connecter le domaine
- [ ] Remplir vos vrais numéros dans `config.json` (téléphone, email, TVA)
- [ ] Remplir vos vrais tarifs dans `config.json`
- [ ] Créer compte Make.com → configurer webhook emails
- [ ] Soumettre sitemap.xml à Google Search Console
- [ ] Créer Google My Business
- [ ] Déposer marque BELVIA DRIVE Classe 39 sur boip.eu (~€244)

---

*Belvia Drive — L'excellence à votre bord*
