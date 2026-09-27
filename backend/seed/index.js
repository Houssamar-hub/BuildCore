'use strict';

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const logger = require('../utils/logger');

// Models
const User = require('../models/User');
const Project = require('../models/Project');
const Employee = require('../models/Employee');
const Team = require('../models/Team');
const Client = require('../models/Client');
const Supplier = require('../models/Supplier');
const Material = require('../models/Material');
const Equipment = require('../models/Equipment');
const Task = require('../models/Task');
const Incident = require('../models/Incident');
const Notification = require('../models/Notification');
const Budget = require('../models/Budget');
const Expense = require('../models/Expense');
const { Invoice } = require('../models/Invoice');

const RESET = process.argv.includes('--reset');

/**
 * Se connecter à MongoDB
 */
const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/imara360');
  logger.info('✅ MongoDB connecté pour le seed');
};

/**
 * Nettoyer la base de données
 */
const clearDB = async () => {
  if (RESET) {
    logger.info('🗑️  Nettoyage de la base de données...');
    await Promise.all([
      User.deleteMany({}),
      Project.deleteMany({}),
      Employee.deleteMany({}),
      Team.deleteMany({}),
      Client.deleteMany({}),
      Supplier.deleteMany({}),
      Material.deleteMany({}),
      Equipment.deleteMany({}),
      Task.deleteMany({}),
      Incident.deleteMany({}),
      Notification.deleteMany({}),
      Budget.deleteMany({}),
      Expense.deleteMany({}),
      Invoice.deleteMany({}),
    ]);
    logger.info('✅ Base de données nettoyée');
  }
};

/**
 * Créer les utilisateurs
 */
const seedUsers = async () => {
  const hashedPassword = await bcrypt.hash('Demo123!', 10);

  const users = [
    {
      firstName: 'Mohammed',
      lastName: 'El Mansouri',
      email: 'directeur@imara360.ma',
      password: hashedPassword,
      role: 'directeur',
      phone: '+212 661 234 567',
      isActive: true,
    },
    {
      firstName: 'Ahmed',
      lastName: 'Benali',
      email: 'chef.projet@imara360.ma',
      password: hashedPassword,
      role: 'chef_projet',
      phone: '+212 662 345 678',
      isActive: true,
    },
    {
      firstName: 'Karim',
      lastName: 'Alaoui',
      email: 'chef.projet2@imara360.ma',
      password: hashedPassword,
      role: 'chef_projet',
      phone: '+212 663 456 789',
      isActive: true,
    },
    {
      firstName: 'Youssef',
      lastName: 'Chraibi',
      email: 'chef.chantier@imara360.ma',
      password: hashedPassword,
      role: 'chef_chantier',
      phone: '+212 664 567 890',
      isActive: true,
    },
    {
      firstName: 'Hassan',
      lastName: 'Tazi',
      email: 'chef.chantier2@imara360.ma',
      password: hashedPassword,
      role: 'chef_chantier',
      phone: '+212 665 678 901',
      isActive: true,
    },
    {
      firstName: 'Salma',
      lastName: 'Berrada',
      email: 'chef.chantier3@imara360.ma',
      password: hashedPassword,
      role: 'chef_chantier',
      phone: '+212 666 789 012',
      isActive: true,
    },
    {
      firstName: 'Fatima',
      lastName: 'Zahra Idrissi',
      email: 'finance@imara360.ma',
      password: hashedPassword,
      role: 'responsable_finance',
      phone: '+212 667 890 123',
      isActive: true,
    },
    {
      firstName: 'Omar',
      lastName: 'El Fassi',
      email: 'stock@imara360.ma',
      password: hashedPassword,
      role: 'responsable_stock',
      phone: '+212 668 901 234',
      isActive: true,
    },
    {
      firstName: 'Rachid',
      lastName: 'Benmoussa',
      email: 'achats@imara360.ma',
      password: hashedPassword,
      role: 'responsable_achats',
      phone: '+212 669 012 345',
      isActive: true,
    },
    {
      firstName: 'Nadia',
      lastName: 'Hakkoum',
      email: 'equipements@imara360.ma',
      password: hashedPassword,
      role: 'responsable_equipements',
      phone: '+212 660 123 456',
      isActive: true,
    },
  ];

  const created = await User.insertMany(users);
  logger.info(`✅ ${created.length} utilisateurs créés`);
  return created;
};

/**
 * Créer les clients
 */
const seedClients = async (directorId) => {
  const clients = [
    { firstName: 'Amine', lastName: 'El Hajoui', clientType: 'particulier', phone: '+212 661 111 111', city: 'Casablanca', email: 'a.elhajoui@gmail.com', createdBy: directorId },
    { companyName: 'Groupe Immobilier Atlas', clientType: 'promoteur', ice: '000123456789', phone: '+212 522 333 444', city: 'Casablanca', email: 'contact@atlas-immo.ma', createdBy: directorId },
    { firstName: 'Sara', lastName: 'Benkirane', clientType: 'particulier', phone: '+212 661 222 333', city: 'Rabat', email: 's.benkirane@email.ma', createdBy: directorId },
    { companyName: 'Agence Nationale des Routes', clientType: 'institution', ice: '000987654321', phone: '+212 537 456 789', city: 'Rabat', email: 'contact@anrt.ma', createdBy: directorId },
    { companyName: 'Lotissements Nour Maroc', clientType: 'promoteur', ice: '000456789123', phone: '+212 524 567 890', city: 'Marrakech', email: 'info@nour-maroc.ma', createdBy: directorId },
  ];
  const created = await Client.insertMany(clients);
  logger.info(`✅ ${created.length} clients créés`);
  return created;
};

/**
 * Créer les fournisseurs
 */
const seedSuppliers = async (directorId) => {
  const suppliers = [
    { companyName: 'Ciments du Maroc', categories: ['materiaux'], phone: '+212 522 444 555', city: 'Casablanca', email: 'ventes@cimentsdumaroc.ma', rating: 5, createdBy: directorId },
    { companyName: 'Bricoma Matériaux', categories: ['materiaux'], phone: '+212 522 555 666', city: 'Casablanca', email: 'contact@bricoma.ma', rating: 4, createdBy: directorId },
    { companyName: 'Fer & Acier Maroc', categories: ['materiaux'], phone: '+212 523 666 777', city: 'Mohammedia', email: 'info@fer-acier.ma', rating: 4, createdBy: directorId },
    { companyName: 'ElectroPro Maroc', categories: ['electricite'], phone: '+212 522 777 888', city: 'Casablanca', email: 'contact@electropro.ma', rating: 4, createdBy: directorId },
    { companyName: 'Plomberie Générale', categories: ['plomberie'], phone: '+212 522 888 999', city: 'Casablanca', email: 'pg@plomberie.ma', rating: 3, createdBy: directorId },
    { companyName: 'Afriquia Carburants', categories: ['carburant'], phone: '+212 522 999 000', city: 'Casablanca', email: 'pros@afriquia.ma', rating: 5, createdBy: directorId },
    { companyName: 'Location Engins Atlas', categories: ['equipements'], phone: '+212 537 111 222', city: 'Rabat', email: 'loc@engins-atlas.ma', rating: 4, createdBy: directorId },
    { companyName: 'Transport Express Maghreb', categories: ['transport'], phone: '+212 522 222 333', city: 'Casablanca', email: 'info@transport-express.ma', rating: 3, createdBy: directorId },
    { companyName: 'Carrelage & Revêtements', categories: ['materiaux'], phone: '+212 524 333 444', city: 'Marrakech', email: 'ventes@carrelage-mr.ma', rating: 4, createdBy: directorId },
    { companyName: 'Bois & Menuiserie Atlas', categories: ['materiaux'], phone: '+212 535 444 555', city: 'Fès', email: 'contact@bois-atlas.ma', rating: 3, createdBy: directorId },
  ];
  const created = await Supplier.insertMany(suppliers);
  logger.info(`✅ ${created.length} fournisseurs créés`);
  return created;
};

/**
 * Créer les projets
 */
const seedProjects = async (users, clients) => {
  const [director, chefProjet1, chefProjet2] = users;

  const projects = [
    {
      reference: 'PRJ-2024-001',
      name: 'Résidence Al Amal',
      type: 'residence',
      description: 'Complexe résidentiel de 48 appartements avec parking souterrain, piscine et espaces verts. Projet en cours sur Casablanca.',
      client: clients[0]._id,
      location: { address: 'Lot 15, Quartier Hay Hassani', city: 'Casablanca', region: 'Grand Casablanca' },
      dates: { startDate: new Date('2024-01-15'), plannedEndDate: new Date('2025-06-30') },
      budget: { total: 8500000, consumed: 5525000 },
      progress: 65,
      status: 'en_cours',
      priority: 'haute',
      manager: director._id,
      projectManager: chefProjet1._id,
      createdBy: director._id,
    },
    {
      reference: 'PRJ-2024-002',
      name: 'Immeuble Casablanca Business Center',
      type: 'immeuble',
      description: 'Immeuble de bureaux R+10 en centre-ville. 8 000 m² de surface utile avec parking 3 niveaux.',
      client: clients[1]._id,
      location: { address: 'Boulevard Zerktouni', city: 'Casablanca', region: 'Grand Casablanca' },
      dates: { startDate: new Date('2024-03-01'), plannedEndDate: new Date('2026-02-28') },
      budget: { total: 12000000, consumed: 5040000 },
      progress: 42,
      status: 'en_cours',
      priority: 'haute',
      manager: director._id,
      projectManager: chefProjet2._id,
      createdBy: director._id,
    },
    {
      reference: 'PRJ-2024-003',
      name: 'Villa Sidi Maarouf - Lot 7',
      type: 'villa',
      description: 'Villa de luxe 500m² avec piscine, jardin paysagé et domotique complète.',
      client: clients[2]._id,
      location: { address: 'Lotissement Sidi Maarouf, Lot 7', city: 'Casablanca', region: 'Grand Casablanca' },
      dates: { startDate: new Date('2023-09-01'), plannedEndDate: new Date('2024-08-31') },
      budget: { total: 3200000, consumed: 2688000 },
      progress: 78,
      status: 'en_retard',
      priority: 'haute',
      manager: director._id,
      projectManager: chefProjet1._id,
      createdBy: director._id,
    },
    {
      reference: 'PRJ-2024-004',
      name: 'Route Provinciale - Section Settat-Berrechid',
      type: 'route',
      description: 'Réhabilitation et mise à niveau de 45 km de route provinciale incluant drainage et signalisation.',
      client: clients[3]._id,
      location: { city: 'Settat', region: 'Chaouia-Ouardigha' },
      dates: { startDate: new Date('2024-10-01'), plannedEndDate: new Date('2025-12-31') },
      budget: { total: 6800000, consumed: 680000 },
      progress: 10,
      status: 'preparation',
      priority: 'critique',
      manager: director._id,
      projectManager: chefProjet2._id,
      createdBy: director._id,
    },
    {
      reference: 'PRJ-2024-005',
      name: 'Aménagement Lotissement Nour - Phase 1',
      type: 'lotissement',
      description: 'Aménagement de 120 lots avec VRD complets: voirie, eau potable, assainissement, électricité et éclairage public.',
      client: clients[4]._id,
      location: { address: 'Zone extension Sud', city: 'Marrakech', region: 'Marrakech-Safi' },
      dates: { startDate: new Date('2024-11-01'), plannedEndDate: new Date('2026-04-30') },
      budget: { total: 4200000, consumed: 210000 },
      progress: 5,
      status: 'planification',
      priority: 'normale',
      manager: director._id,
      projectManager: chefProjet1._id,
      createdBy: director._id,
    },
  ];

  const created = await Project.insertMany(projects);
  logger.info(`✅ ${created.length} projets créés`);
  return created;
};

/**
 * Créer les matériaux
 */
const seedMaterials = async (suppliers, directorId) => {
  const materials = [
    { reference: 'MAT-001', name: 'Ciment Portland CEM II', category: 'gros_oeuvre', unit: 'sac', averagePrice: 85, stockQuantity: 500, minimumStock: 100, mainSupplier: suppliers[0]._id, createdBy: directorId },
    { reference: 'MAT-002', name: 'Fer à béton HA 12mm', category: 'ferronnerie', unit: 'tonne', averagePrice: 7800, stockQuantity: 25, minimumStock: 5, mainSupplier: suppliers[2]._id, createdBy: directorId },
    { reference: 'MAT-003', name: 'Sable de rivière', category: 'gros_oeuvre', unit: 'm3', averagePrice: 120, stockQuantity: 200, minimumStock: 50, createdBy: directorId },
    { reference: 'MAT-004', name: 'Gravier 10/20', category: 'gros_oeuvre', unit: 'm3', averagePrice: 140, stockQuantity: 180, minimumStock: 50, createdBy: directorId },
    { reference: 'MAT-005', name: 'Briques creuses 12 trous', category: 'gros_oeuvre', unit: 'unite', averagePrice: 3.5, stockQuantity: 15000, minimumStock: 3000, mainSupplier: suppliers[1]._id, createdBy: directorId },
    { reference: 'MAT-006', name: 'Carrelage 60x60 Beige', category: 'revetement', unit: 'm2', averagePrice: 95, stockQuantity: 800, minimumStock: 200, mainSupplier: suppliers[8]._id, createdBy: directorId },
    { reference: 'MAT-007', name: 'Peinture intérieure blanche', category: 'peinture', unit: 'litre', averagePrice: 25, stockQuantity: 400, minimumStock: 100, createdBy: directorId },
    { reference: 'MAT-008', name: 'Câble électrique 2.5mm²', category: 'electricite', unit: 'ml', averagePrice: 8, stockQuantity: 2000, minimumStock: 500, mainSupplier: suppliers[3]._id, createdBy: directorId },
    { reference: 'MAT-009', name: 'Tuyau PVC PN16 - 40mm', category: 'plomberie', unit: 'ml', averagePrice: 12, stockQuantity: 1200, minimumStock: 300, mainSupplier: suppliers[4]._id, createdBy: directorId },
    { reference: 'MAT-010', name: 'Bois de coffrage', category: 'charpente', unit: 'm3', averagePrice: 3200, stockQuantity: 8, minimumStock: 2, mainSupplier: suppliers[9]._id, createdBy: directorId },
    { reference: 'MAT-011', name: 'Enduit de façade', category: 'second_oeuvre', unit: 'sac', averagePrice: 65, stockQuantity: 50, minimumStock: 80, createdBy: directorId },
    { reference: 'MAT-012', name: 'Fer à béton HA 8mm', category: 'ferronnerie', unit: 'tonne', averagePrice: 7600, stockQuantity: 12, minimumStock: 3, mainSupplier: suppliers[2]._id, createdBy: directorId },
    { reference: 'MAT-013', name: 'Parpaing creux 15', category: 'gros_oeuvre', unit: 'unite', averagePrice: 5, stockQuantity: 8000, minimumStock: 2000, createdBy: directorId },
    { reference: 'MAT-014', name: 'Plâtre fin', category: 'second_oeuvre', unit: 'sac', averagePrice: 45, stockQuantity: 150, minimumStock: 50, createdBy: directorId },
    { reference: 'MAT-015', name: 'Carrelage Sol 40x40 Gris', category: 'revetement', unit: 'm2', averagePrice: 72, stockQuantity: 0, minimumStock: 100, mainSupplier: suppliers[8]._id, createdBy: directorId },
    { reference: 'MAT-016', name: 'Isolation laine de roche', category: 'isolation', unit: 'm2', averagePrice: 45, stockQuantity: 300, minimumStock: 100, createdBy: directorId },
    { reference: 'MAT-017', name: 'Colle carrelage', category: 'revetement', unit: 'sac', averagePrice: 55, stockQuantity: 200, minimumStock: 50, createdBy: directorId },
    { reference: 'MAT-018', name: 'Peinture extérieure façade', category: 'peinture', unit: 'litre', averagePrice: 38, stockQuantity: 250, minimumStock: 80, createdBy: directorId },
    { reference: 'MAT-019', name: 'Tableau électrique 24 modules', category: 'electricite', unit: 'unite', averagePrice: 350, stockQuantity: 15, minimumStock: 5, mainSupplier: suppliers[3]._id, createdBy: directorId },
    { reference: 'MAT-020', name: 'Robinetterie sanitaire standard', category: 'sanitaire', unit: 'unite', averagePrice: 280, stockQuantity: 30, minimumStock: 10, mainSupplier: suppliers[4]._id, createdBy: directorId },
  ];

  const created = await Material.insertMany(materials);
  logger.info(`✅ ${created.length} matériaux créés`);
  return created;
};

/**
 * Créer les équipements
 */
const seedEquipments = async (projects, directorId) => {
  const equipments = [
    { reference: 'EQ-001', name: 'Grue à tour 50 tonnes', type: 'grue', brand: 'Liebherr', model: '85 EC-B', status: 'en_utilisation', condition: 'bon', currentProject: projects[0]._id, acquisitionDate: new Date('2021-01-01'), acquisitionCost: 1200000, usage: { hoursWorked: 4500 }, createdBy: directorId },
    { reference: 'EQ-002', name: 'Pelle hydraulique 20T', type: 'pelle', brand: 'Caterpillar', model: '320', status: 'disponible', condition: 'bon', acquisitionDate: new Date('2020-06-01'), acquisitionCost: 850000, usage: { hoursWorked: 6200, kilometers: 0 }, createdBy: directorId },
    { reference: 'EQ-003', name: 'Bétonnière 500L', type: 'betonniere', brand: 'Altrad', model: 'B500', status: 'en_utilisation', condition: 'excellent', currentProject: projects[1]._id, acquisitionDate: new Date('2022-03-01'), acquisitionCost: 35000, usage: { hoursWorked: 1800 }, createdBy: directorId },
    { reference: 'EQ-004', name: 'Camion benne 30T', type: 'camion', brand: 'Mercedes', model: 'Actros 3340', registrationNumber: '12345-A-6', status: 'en_utilisation', condition: 'bon', currentProject: projects[3]._id, acquisitionDate: new Date('2019-09-01'), acquisitionCost: 680000, usage: { kilometers: 145000 }, createdBy: directorId },
    { reference: 'EQ-005', name: 'Camion benne 20T', type: 'camion', brand: 'Renault', model: 'K520', registrationNumber: '67890-B-5', status: 'disponible', condition: 'bon', acquisitionDate: new Date('2021-05-01'), acquisitionCost: 520000, usage: { kilometers: 89000 }, createdBy: directorId },
    { reference: 'EQ-006', name: 'Groupe électrogène 200 kVA', type: 'groupe_electrogene', brand: 'Cummins', model: 'C200D5', status: 'disponible', condition: 'excellent', acquisitionDate: new Date('2023-01-01'), acquisitionCost: 180000, usage: { hoursWorked: 450 }, createdBy: directorId },
    { reference: 'EQ-007', name: 'Compresseur d\'air 500L', type: 'compresseur', brand: 'Atlas Copco', model: 'GA 37', status: 'en_maintenance', condition: 'moyen', acquisitionDate: new Date('2018-11-01'), acquisitionCost: 95000, usage: { hoursWorked: 8900 }, createdBy: directorId },
    { reference: 'EQ-008', name: 'Chargeuse sur roues', type: 'chargeuse', brand: 'JCB', model: '437', status: 'en_utilisation', condition: 'bon', currentProject: projects[3]._id, acquisitionDate: new Date('2020-01-01'), acquisitionCost: 920000, usage: { hoursWorked: 5100 }, createdBy: directorId },
    { reference: 'EQ-009', name: 'Véhicule de direction Toyota', type: 'vehicule', brand: 'Toyota', model: 'Land Cruiser V8', registrationNumber: '11111-A-1', status: 'disponible', condition: 'excellent', acquisitionDate: new Date('2023-03-01'), acquisitionCost: 480000, usage: { kilometers: 35000 }, createdBy: directorId },
    { reference: 'EQ-010', name: 'Nacelle télescopique 18m', type: 'nacelle', brand: 'Haulotte', model: 'HA 18 PX', status: 'disponible', condition: 'bon', acquisitionDate: new Date('2022-07-01'), acquisitionCost: 145000, usage: { hoursWorked: 950 }, createdBy: directorId },
  ];

  const created = await Equipment.insertMany(equipments);
  logger.info(`✅ ${created.length} équipements créés`);
  return created;
};

/**
 * Créer les employés
 */
const seedEmployees = async (projects, users, directorId) => {
  const professions = ['macon', 'electricien', 'plombier', 'peintre', 'menuisier', 'technicien', 'chauffeur', 'conducteur_engin', 'manoeuvre'];
  const contractTypes = ['cdi', 'cdd', 'interim'];

  const employees = [];

  // Employés fixes
  const fixedEmployees = [
    { firstName: 'Ali', lastName: 'Boutahar', cin: 'AB123456', profession: 'macon', salary: { base: 3500 }, currentProject: projects[0]._id },
    { firstName: 'Khalid', lastName: 'Ziani', cin: 'ZK234567', profession: 'electricien', salary: { base: 4200 }, currentProject: projects[0]._id },
    { firstName: 'Mourad', lastName: 'Naciri', cin: 'NM345678', profession: 'plombier', salary: { base: 4000 }, currentProject: projects[1]._id },
    { firstName: 'Jamal', lastName: 'Lahrichi', cin: 'LJ456789', profession: 'technicien', salary: { base: 4800 }, currentProject: projects[1]._id },
    { firstName: 'Ayoub', lastName: 'Mouhib', cin: 'MA567890', profession: 'conducteur_engin', salary: { base: 5500 }, currentProject: projects[3]._id },
    { firstName: 'Ibrahim', lastName: 'Chakib', cin: 'CI678901', profession: 'chauffeur', salary: { base: 4200 }, currentProject: projects[3]._id },
    { firstName: 'Hamid', lastName: 'Ouali', cin: 'OH789012', profession: 'macon', salary: { base: 3200 }, currentProject: projects[2]._id },
    { firstName: 'Aziz', lastName: 'Bensalah', cin: 'BA890123', profession: 'peintre', salary: { base: 3000 }, currentProject: projects[2]._id },
    { firstName: 'Driss', lastName: 'Kettani', cin: 'KD901234', profession: 'menuisier', salary: { base: 3800 } },
    { firstName: 'Noureddin', lastName: 'Hakimi', cin: 'HN012345', profession: 'technicien', salary: { base: 4500 } },
  ];

  for (let i = 0; i < fixedEmployees.length; i++) {
    employees.push({
      employeeId: `EMP-${String(i + 1).padStart(3, '0')}`,
      ...fixedEmployees[i],
      contractType: contractTypes[i % 3],
      hireDate: new Date(`202${Math.floor(i / 3)}-01-01`),
      status: 'actif',
      phone: `+212 6${60 + i} ${String(100000 + i * 11111).slice(0, 3)} ${String(100000 + i * 11111).slice(3, 6)}`,
      createdBy: directorId,
    });
  }

  // 20 employés supplémentaires
  const firstNames = ['Hassan', 'Rachid', 'Yassine', 'Mohamed', 'Said', 'Tariq', 'Badr', 'Walid', 'Karima', 'Layla', 'Soukaina', 'Hajar', 'Meryem', 'Zineb', 'Amina', 'Hicham', 'Nabil', 'Anas', 'Bilal', 'Adil'];
  const lastNames = ['Amrani', 'Bensouda', 'Cherkaoui', 'Drissi', 'El Filali', 'Fassi', 'Ghali', 'Hamouda', 'Ibrahimi', 'Jbilou'];

  for (let i = 0; i < 20; i++) {
    employees.push({
      employeeId: `EMP-${String(i + 11).padStart(3, '0')}`,
      firstName: firstNames[i],
      lastName: lastNames[i % 10],
      cin: `MC${String(100000 + i * 12345).slice(0, 6)}`,
      profession: professions[i % professions.length],
      contractType: contractTypes[i % 3],
      hireDate: new Date(`202${Math.floor(i / 7)}-0${(i % 11) + 1}-01`),
      salary: { base: 2800 + (i * 100) },
      status: i < 18 ? 'actif' : 'inactif',
      currentProject: i < 15 ? projects[i % 5]._id : undefined,
      phone: `+212 6${70 + (i % 10)} ${String(200000 + i * 10000).slice(0, 3)} ${String(200000 + i * 10000).slice(3, 6)}`,
      createdBy: directorId,
    });
  }

  const created = await Employee.insertMany(employees);
  logger.info(`✅ ${created.length} employés créés`);
  return created;
};

/**
 * Créer quelques tâches
 */
const seedTasks = async (projects, users) => {
  const [director, chefProjet1, chefProjet2] = users;

  const tasks = [
    { title: 'Étude de sol et topographie', project: projects[0]._id, status: 'terminee', priority: 'haute', progress: 100, assignedTo: chefProjet1._id, createdBy: director._id },
    { title: 'Ferraillage fondations Bloc A', project: projects[0]._id, status: 'terminee', priority: 'haute', progress: 100, assignedTo: chefProjet1._id, createdBy: director._id },
    { title: 'Coulage béton RDC', project: projects[0]._id, status: 'en_cours', priority: 'haute', progress: 60, assignedTo: chefProjet1._id, createdBy: director._id },
    { title: 'Installation réseau électrique RDC', project: projects[0]._id, status: 'a_faire', priority: 'normale', progress: 0, assignedTo: chefProjet1._id, createdBy: director._id },
    { title: 'Fondations immeuble - Pieux', project: projects[1]._id, status: 'terminee', priority: 'critique', progress: 100, assignedTo: chefProjet2._id, createdBy: director._id },
    { title: 'Structure R+2', project: projects[1]._id, status: 'en_cours', priority: 'haute', progress: 45, assignedTo: chefProjet2._id, createdBy: director._id },
    { title: 'Finitions peinture villa', project: projects[2]._id, status: 'en_cours', priority: 'haute', progress: 80, assignedTo: chefProjet1._id, createdBy: director._id },
    { title: 'Installation piscine', project: projects[2]._id, status: 'en_cours', priority: 'normale', progress: 50, assignedTo: chefProjet1._id, dueDate: new Date('2024-08-31'), createdBy: director._id },
    { title: 'Étude technique route', project: projects[3]._id, status: 'en_cours', priority: 'critique', progress: 30, assignedTo: chefProjet2._id, createdBy: director._id },
    { title: 'Planification phases lotissement', project: projects[4]._id, status: 'a_faire', priority: 'normale', progress: 0, assignedTo: chefProjet1._id, createdBy: director._id },
  ];

  const created = await Task.insertMany(tasks);
  logger.info(`✅ ${created.length} tâches créées`);
  return created;
};

/**
 * Créer des incidents
 */
const seedIncidents = async (projects, users) => {
  const [director, chefProjet1] = users;

  const incidents = [
    {
      reference: 'INC-2024-001',
      title: 'Retard livraison ciment',
      type: 'manque_materiel',
      project: projects[0]._id,
      date: new Date('2024-08-15'),
      description: 'Le fournisseur n\'a pas pu livrer les 200 sacs de ciment prévus. Impact sur planning de 3 jours.',
      priority: 'haute',
      status: 'resolu',
      reportedBy: chefProjet1._id,
      resolution: 'Approvisionnement d\'urgence chez un autre fournisseur',
    },
    {
      reference: 'INC-2024-002',
      title: 'Fissures mur maçonnerie Bloc B',
      type: 'probleme_qualite',
      project: projects[0]._id,
      date: new Date('2024-09-01'),
      description: 'Fissures détectées dans la maçonnerie du Bloc B niveau R+2. Analyse en cours.',
      priority: 'critique',
      status: 'en_cours',
      reportedBy: chefProjet1._id,
      assignedTo: director._id,
      impact: 'eleve',
    },
    {
      reference: 'INC-2024-003',
      title: 'Panne grue à tour',
      type: 'probleme_technique',
      project: projects[1]._id,
      date: new Date('2024-09-10'),
      description: 'Panne du câblage électrique de la grue. Arrêt de 2 jours de travaux.',
      priority: 'haute',
      status: 'resolu',
      reportedBy: chefProjet1._id,
      actualCost: 15000,
      resolution: 'Remplacement câblage par technicien Liebherr',
    },
  ];

  const created = await Incident.insertMany(incidents);
  logger.info(`✅ ${created.length} incidents créés`);
  return created;
};

/**
 * Créer des budgets
 */
const seedBudgets = async (projects, directorId) => {
  const budgets = projects.map((project, i) => ({
    project: project._id,
    name: `Budget Principal - ${project.name}`,
    totalAmount: project.budget.total,
    consumedAmount: project.budget.consumed,
    status: 'en_cours',
    breakdown: [
      { category: 'Matériaux', plannedAmount: project.budget.total * 0.45, consumedAmount: project.budget.consumed * 0.45 },
      { category: 'Main d\'oeuvre', plannedAmount: project.budget.total * 0.30, consumedAmount: project.budget.consumed * 0.30 },
      { category: 'Équipements', plannedAmount: project.budget.total * 0.15, consumedAmount: project.budget.consumed * 0.15 },
      { category: 'Divers', plannedAmount: project.budget.total * 0.10, consumedAmount: project.budget.consumed * 0.10 },
    ],
    createdBy: directorId,
  }));

  const created = await Budget.insertMany(budgets);
  logger.info(`✅ ${created.length} budgets créés`);
  return created;
};

/**
 * Créer des notifications
 */
const seedNotifications = async (users) => {
  const [director, chefProjet1, chefProjet2] = users;

  const notifications = [
    { recipient: director._id, type: 'projet_en_retard', title: 'Projet en retard', message: 'La Villa Sidi Maarouf dépasse sa date prévue de livraison.', priority: 'haute', isRead: false },
    { recipient: director._id, type: 'budget_alerte', title: 'Alerte budget', message: 'Le budget de Résidence Al Amal est consommé à 65%.', priority: 'normale', isRead: true },
    { recipient: chefProjet1._id, type: 'nouvelle_tache', title: 'Nouvelle tâche assignée', message: 'Ferraillage fondations - Bloc A vous a été assigné.', priority: 'normale', isRead: false },
    { recipient: director._id, type: 'stock_faible', title: 'Stock faible', message: 'Le stock de Carrelage Sol 40x40 Gris est épuisé.', priority: 'haute', isRead: false },
    { recipient: chefProjet2._id, type: 'nouvel_incident', title: 'Nouvel incident signalé', message: 'Panne grue à tour signalée sur le chantier Casablanca Business.', priority: 'critique', isRead: true },
  ];

  const created = await Notification.insertMany(notifications);
  logger.info(`✅ ${created.length} notifications créées`);
  return created;
};

/**
 * Fonction principale
 */
const seed = async () => {
  try {
    logger.info('🌱 Démarrage du seed IMARA 360...');
    await connectDB();
    await clearDB();

    const users = await seedUsers();
    const directorId = users[0]._id;

    const [clients, suppliers] = await Promise.all([
      seedClients(directorId),
      seedSuppliers(directorId),
    ]);

    const projects = await seedProjects(users, clients);

    const [materials, equipments, employees] = await Promise.all([
      seedMaterials(suppliers, directorId),
      seedEquipments(projects, directorId),
      seedEmployees(projects, users, directorId),
    ]);

    await Promise.all([
      seedTasks(projects, users),
      seedIncidents(projects, users),
      seedBudgets(projects, directorId),
      seedNotifications(users),
    ]);

    logger.info('');
    logger.info('════════════════════════════════════════');
    logger.info('  ✅ SEED IMARA 360 TERMINÉ AVEC SUCCÈS');
    logger.info('════════════════════════════════════════');
    logger.info(`  👥 ${users.length} utilisateurs`);
    logger.info(`  🏗️  ${projects.length} projets`);
    logger.info(`  👷 ${employees.length} employés`);
    logger.info(`  🏢 ${clients.length} clients`);
    logger.info(`  🏭 ${suppliers.length} fournisseurs`);
    logger.info(`  📦 ${materials.length} matériaux`);
    logger.info(`  🚜 ${equipments.length} équipements`);
    logger.info('════════════════════════════════════════');
    logger.info('');
    logger.info('  🔑 Comptes de connexion:');
    logger.info('  directeur@imara360.ma / Demo123!');
    logger.info('  chef.projet@imara360.ma / Demo123!');
    logger.info('  chef.chantier@imara360.ma / Demo123!');
    logger.info('════════════════════════════════════════');

    process.exit(0);
  } catch (error) {
    logger.error('❌ Erreur seed:', error);
    process.exit(1);
  }
};

seed();
