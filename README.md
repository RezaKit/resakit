# 🚀 ResaKit

> Marketplace de réservation d'expériences de groupe à Toulouse.
> EVJF, anniversaires, team building — avec paiement splitté entre participants.

---

## 📦 Ce qui est inclus

Projet **Next.js 14** complet prêt à être déployé avec :

- ✅ **Homepage** avec hero, occasions, listing, waitlist
- ✅ **Pages ville/catégorie** SEO-optimisées
- ✅ **Pages expériences** avec galerie, description, widget réservation
- ✅ **Wizard de réservation 3 étapes** (créneau, infos, paiement)
- ✅ **Stripe Connect** complet (commission automatique sur compte prestataire)
- ✅ **Split paiement** entre participants avec lien unique magique
- ✅ **Dashboard prestataire** avec métriques et Stripe onboarding
- ✅ **Authentification** Supabase
- ✅ **5 templates emails** React Email (confirmation, split invite, rappel J-1, notification prestataire, welcome)
- ✅ **SEO** : sitemap dynamique, robots.txt, métadonnées
- ✅ **Pages légales** : mentions, CGV, politique de confidentialité
- ✅ **Schéma BDD complet** avec RLS Supabase
- ✅ **Données seed** pour tester immédiatement

---

## ⚡ Démarrage en 10 minutes

### 1. Installer les dépendances

```bash
npm install
```

### 2. Renommer les fichiers cachés

```bash
mv gitignore.txt .gitignore
mv env.example.txt .env.example
cp .env.example .env.local
```

### 3. Configurer les variables d'environnement

Ouvre `.env.local` et remplis avec tes clés :

**Supabase** (gratuit)
1. Crée un projet sur [supabase.com](https://supabase.com)
2. Project Settings → API → copie l'URL et les clés

**Stripe** (gratuit)
1. Crée un compte sur [stripe.com](https://stripe.com)
2. Developers → API keys → copie les clés de test (`sk_test_` et `pk_test_`)
3. Active **Stripe Connect** → Settings → Connect → Get started

**Resend** (gratuit jusqu'à 3k emails/mois)
1. Crée un compte sur [resend.com](https://resend.com)
2. API Keys → Create API key

### 4. Initialiser la base de données

Dans le dashboard Supabase → SQL Editor :

```bash
# Copie-colle le contenu de supabase/migrations/001_initial.sql
# Clique sur "Run"
```

Cette migration crée toutes les tables, triggers, RLS et 3 prestataires de test.

### 5. Configurer le webhook Stripe en local

Dans un autre terminal :

```bash
# Installe Stripe CLI si pas déjà fait
brew install stripe/stripe-cli/stripe  # Mac
# ou choco install stripe-cli  # Windows

# Login
stripe login

# Lance le forwarder
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Copie le webhook secret affiché (`whsec_...`) dans `.env.local` → `STRIPE_WEBHOOK_SECRET`.

### 6. Lancer le projet

```bash
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000) 🎉

---

## 🗂️ Structure du projet

```
rezakit/
├── src/
│   ├── app/
│   │   ├── (public)/          # Pages publiques
│   │   │   ├── [city]/        # /toulouse, /toulouse/[category]/[slug]
│   │   │   ├── book/          # Flow de réservation
│   │   │   ├── booking/       # Page de succès
│   │   │   ├── join/          # Split payment
│   │   │   ├── pour-les-pros/ # Landing prestataires
│   │   │   └── [pages légales]
│   │   ├── (auth)/login/      # Auth prestataire
│   │   ├── dashboard/         # Dashboard protégé
│   │   ├── api/               # API routes (Stripe, waitlist, auth)
│   │   ├── layout.tsx
│   │   ├── page.tsx           # Homepage
│   │   ├── sitemap.ts
│   │   └── robots.ts
│   ├── components/
│   │   ├── ui/                # Button, Input, Card, Badge
│   │   ├── layout/            # Header, Footer
│   │   ├── experience/        # ExperienceCard
│   │   ├── booking/           # BookingWidget, BookingWizard, SplitLink
│   │   └── dashboard/
│   ├── lib/
│   │   ├── supabase/          # Clients BDD
│   │   ├── stripe/            # Helpers Stripe Connect
│   │   ├── resend/            # Service emails
│   │   └── utils.ts
│   ├── emails/                # 5 templates React Email
│   └── types/
│       └── database.ts        # Types TypeScript complets
├── supabase/
│   └── migrations/
│       └── 001_initial.sql   # Schéma complet + seed
├── package.json
├── .env.example
└── README.md
```

---

## 🔑 Comptes nécessaires (tous gratuits au départ)

| Service | Usage | Lien |
|---------|-------|------|
| **Supabase** | BDD + Auth + Storage | [supabase.com](https://supabase.com) |
| **Stripe** | Paiements + Connect | [stripe.com](https://stripe.com) |
| **Resend** | Emails transactionnels | [resend.com](https://resend.com) |
| **Vercel** | Déploiement | [vercel.com](https://vercel.com) |

---

## 🚢 Déployer en production

### Sur Vercel

```bash
# Connecte ton repo GitHub à Vercel
# Ajoute les variables d'environnement dans Vercel → Settings → Environment Variables
# Déploie
```

### Webhook Stripe en production

1. Dashboard Stripe → Developers → Webhooks → Add endpoint
2. URL : `https://resakit.fr/api/stripe/webhook`
3. Événements à écouter :
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `account.updated`
4. Copie le secret → Vercel env vars → `STRIPE_WEBHOOK_SECRET`

### Domaine

1. Vercel → Settings → Domains → Add `resakit.fr`
2. Configure les DNS chez ton registrar selon les instructions Vercel

---

## 🧪 Tester le flow complet

1. **Créer un prestataire de test** : déjà fait par la migration seed
2. **Créer un compte Stripe Connect** pour ce prestataire :
   - Login en tant que prestataire (tu dois d'abord créer l'utilisateur Supabase)
   - Dashboard → Settings → Configurer Stripe
3. **Tester une réservation** :
   - Accueil → clique sur une expérience
   - Flow de réservation → utilise la carte test Stripe : `4242 4242 4242 4242`
   - Confirmation → vérifie que l'email arrive (Resend dashboard)
4. **Tester le split payment** :
   - Active la case "Paiement splitté" lors de la réservation
   - Récupère le lien `/join/[code]` dans l'email
   - Ouvre-le en navigation privée pour simuler un participant

---

## 📚 Documentation

Trois guides complets sont fournis séparément :
- `rezakit-plan-complet.md` — Stratégie business complète
- `rezakit-guide-technique.md` — Guide dev et prompts Claude Code
- `rezakit-demarchage.md` — Scripts et templates de démarchage

---

## 🎨 Personnalisation

### Couleurs brand

Modifie dans `tailwind.config.ts` :
```ts
brand: {
  violet: "#7C3AED",
  orange: "#F97316",
}
```

### Commission par défaut

Dans `.env.local` :
```
NEXT_PUBLIC_DEFAULT_COMMISSION_RATE=0.10  # 10%
```

Par prestataire : modifie `commission_rate` dans la table `providers`.

### Ajouter une ville

1. Modifie la liste dans `src/app/(public)/[city]/page.tsx`
2. Ajoute des prestataires avec cette ville dans Supabase

---

## ⚠️ Points d'attention

### Stripe Connect Express en France

- Activer "Connect" dans le dashboard Stripe avant le premier onboarding
- Les prestataires doivent compléter KYC (pièce d'identité, IBAN, etc.)
- Les payouts arrivent sous 7 jours (standard)

### RGPD

- Les CGV et politique de confidentialité sont des templates — **fais-les relire par un juriste**
- Crée ton statut juridique (auto-entrepreneur minimum) avant de toucher du cash
- Mentionne ton SIRET dans les mentions légales

### Sécurité

- Ne commit **jamais** `.env.local`
- La `SUPABASE_SERVICE_ROLE_KEY` ne doit **jamais** être exposée côté client
- Active RLS sur toutes les tables (déjà fait dans la migration)

---

## 🐛 Problèmes fréquents

**"Relation does not exist"** → tu n'as pas lancé la migration SQL  
**"Missing Supabase URL"** → tu n'as pas rempli `.env.local`  
**"Stripe account not onboarded"** → le prestataire doit compléter Stripe Connect avant de pouvoir recevoir des réservations  
**Webhook fails en dev** → relance `stripe listen --forward-to localhost:3000/api/stripe/webhook`

---

## 📞 Support

Questions techniques : relis `rezakit-guide-technique.md`  
Questions business : relis `rezakit-plan-complet.md`  
Questions démarchage : relis `rezakit-demarchage.md`

---

**Bonne chance avec ResaKit ! 🚀**
