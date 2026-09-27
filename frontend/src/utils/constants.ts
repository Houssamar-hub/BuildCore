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
