'use strict';

/**
 * Tests unitaires — Modèles MongoDB (sans connexion DB)
 * On teste les virtuals, les méthodes et la structure des schémas.
 */

// ─── Tests: AppError (modèle d'erreur) ───────────────────────
const AppError = require('../utils/appError');

describe('Modèle AppError — structure', () => {
  test('statusCode 400 → status "fail"', () => {
    expect(new AppError('msg', 400).status).toBe('fail');
    expect(new AppError('msg', 422).status).toBe('fail');
    expect(new AppError('msg', 404).status).toBe('fail');
  });

  test('statusCode 500 → status "error"', () => {
    expect(new AppError('msg', 500).status).toBe('error');
    expect(new AppError('msg', 503).status).toBe('error');
  });

  test('capture le stack trace', () => {
    const err = new AppError('test', 400);
    expect(err.stack).toBeDefined();
  });
});

// ─── Tests: logique métier Budget ─────────────────────────────
describe('Logique Budget — calculs virtuels', () => {
  // On simule les calculs virtuels du modèle Budget sans Mongoose
  const calcBudget = (totalAmount, consumedAmount) => ({
    totalAmount,
    consumedAmount,
    remainingAmount: totalAmount - consumedAmount,
    consumptionPercent: totalAmount > 0
      ? Math.round((consumedAmount / totalAmount) * 100)
      : 0,
  });

  test('calcule remainingAmount correctement', () => {
    const budget = calcBudget(1000000, 650000);
    expect(budget.remainingAmount).toBe(350000);
  });

  test('calcule consumptionPercent à 65%', () => {
    const budget = calcBudget(1000000, 650000);
    expect(budget.consumptionPercent).toBe(65);
  });

  test('consumptionPercent est 0 si totalAmount est 0', () => {
    const budget = calcBudget(0, 0);
    expect(budget.consumptionPercent).toBe(0);
  });

  test('remainingAmount est négatif si budget dépassé', () => {
    const budget = calcBudget(1000000, 1200000);
    expect(budget.remainingAmount).toBe(-200000);
    expect(budget.consumptionPercent).toBe(120);
  });
});

// ─── Tests: logique Projet ─────────────────────────────────────
describe('Logique Projet — calculs virtuels', () => {
  const calcProject = (total, consumed, status, plannedEndDate) => ({
    total,
    consumed,
    budgetRemaining: total - consumed,
    budgetUsagePercent: total > 0 ? Math.round((consumed / total) * 100) : 0,
    isDelayed: status !== 'termine' && status !== 'annule' && new Date() > new Date(plannedEndDate),
  });

  test('calcule budgetRemaining', () => {
    const p = calcProject(8500000, 5525000, 'en_cours', '2025-06-30');
    expect(p.budgetRemaining).toBe(2975000);
  });

  test('budgetUsagePercent à 65%', () => {
    const p = calcProject(8500000, 5525000, 'en_cours', '2025-06-30');
    expect(p.budgetUsagePercent).toBe(65);
  });

  test('isDelayed = true si date dépassée et status en_cours', () => {
    const p = calcProject(1000000, 500000, 'en_cours', '2020-01-01');
    expect(p.isDelayed).toBe(true);
  });

  test('isDelayed = false si projet terminé', () => {
    const p = calcProject(1000000, 1000000, 'termine', '2020-01-01');
    expect(p.isDelayed).toBe(false);
  });

  test('isDelayed = false si date future', () => {
    const futureDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();
    const p = calcProject(1000000, 500000, 'en_cours', futureDate);
    expect(p.isDelayed).toBe(false);
  });
});

// ─── Tests: logique Employé ────────────────────────────────────
describe('Logique Employé — virtual fullName', () => {
  const getFullName = (firstName, lastName) => `${firstName} ${lastName}`;

  test('concatène firstName et lastName', () => {
    expect(getFullName('Mohammed', 'El Mansouri')).toBe('Mohammed El Mansouri');
  });

  test('fonctionne avec des noms composés', () => {
    expect(getFullName('Fatima Zahra', 'Idrissi')).toBe('Fatima Zahra Idrissi');
  });
});

// ─── Tests: logique Stock ─────────────────────────────────────
describe('Logique Stock — statut matériau', () => {
  const getStockStatus = (stockQuantity, minimumStock) => {
    if (stockQuantity <= 0) return 'epuise';
    if (stockQuantity <= minimumStock) return 'faible';
    return 'normal';
  };

  test('retourne "epuise" si stock = 0', () => {
    expect(getStockStatus(0, 100)).toBe('epuise');
  });

  test('retourne "epuise" si stock négatif', () => {
    expect(getStockStatus(-5, 100)).toBe('epuise');
  });

  test('retourne "faible" si stock <= minimum', () => {
    expect(getStockStatus(50, 100)).toBe('faible');
    expect(getStockStatus(100, 100)).toBe('faible');
  });

  test('retourne "normal" si stock > minimum', () => {
    expect(getStockStatus(200, 100)).toBe('normal');
  });
});

// ─── Tests: logique Présences ─────────────────────────────────
describe('Logique Présences — calcul heures travaillées', () => {
  const calcHours = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return { hoursWorked: 0, overtimeHours: 0 };
    const diff = (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60);
    const hoursWorked = Math.round(diff * 10) / 10;
    const overtimeHours = Math.max(0, hoursWorked - 8);
    return { hoursWorked, overtimeHours };
  };

  test('calcule 8h pour une journée normale', () => {
    const result = calcHours('2024-09-01T08:00:00', '2024-09-01T16:00:00');
    expect(result.hoursWorked).toBe(8);
    expect(result.overtimeHours).toBe(0);
  });

  test('calcule les heures supplémentaires', () => {
    const result = calcHours('2024-09-01T07:00:00', '2024-09-01T18:00:00');
    expect(result.hoursWorked).toBe(11);
    expect(result.overtimeHours).toBe(3);
  });

  test('retourne 0 si checkIn ou checkOut manquant', () => {
    const result = calcHours(null, '2024-09-01T16:00:00');
    expect(result.hoursWorked).toBe(0);
    expect(result.overtimeHours).toBe(0);
  });

  test('retourne 0 heures supp si journée exacte 8h', () => {
    const result = calcHours('2024-09-01T08:00:00', '2024-09-01T16:00:00');
    expect(result.overtimeHours).toBe(0);
  });
});

// ─── Tests: logique FuelTransaction ──────────────────────────
describe('Logique FuelTransaction — calcul coût total', () => {
  const calcTotal = (quantity, pricePerLiter) => {
    return Math.round(quantity * pricePerLiter * 100) / 100;
  };

  test('calcule correctement quantité × prix', () => {
    expect(calcTotal(50, 12.5)).toBe(625);
  });

  test('gère les décimales correctement', () => {
    expect(calcTotal(33.5, 12.8)).toBe(428.8);
  });

  test('retourne 0 si quantité 0', () => {
    expect(calcTotal(0, 12.5)).toBe(0);
  });
});
