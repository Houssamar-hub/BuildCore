// Rôles utilisateurs
export const USER_ROLES = {
  ADMIN: 'admin',
  DIRECTEUR: 'directeur',
  CHEF_PROJET: 'chef_projet',
  CHEF_CHANTIER: 'chef_chantier',
  RESPONSABLE_ACHATS: 'responsable_achats',
  RESPONSABLE_STOCK: 'responsable_stock',
  RESPONSABLE_FINANCE: 'responsable_finance',
  RESPONSABLE_EQUIPEMENTS: 'responsable_equipements',
  EMPLOYE: 'employe',
} as const;

export const ROLE_LABELS: Record<string, string> = {
  admin: 'Administrateur',
  directeur: 'Directeur',
  chef_projet: 'Chef de Projet',
  chef_chantier: 'Chef de Chantier',
  responsable_achats: 'Responsable Achats',
  responsable_stock: 'Responsable Stock',
  responsable_finance: 'Responsable Finance',
  responsable_equipements: 'Responsable Équipements',
  employe: 'Employé',
};

export const PROJECT_STATUS_LABELS: Record<string, string> = {
  prospection: 'Prospection',
  preparation: 'Préparation',
  planification: 'Planification',
  en_cours: 'En cours',
  en_pause: 'En pause',
  en_retard: 'En retard',
  termine: 'Terminé',
  annule: 'Annulé',
};

export const PROJECT_TYPE_LABELS: Record<string, string> = {
  residence: 'Résidence',
  immeuble: 'Immeuble',
  villa: 'Villa',
  maison: 'Maison',
  lotissement: 'Lotissement',
  construction_commerciale: 'Construction Commerciale',
  construction_industrielle: 'Construction Industrielle',
  route: 'Route',
  infrastructure: 'Infrastructure',
  amenagement: 'Aménagement',
  equipement: 'Équipement',
  installation: 'Installation',
  renovation: 'Rénovation',
  maintenance: 'Maintenance',
  autre: 'Autre',
};

export const PROJECT_STATUS_COLORS: Record<string, string> = {
  prospection: 'bg-purple-100 text-purple-700',
  preparation: 'bg-blue-100 text-blue-700',
  planification: 'bg-cyan-100 text-cyan-700',
  en_cours: 'bg-green-100 text-green-700',
  en_pause: 'bg-yellow-100 text-yellow-700',
  en_retard: 'bg-red-100 text-red-700',
  termine: 'bg-slate-100 text-slate-700',
  annule: 'bg-gray-100 text-gray-500',
};

export const TASK_STATUS_LABELS: Record<string, string> = {
  a_faire: 'À faire',
  en_cours: 'En cours',
  bloquee: 'Bloquée',
  terminee: 'Terminée',
};

export const PRIORITY_LABELS: Record<string, string> = {
  basse: 'Basse',
  normale: 'Normale',
  haute: 'Haute',
  critique: 'Critique',
};

export const PRIORITY_COLORS: Record<string, string> = {
  basse: 'badge-default',
  normale: 'badge-info',
  haute: 'badge-warning',
  critique: 'badge-danger',
};

export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';
export const ITEMS_PER_PAGE = 20;
export const CURRENCY = 'MAD';
export const CURRENCY_SYMBOL = 'DH';
export const LOCALE = 'fr-MA';

export const EQUIPMENT_STATUS_LABELS: Record<string, string> = {
  disponible: 'Disponible', en_utilisation: 'En utilisation', en_maintenance: 'En maintenance',
  hors_service: 'Hors service', loue: 'Loué', vendu: 'Vendu',
};
export const EQUIPMENT_STATUS_COLORS: Record<string, string> = {
  disponible: 'badge-success', en_utilisation: 'badge-info', en_maintenance: 'badge-warning',
  hors_service: 'badge-danger', loue: 'badge-default', vendu: 'badge-default',
};
export const EQUIPMENT_TYPE_LABELS: Record<string, string> = {
  grue: 'Grue', pelle: 'Pelle hydraulique', chargeuse: 'Chargeuse', betonniere: 'Bétonnière',
  camion: 'Camion', vehicule: 'Véhicule', echafaudage: 'Échafaudage', groupe_electrogene: 'Groupe électrogène',
  compresseur: 'Compresseur', pompe: 'Pompe', malaxeur: 'Malaxeur', nacelle: 'Nacelle',
  forklift: 'Chariot élévateur', outillage: 'Outillage', autre: 'Autre',
};
export const MATERIAL_CATEGORY_LABELS: Record<string, string> = {
  gros_oeuvre: 'Gros œuvre', second_oeuvre: 'Second œuvre', electricite: 'Électricité',
  plomberie: 'Plomberie', menuiserie: 'Menuiserie', revetement: 'Revêtement',
  peinture: 'Peinture', ferronnerie: 'Ferronnerie', isolation: 'Isolation',
  charpente: 'Charpente', carrelage: 'Carrelage', sanitaire: 'Sanitaire', autre: 'Autre',
};
export const STOCK_STATUS_LABELS: Record<string, string> = { epuise: 'Épuisé', faible: 'Stock faible', normal: 'Normal' };
export const STOCK_STATUS_COLORS: Record<string, string> = { epuise: 'badge-danger', faible: 'badge-warning', normal: 'badge-success' };
export const EXPENSE_CATEGORY_LABELS: Record<string, string> = {
  materiaux: 'Matériaux', main_oeuvre: "Main d'œuvre", transport: 'Transport', carburant: 'Carburant',
  location: 'Location', maintenance: 'Maintenance', sous_traitance: 'Sous-traitance',
  fournisseurs: 'Fournisseurs', logistique: 'Logistique', electricite: 'Électricité',
  eau: 'Eau', telephonie: 'Téléphonie', formation: 'Formation', securite: 'Sécurité', autres: 'Autres',
};
export const INVOICE_STATUS_LABELS: Record<string, string> = {
  brouillon: 'Brouillon', envoyee: 'Envoyée', payee: 'Payée',
  partiellement_payee: 'Partiellement payée', en_retard: 'En retard', annulee: 'Annulée',
};
export const INVOICE_STATUS_COLORS: Record<string, string> = {
  brouillon: 'badge-default', envoyee: 'badge-info', payee: 'badge-success',
  partiellement_payee: 'badge-warning', en_retard: 'badge-danger', annulee: 'badge-default',
};
export const INCIDENT_STATUS_LABELS: Record<string, string> = { ouvert: 'Ouvert', en_cours: 'En cours', resolu: 'Résolu', clos: 'Clos' };
export const INCIDENT_STATUS_COLORS: Record<string, string> = { ouvert: 'badge-danger', en_cours: 'badge-warning', resolu: 'badge-success', clos: 'badge-default' };
export const ATTENDANCE_STATUS_LABELS: Record<string, string> = {
  present: 'Présent', absent: 'Absent', retard: 'Retard', conge: 'Congé', maladie: 'Maladie', mission: 'Mission',
};
export const ATTENDANCE_STATUS_COLORS: Record<string, string> = {
  present: 'badge-success', absent: 'badge-danger', retard: 'badge-warning',
  conge: 'badge-info', maladie: 'badge-warning', mission: 'badge-default',
};
