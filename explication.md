# 📘 IMARA 360 — Documentation Technique & Pédagogique

> Ce fichier est le **guide complet du projet IMARA 360**. Il documente l'architecture, les fichiers importants, les choix techniques et les workflows métier. Il est mis à jour à chaque phase de développement.

---

## 🏗️ Qu'est-ce que IMARA 360 ?

**IMARA 360** est une plateforme ERP (Enterprise Resource Planning) destinée aux entreprises de **construction, d'immobilier et de grands projets**. Elle centralise la gestion de :
- Projets de construction (résidences, immeubles, villas, routes, infrastructures...)
- Ressources humaines opérationnelles (employés, équipes, présences)
- Matériaux et stocks
- Équipements et maintenance
- Finances (budgets, dépenses, factures, paiements)
- Achats et fournisseurs
- Documents et photos de chantier
- Incidents et qualité
- Notifications temps réel

---

## 🗂️ Architecture Globale

```
BuildCore/
├── backend/              ← API REST Node.js + Express
│   ├── config/           ← Configuration DB, Cloudinary
│   ├── controllers/      ← Logique métier des endpoints
│   ├── models/           ← Schémas MongoDB (Mongoose)
│   ├── routes/           ← Définition des routes API
│   ├── middleware/        ← Auth JWT, Upload, Erreurs, Logger
│   ├── services/         ← Services métier complexes
│   ├── validators/       ← Validation des données entrantes
│   ├── utils/            ← Helpers (logger, apiResponse, appError...)
│   ├── sockets/          ← Socket.io (notifications temps réel)
│   ├── seed/             ← Données de démonstration
│   └── scripts/          ← Scripts utilitaires
│
├── frontend/             ← Interface React + TypeScript
│   └── src/
│       ├── components/   ← Composants réutilisables
│       │   └── layout/   ← Sidebar, Navbar
│       ├── pages/        ← Pages par module métier
│       ├── layouts/      ← AppLayout, AuthLayout
│       ├── hooks/        ← Custom React hooks
│       ├── services/     ← Appels API (axios)
│       ├── context/      ← Auth, Theme, Socket contexts
│       ├── utils/        ← Formatters, constants, cn
│       └── schemas/      ← Validation Zod
│
├── docker-compose.yml    ← Orchestration containers
├── .github/workflows/    ← CI/CD GitHub Actions
└── README.md
```

---

## 🔧 Stack Technique

### Backend
| Technologie | Rôle |
|------------|------|
| **Node.js 20** | Environnement d'exécution JavaScript côté serveur |
| **Express.js** | Framework web — définit les routes, middleware, serveur HTTP |
| **MongoDB** | Base de données NoSQL orientée documents (collections JSON) |
| **Mongoose** | ODM — mappe les documents MongoDB à des objets JavaScript avec schémas |
| **JWT (jsonwebtoken)** | Génération et vérification des tokens d'authentification |
| **bcryptjs** | Hachage sécurisé des mots de passe |
| **Socket.io** | Communication temps réel bidirectionnelle (notifications) |
| **Multer** | Gestion des uploads de fichiers (images, documents) |
| **Cloudinary** | Stockage cloud des fichiers uploadés |
| **Helmet** | Sécurité HTTP (headers de protection) |
| **Winston** | Système de logs professionnel (fichiers + console) |
| **Morgan** | Logger des requêtes HTTP |

### Frontend
| Technologie | Rôle |
|------------|------|
| **React 18** | Librairie UI — composants réutilisables, gestion état |
| **TypeScript** | Typage statique — détection d'erreurs à la compilation |
| **Vite** | Bundler ultra-rapide pour le développement et la production |
| **Tailwind CSS** | Framework CSS utilitaire — styles directement dans les classes HTML |
| **React Router v6** | Navigation côté client (SPA) |
| **Axios** | Client HTTP pour les appels API backend |
| **React Hook Form** | Gestion des formulaires performante |
| **Zod** | Validation des schémas de données (formulaires + API) |
| **Recharts** | Graphiques et visualisations de données |
| **Radix UI** | Composants accessibles (dialog, dropdown, tooltip...) |
| **Socket.io Client** | Connexion WebSocket pour les notifications temps réel |
| **Sonner** | Notifications toast (succès, erreur, info) |
| **Lucide React** | Icônes SVG cohérentes |

---

## 🗄️ Modèles MongoDB (Schémas)

### Pourquoi MongoDB ?
MongoDB est une base **NoSQL orientée documents**. Chaque enregistrement est un document JSON stocké dans une **collection** (équivalent d'une table SQL). On utilise **Mongoose** pour définir des schémas typés, des validations, des hooks et des méthodes sur ces documents.

### Liste des 26 modèles

| Modèle | Collection | Rôle |
|--------|-----------|------|
| `User` | users | Comptes utilisateurs avec rôles RBAC |
| `Project` | projects | Projets de construction/immobilier |
| `ProjectPhase` | projectphases | Phases ordonnées d'un projet |
| `Task` | tasks | Tâches Kanban avec commentaires |
| `Employee` | employees | Employés de l'entreprise |
| `Team` | teams | Équipes de travail |
| `Attendance` | attendances | Présences journalières |
| `DailyReport` | dailyreports | Rapports de chantier |
| `Material` | materials | Catalogue matériaux |
| `StockMovement` | stockmovements | Mouvements de stock |
| `Supplier` | suppliers | Fournisseurs |
| `Client` | clients | Clients |
| `Subcontractor` | subcontractors | Sous-traitants + contrats |
| `Purchase` | purchaserequests | Demandes/bons d'achat |
| `Invoice` | invoices | Factures et paiements |
| `Expense` | expenses | Dépenses par projet |
| `Budget` | budgets | Budgets par projet/phase |
| `Equipment` | equipments | Parc machines/véhicules |
| `Maintenance` | maintenances | Interventions maintenance |
| `FuelTransaction` | fueltransactions | Transactions carburant |
| `Incident` | incidents | Incidents et accidents |
| `QualityControl` | qualitycontrols | Contrôles qualité |
| `Document` | documents | GED (gestion électronique docs) |
| `Photo` | photos | Photos de chantier |
| `Notification` | notifications | Notifications avec TTL |
| `AuditLog` | auditlogs | Journal d'actions (1 an TTL) |

---

## 🔐 Authentification JWT

### Comment ça fonctionne ?

```
1. L'utilisateur saisit email + mot de passe → LoginPage.tsx
       ↓
2. Axios envoie POST /api/v1/auth/login
       ↓
3. auth.controller.js vérifie les credentials
       ↓
4. bcryptjs compare le mot de passe haché en DB
       ↓
5. JWT génère 2 tokens: accessToken (7j) + refreshToken (30j)
       ↓
6. Les tokens sont stockés dans localStorage
       ↓
7. Chaque requête suivante envoie Authorization: Bearer <token>
       ↓
8. middleware/auth.js vérifie et décode le token
       ↓
9. req.user est alimenté avec les données de l'utilisateur
       ↓
10. Le controller reçoit la requête avec l'utilisateur authentifié
```

### Clés localStorage
- `imara360_token` — Token d'accès (JWT, expire en 7 jours)
- `imara360_refresh_token` — Token de renouvellement (expire en 30 jours)
- `imara360_theme` — Préférence thème clair/sombre

### Rôles (RBAC)
| Rôle | Accès |
|------|-------|
| `admin` | Accès total |
| `directeur` | Accès total |
| `chef_projet` | Projets, RH, Stock, Équipements |
| `chef_chantier` | Rapports, Tâches, Présences |
| `responsable_achats` | Achats, Stock, Fournisseurs |
| `responsable_stock` | Stock, Matériaux |
| `responsable_finance` | Finance, Budgets, Factures |
| `responsable_equipements` | Équipements, Maintenance |
| `employe` | Lecture seule, ses tâches |

---

## 🌐 API REST — Routes disponibles

Base URL : `http://localhost:5000/api/v1`

Toutes les routes (sauf auth) requièrent le header :
```
Authorization: Bearer <jwt_token>
```

### Format de réponse standardisé
```json
{
  "success": true,
  "message": "Description",
  "data": { ... },
  "meta": {
    "pagination": {
      "total": 100,
      "page": 1,
      "limit": 20,
      "totalPages": 5
    }
  },
  "timestamp": "2024-09-28T..."
}
```

### Endpoints clés
| Méthode | Route | Description |
|---------|-------|-------------|
| POST | `/auth/login` | Connexion |
| GET | `/auth/me` | Profil connecté |
| GET | `/projects` | Liste projets (paginée) |
| POST | `/projects` | Créer projet |
| GET | `/projects/:id` | Détail projet |
| GET | `/dashboard/stats` | Statistiques globales |
| GET | `/dashboard/overview` | Données récentes |
| GET | `/dashboard/charts` | Données graphiques |
| GET | `/search?q=terme` | Recherche globale |
| PATCH | `/notifications/mark-all-read` | Marquer tout lu |
| GET | `/materials/alerts/low-stock` | Stocks faibles |
| PATCH | `/purchases/:id/approve` | Approuver achat |

---

## ⚡ Socket.io — Temps Réel

### Architecture des rooms
```
user:{userId}     → Notifications personnelles
role:{roleName}   → Broadcast par rôle
project:{id}      → Mises à jour projet
```

### Types de notifications
`nouvelle_tache`, `tache_en_retard`, `stock_faible`, `stock_epuise`, `budget_depasse`, `maintenance_proche`, `incident_critique`, `projet_en_retard`, `nouvelle_facture`, `projet_termine`...

---

## 📁 Fichiers Frontend Importants

### `src/context/AuthContext.tsx`
Gère l'état global d'authentification :
- `user` — données de l'utilisateur connecté
- `login(email, password)` — authentifie et stocke les tokens
- `logout()` — supprime les tokens, redirige
- `isAuthenticated` — booléen pour les routes protégées

### `src/context/ThemeContext.tsx`
Gère le thème clair/sombre :
- Applique la classe `dark` sur `<html>`
- Persiste le choix dans `localStorage`

### `src/context/SocketContext.tsx`
Connexion Socket.io :
- Connecte automatiquement avec le JWT
- Expose `socket` pour écouter les événements

### `src/services/api.ts`
Instance Axios configurée :
- URL de base : `VITE_API_URL`
- Injecte automatiquement le token dans chaque requête
- Intercepteur : redirige vers `/login` si 401

### `src/utils/formatters.ts`
Fonctions de formatage :
- `formatCurrency(amount)` → `"8 500 000 DH"`
- `formatDate(date)` → `"15 janv. 2024"`
- `getInitials(name)` → `"ME"`

### `src/utils/constants.ts`
Toutes les constantes UI :
- Labels et couleurs pour statuts, types, priorités
- Pour : projets, tâches, employés, équipements, stocks, factures, incidents, présences

### `src/components/layout/Sidebar.tsx`
Navigation principale :
- Collapsible (réduit à 64px / ouvert à 256px)
- 12 sections avec sous-menus dépliables
- État actif basé sur l'URL courante
- Responsive avec overlay mobile

### `src/components/layout/Navbar.tsx`
Barre du haut :
- Bouton toggle sidebar
- Bouton recherche globale (Ctrl+K)
- Toggle thème clair/sombre
- Cloche notifications (badge rouge)
- Menu utilisateur avec déconnexion

---

## 📄 Pages Frontend créées (Phase 1)

| Page | Chemin | Description |
|------|--------|-------------|
| Login | `/login` | Connexion avec demo accounts |
| Dashboard | `/dashboard` | KPIs, graphiques, projets récents |
| Projets | `/projects` | Liste avec filtres et recherche |
| Détail projet | `/projects/:id` | Phases, tâches, incidents, budget |
| Créer projet | `/projects/new` | Formulaire complet avec validation |
| Tâches | `/tasks` | Vue Kanban + Liste avec filtres |
| Employés | `/employees` | Cards avec filtres par statut |
| Paramètres | `/settings` | Profil, sécurité, notifs, thème |

---

## 🐳 Docker

### Services docker-compose.yml
| Service | Image | Port |
|---------|-------|------|
| `mongo` | mongo:7.0 | 27017 |
| `backend` | Node.js custom | 5000 |
| `frontend` | Nginx + build Vite | 80 |
| `mongo-express` | mongo-express (dev) | 8081 |

### Lancer avec Docker
```bash
docker-compose up -d            # Production
docker-compose --profile dev up # Dev + Mongo Express
```

---

## 🌱 Seed — Données de démonstration

Après `npm run seed` dans `/backend` :

| Compte | Email | Mot de passe | Rôle |
|--------|-------|--------------|------|
| Directeur | directeur@imara360.ma | Demo123! | directeur |
| Chef projet | chef.projet@imara360.ma | Demo123! | chef_projet |
| Chef chantier | chef.chantier@imara360.ma | Demo123! | chef_chantier |
| Finance | finance@imara360.ma | Demo123! | responsable_finance |
| Stock | stock@imara360.ma | Demo123! | responsable_stock |

Données générées : 5 projets, 30 employés, 10 clients, 10 fournisseurs, 20 matériaux, 10 équipements, tâches, incidents, budgets, notifications.

---

## 📅 Phases de Développement

| Phase | Module | Statut |
|-------|--------|--------|
| ✅ Phase 1 | Architecture, Infrastructure, Docker, Modèles, Routes | **Terminé** |
| 🔄 Phase 2 | Authentification complète, RBAC frontend | À venir |
| ⏳ Phase 3 | Module Projets (API + UI complets) | À venir |
| ⏳ Phase 4 | Tâches, Planning, Incidents | À venir |
| ⏳ Phase 5 | Employés, Équipes, Présences, Équipements | À venir |
| ⏳ Phase 6 | Stock, Matériaux, Achats | À venir |
| ⏳ Phase 7 | Finance: Budgets, Dépenses, Factures | À venir |
| ⏳ Phase 8 | Documents, Photos, Qualité | À venir |
| ⏳ Phase 9 | Notifications temps réel (Socket.io) | À venir |
| ⏳ Phase 10 | Analytics avancés, Exports | À venir |
| ⏳ Phase 11 | Mobile React Native (Expo) | À venir |
| ⏳ Phase 12 | Tests, Production, CI/CD complet | À venir |

---

*Dernière mise à jour : Phase 1 — 28 Septembre 2026*
