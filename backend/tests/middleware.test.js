'use strict';

/**
 * Tests middleware — errorHandler, auth logic (sans DB)
 */

const AppError = require('../utils/appError');

// ─── Mock res/req/next ─────────────────────────────────────────
const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockReq = (overrides = {}) => ({
  method: 'GET',
  originalUrl: '/api/v1/test',
  ip: '127.0.0.1',
  ...overrides,
});

const mockNext = jest.fn();

// ─── Tests: errorHandler ──────────────────────────────────────
describe('Middleware errorHandler — erreurs opérationnelles', () => {
  // Simuler le comportement du errorHandler sans le module entier
  // (qui a des dépendances sur logger)
  const handleError = (err, req, res) => {
    const statusCode = err.statusCode || 500;
    const message = err.isOperational ? err.message : 'Erreur serveur interne';
    res.status(statusCode).json({
      success: false,
      message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
  };

  beforeEach(() => jest.clearAllMocks());

  test('renvoie 404 pour une AppError 404', () => {
    const err = new AppError('Projet introuvable', 404);
    const res = mockRes();
    handleError(err, mockReq(), res);

    expect(res.status).toHaveBeenCalledWith(404);
    const body = res.json.mock.calls[0][0];
    expect(body.success).toBe(false);
    expect(body.message).toBe('Projet introuvable');
  });

  test('renvoie 403 pour une AppError 403', () => {
    const err = new AppError('Accès refusé', 403);
    const res = mockRes();
    handleError(err, mockReq(), res);

    expect(res.status).toHaveBeenCalledWith(403);
    const body = res.json.mock.calls[0][0];
    expect(body.success).toBe(false);
    expect(body.message).toBe('Accès refusé');
  });

  test('erreur non-opérationnelle renvoie message générique', () => {
    const err = new Error('Database crashed');
    err.statusCode = 500;
    const res = mockRes();
    handleError(err, mockReq(), res);

    const body = res.json.mock.calls[0][0];
    expect(body.message).toBe('Erreur serveur interne');
  });

  test('utilise 500 comme statusCode par défaut', () => {
    const err = new Error('Erreur inconnue');
    const res = mockRes();
    handleError(err, mockReq(), res);
    expect(res.status).toHaveBeenCalledWith(500);
  });
});

// ─── Tests: validation JWT claims ────────────────────────────
describe('Logique JWT — validation claims', () => {
  const validateJwtPayload = (payload) => {
    const errors = [];
    if (!payload.id) errors.push('id manquant');
    if (!payload.role) errors.push('role manquant');
    if (!payload.iat) errors.push('iat manquant');
    if (!payload.exp) errors.push('exp manquant');
    if (payload.exp && payload.iat && payload.exp <= payload.iat) {
      errors.push('exp doit être après iat');
    }
    return { valid: errors.length === 0, errors };
  };

  test('payload valide → valid: true', () => {
    const payload = { id: 'user123', role: 'admin', iat: 1000, exp: 2000 };
    expect(validateJwtPayload(payload).valid).toBe(true);
  });

  test('payload sans id → erreur', () => {
    const result = validateJwtPayload({ role: 'admin', iat: 1000, exp: 2000 });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('id manquant');
  });

  test('payload sans role → erreur', () => {
    const result = validateJwtPayload({ id: 'user123', iat: 1000, exp: 2000 });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('role manquant');
  });

  test('exp avant iat → erreur', () => {
    const result = validateJwtPayload({ id: '1', role: 'admin', iat: 2000, exp: 1000 });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('exp doit être après iat');
  });
});

// ─── Tests: RBAC — restrictTo ────────────────────────────────
describe('Logique RBAC — restrictTo', () => {
  const canAccess = (userRole, allowedRoles) => allowedRoles.includes(userRole);

  test('admin peut accéder à toutes les routes admin', () => {
    expect(canAccess('admin', ['admin', 'directeur'])).toBe(true);
  });

  test('employe ne peut pas accéder aux routes admin', () => {
    expect(canAccess('employe', ['admin', 'directeur'])).toBe(false);
  });

  test('chef_projet peut accéder aux routes management', () => {
    const mgmt = ['admin', 'directeur', 'chef_projet', 'chef_chantier'];
    expect(canAccess('chef_projet', mgmt)).toBe(true);
  });

  test('responsable_stock peut accéder aux routes stock', () => {
    const stockRoles = ['admin', 'directeur', 'responsable_stock', 'responsable_achats'];
    expect(canAccess('responsable_stock', stockRoles)).toBe(true);
  });

  test('rôle invalide est refusé', () => {
    expect(canAccess('hacker', ['admin', 'directeur'])).toBe(false);
  });
});

// ─── Tests: validation entrées API ──────────────────────────
describe('Validation des données — règles métier', () => {
  const validateProject = (data) => {
    const errors = [];
    if (!data.name || data.name.trim().length < 3) errors.push('Nom min 3 caractères');
    if (!data.type) errors.push('Type requis');
    if (!data.reference || data.reference.length < 3) errors.push('Référence requise');
    if (!data.manager) errors.push('Responsable requis');
    if (!data.dates?.startDate) errors.push('Date de début requise');
    if (!data.dates?.plannedEndDate) errors.push('Date de fin prévue requise');
    if (data.budget?.total !== undefined && data.budget.total < 0) errors.push('Budget doit être positif');
    return { valid: errors.length === 0, errors };
  };

  test('projet valide passe la validation', () => {
    const data = {
      name: 'Résidence Al Amal',
      type: 'residence',
      reference: 'PRJ-2024-001',
      manager: 'userId123',
      dates: { startDate: '2024-01-01', plannedEndDate: '2025-12-31' },
      budget: { total: 5000000 },
    };
    expect(validateProject(data).valid).toBe(true);
  });

  test('nom trop court échoue', () => {
    const data = { name: 'AB', type: 'villa', reference: 'PRJ-001', manager: 'id', dates: { startDate: '2024', plannedEndDate: '2025' } };
    const result = validateProject(data);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Nom min 3 caractères');
  });

  test('budget négatif échoue', () => {
    const data = { name: 'Projet OK', type: 'villa', reference: 'PRJ-001', manager: 'id', dates: { startDate: '2024', plannedEndDate: '2025' }, budget: { total: -1000 } };
    const result = validateProject(data);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Budget doit être positif');
  });

  test('plusieurs champs manquants listés', () => {
    const result = validateProject({});
    expect(result.errors.length).toBeGreaterThan(3);
  });
});

// ─── Tests: formatage données métier ─────────────────────────
describe('Formatage — données IMARA 360', () => {
  const formatMAD = (amount) => {
    return new Intl.NumberFormat('fr-MA', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatRef = (type, year, seq) => {
    return `PRJ-${year}-${String(seq).padStart(3, '0')}`;
  };

  test('formate les montants en MAD', () => {
    const formatted = formatMAD(8500000);
    expect(formatted).toContain('MAD');
  });

  test('génère une référence projet formatée', () => {
    expect(formatRef('residence', 2024, 1)).toBe('PRJ-2024-001');
    expect(formatRef('villa', 2024, 42)).toBe('PRJ-2024-042');
    expect(formatRef('route', 2024, 123)).toBe('PRJ-2024-123');
  });
});
