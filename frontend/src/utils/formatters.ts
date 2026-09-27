import { format, formatDistanceToNow, isValid, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

// Formater une date
export const formatDate = (date: string | Date | null | undefined, pattern = 'dd/MM/yyyy'): string => {
  if (!date) return '-';
  const d = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(d)) return '-';
  return format(d, pattern, { locale: fr });
};

// Formater date + heure
export const formatDateTime = (date: string | Date | null | undefined): string => {
  return formatDate(date, 'dd/MM/yyyy HH:mm');
};

// Distance depuis maintenant
export const fromNow = (date: string | Date | null | undefined): string => {
  if (!date) return '-';
  const d = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(d)) return '-';
  return formatDistanceToNow(d, { addSuffix: true, locale: fr });
};

// Formater un montant
export const formatCurrency = (amount: number | null | undefined, currency = 'MAD'): string => {
  if (amount === null || amount === undefined) return '-';
  return new Intl.NumberFormat('fr-MA', {
    style: 'currency',
    currency: currency === 'MAD' ? 'MAD' : 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount).replace('MAD', 'DH');
};

// Formater un nombre
export const formatNumber = (n: number | null | undefined): string => {
  if (n === null || n === undefined) return '-';
  return new Intl.NumberFormat('fr-MA').format(n);
};

// Formater la taille d'un fichier
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

// Initiales depuis un nom complet
export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Couleur de progression
export const getProgressColor = (progress: number): string => {
  if (progress >= 90) return 'bg-green-500';
  if (progress >= 60) return 'bg-blue-500';
  if (progress >= 30) return 'bg-yellow-500';
  return 'bg-red-500';
};
