<p align="center">
  <img src="https://img.shields.io/badge/IMARA%20360-Plateforme%20ERP-2563eb?style=for-the-badge" alt="IMARA 360"/>
</p>

<h1 align="center">🏗️ IMARA 360</h1>
<h3 align="center">Plateforme ERP pour la Construction, l'Immobilier et les Grands Projets</h3>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-20-339933?logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/MongoDB-7.0-47A248?logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-5.3-3178C6?logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white" />
</p>

---

## 📋 Présentation

**IMARA 360** est une plateforme centralisée de gestion d'entreprise pour les secteurs de la **construction**, de l'**immobilier**, de l'**aménagement** et des **grands projets**. Elle permet à la direction de gérer depuis un seul système l'ensemble des opérations de l'entreprise.

### Objectif

> Digitaliser les opérations d'une entreprise de construction et de grands projets pour répondre en temps réel à toutes les questions stratégiques de la direction.

---

## ✨ Fonctionnalités Principales

| Module | Fonctionnalités |
|--------|----------------|
| **Projets** | CRUD, phases, avancement, planning, fiche projet complète |
| **Tâches** | Kanban, Calendrier, Gantt, dépendances, commentaires |
| **Employés** | RH opérationnel, contrats, présences, équipes |
| **Équipements** | Parc machines/véhicules, maintenance, carburant |
| **Matériaux** | Catalogue, stock, mouvements, alertes |
| **Achats** | Workflow complet DA → BC → Réception → Facture → Paiement |
| **Finance** | Budgets, dépenses, factures, paiements, rapports |
| **Partenaires** | Clients, fournisseurs, sous-traitants |
| **Documents** | GED par projet, catégories, versioning |
| **Qualité** | Contrôles, non-conformités, suivi corrections |
| **Incidents** | Déclaration, priorité, suivi résolution |
| **Analytics** | Dashboard KPIs, graphiques, exports |
| **Notifications** | Temps réel (Socket.io), alertes automatiques |
| **Audit** | Traçabilité complète des actions |

---

## 🏗️ Architecture

```
BuildCore/
├── backend/              # API Node.js + Express
│   ├── config/           # DB, Cloudinary
│   ├── controllers/      # Logique métier
│   ├── models/           # Schémas MongoDB
│   ├── routes/           # Routes API REST
│   ├── middleware/        # Auth, Upload, Errors
│   ├── services/         # Services métier
│   ├── validators/       # Validation Zod/express-validator
│   ├── utils/            # Helpers, Logger, AppError
│   ├── sockets/          # Socket.io
│   ├── seed/             # Données de démonstration
│   └── tests/            # Tests Jest
│
├── frontend/             # App React + Vite + TypeScript
│   └── src/
│       ├── components/   # Composants réutilisables
│       ├── pages/        # Pages par module
│       ├── layouts/      # App + Auth layouts
│       ├── hooks/        # Custom hooks
│       ├── services/     # API services
│       ├── context/      # Auth, Theme, Socket
│       ├── schemas/      # Validation Zod
│       └── utils/        # Formatters, constants, cn
│
├── docker-compose.yml    # Orchestration Docker
├── .github/workflows/    # CI/CD GitHub Actions
└── package.json          # Scripts racine
```

---

## 🛠️ Technologies

### Backend
| Technologie | Version | Usage |
|-------------|---------|-------|
| Node.js | 20 LTS | Runtime |
| Express.js | 4.18 | Framework API |
| MongoDB | 7.0 | Base de données |
| Mongoose | 8.0 | ODM |
| Socket.io | 4.6 | Temps réel |
| JWT | 9.0 | Authentification |
| Bcrypt.js | 2.4 | Hachage mots de passe |
| Multer + Cloudinary | - | Upload fichiers |
| Helmet | 7.1 | Sécurité HTTP |
| Winston | 3.11 | Logging |

### Frontend
| Technologie | Version | Usage |
|-------------|---------|-------|
| React | 18 | UI Framework |
| TypeScript | 5.3 | Typage statique |
| Vite | 5 | Build tool |
| Tailwind CSS | 3.4 | Styles |
| React Router | 6 | Navigation |
| Axios | 1.6 | HTTP Client |
| React Hook Form + Zod | - | Formulaires + validation |
| Recharts | 2.10 | Graphiques |
| Radix UI | - | Composants accessibles |
| Socket.io Client | 4.6 | WebSocket |
| Sonner | 1.3 | Notifications |

---

## 🚀 Installation

### Prérequis
- Node.js >= 18
- MongoDB >= 6
- npm >= 9

### 1. Cloner le projet

```bash
git clone https://github.com/votre-org/imara360.git
cd imara360
```

### 2. Installer les dépendances

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 3. Configurer les variables d'environnement

```bash
# Backend
cp backend/.env.example backend/.env
# Modifier les valeurs dans backend/.env

# Frontend
cp frontend/.env.example frontend/.env
```

### 4. Lancer MongoDB

```bash
# Local
mongod

# Ou avec Docker
docker run -d -p 27017:27017 --name imara360-mongo mongo:7.0
```

### 5. Seeder la base de données

```bash
cd backend
npm run seed
```

### 6. Démarrer l'application

```bash
# Depuis la racine
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev
```

L'application est accessible sur :
- **Frontend** : http://localhost:5173
- **Backend API** : http://localhost:5000/api/v1
- **Health Check** : http://localhost:5000/health

---

## 🐳 Docker

### Démarrer avec Docker Compose

```bash
# Production
docker-compose up -d

# Développement (avec Mongo Express)
docker-compose --profile dev up -d
```

Services disponibles :
- **Frontend** : http://localhost:80
- **Backend** : http://localhost:5000
- **Mongo Express** : http://localhost:8081 (dev uniquement)

### Arrêter

```bash
docker-compose down
```

---

## 📡 API REST

Base URL: `http://localhost:5000/api/v1`

### Authentification

```bash
# Connexion
POST /api/v1/auth/login
Body: { "email": "...", "password": "..." }

# Profil
GET /api/v1/auth/me
Header: Authorization: Bearer <token>
```

### Endpoints principaux

| Ressource | Endpoint |
|-----------|----------|
| Auth | `/api/v1/auth` |
| Projets | `/api/v1/projects` |
| Phases | `/api/v1/project-phases` |
| Tâches | `/api/v1/tasks` |
| Employés | `/api/v1/employees` |
| Équipes | `/api/v1/teams` |
| Présences | `/api/v1/attendance` |
| Rapports | `/api/v1/reports` |
| Matériaux | `/api/v1/materials` |
| Stock | `/api/v1/stock` |
| Fournisseurs | `/api/v1/suppliers` |
| Clients | `/api/v1/clients` |
| Achats | `/api/v1/purchases` |
| Factures | `/api/v1/invoices` |
| Paiements | `/api/v1/payments` |
| Dépenses | `/api/v1/expenses` |
| Budgets | `/api/v1/budgets` |
| Équipements | `/api/v1/equipment` |
| Maintenance | `/api/v1/maintenance` |
| Carburant | `/api/v1/fuel` |
| Incidents | `/api/v1/incidents` |
| Qualité | `/api/v1/quality` |
| Documents | `/api/v1/documents` |
| Photos | `/api/v1/photos` |
| Notifications | `/api/v1/notifications` |
| Audit | `/api/v1/audit` |
| Dashboard | `/api/v1/dashboard` |
| Recherche | `/api/v1/search` |

---

## 🔐 Comptes de Démonstration

Après `npm run seed` :

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Directeur | directeur@imara360.ma | Demo123! |
| Chef de projet | chef.projet@imara360.ma | Demo123! |
| Chef de chantier | chef.chantier@imara360.ma | Demo123! |
| Responsable Stock | stock@imara360.ma | Demo123! |
| Responsable Finance | finance@imara360.ma | Demo123! |

---

## 🔑 Rôles et Permissions

| Rôle | Dashboard | Projets | Finance | Achats | Stock | RH | Équipements |
|------|-----------|---------|---------|--------|-------|----|-------------|
| Admin / Directeur | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Chef de projet | ✅ | ✅ (siens) | 👁 | ✅ | ✅ | ✅ | ✅ |
| Chef de chantier | ✅ | 👁 | ❌ | 📝 | ✅ | 📝 | 👁 |
| Resp. Achats | 👁 | 👁 | 👁 | ✅ | ✅ | ❌ | ❌ |
| Resp. Stock | 👁 | 👁 | ❌ | 👁 | ✅ | ❌ | ❌ |
| Resp. Finance | 👁 | 👁 | ✅ | 👁 | 👁 | ❌ | ❌ |
| Resp. Équipements | 👁 | 👁 | ❌ | ❌ | ❌ | ❌ | ✅ |
| Employé | 👁 | 👁 (sien) | ❌ | ❌ | ❌ | 👁 | ❌ |

✅ Accès complet | 👁 Lecture seule | 📝 Écriture limitée | ❌ Aucun accès

---

## 🧪 Tests

```bash
# Backend
cd backend
npm test

# Avec couverture
npm test -- --coverage
```

---

## 📦 Variables d'Environnement

### Backend (`.env`)

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/imara360
JWT_SECRET=your_secret_minimum_32_chars
JWT_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Frontend (`.env`)

```env
VITE_API_URL=http://localhost:5000/api/v1
VITE_SOCKET_URL=http://localhost:5000
```

---

## 📅 Phases de Développement

| Phase | Module | Statut |
|-------|--------|--------|
| ✅ Phase 1 | Architecture, Infrastructure, Docker | **Terminé** |
| 🔄 Phase 2 | Authentification complète, RBAC | En cours |
| ⏳ Phase 3 | Module Projets complet |  |
| ⏳ Phase 4 | Tâches, Planning, Incidents |  |
| ⏳ Phase 5 | Employés, Équipes, Présences, Équipements |  |
| ⏳ Phase 6 | Matériaux, Stock, Fournisseurs, Achats |  |
| ⏳ Phase 7 | Finance : Budgets, Dépenses, Factures |  |
| ⏳ Phase 8 | Documents, Photos, Qualité |  |
| ⏳ Phase 9 | Socket.io, Notifications, Alertes |  |
| ⏳ Phase 10 | Analytics, Graphiques, Exports |  |
| ⏳ Phase 11 | Mobile React Native (Expo) |  |
| ⏳ Phase 12 | Production, Tests, CI/CD |  |

---

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commit (`git commit -m 'Ajouter nouvelle fonctionnalité'`)
4. Push (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrir une Pull Request

---

## 📄 Licence

MIT License — Copyright (c) 2026 IMARA 360

---

<p align="center">
  Développé avec ❤️ pour les entreprises de construction et d'immobilier
</p>
