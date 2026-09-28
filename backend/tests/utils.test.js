'use strict';

/**
 * Tests utilitaires — apiResponse, appError, asyncHandler, formatters
 */

const { sendSuccess, sendError, sendPaginated } = require('../utils/apiResponse');
const AppError = require('../utils/appError');
const asyncHandler = require('../utils/asyncHandler');

// ─── Mock Express res/req/next ──────────────────────────────────
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
  user: { _id: 'user123', role: 'admin' },
  ...overrides,
});

const mockNext = jest.fn();

// ─── Tests: sendSuccess ────────────────────────────────────────
describe('apiResponse — sendSuccess', () => {
  beforeEach(() => jest.clearAllMocks());

  test('renvoie un statut 200 avec success: true', () => {
    const res = mockRes();
    sendSuccess(res, 200, 'Opération réussie', { id: 1 });

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        message: 'Opération réussie',
        data: { id: 1 },
      })
    );
  });

  test('inclut un timestamp dans la réponse', () => {
    const res = mockRes();
    sendSuccess(res, 201, 'Créé');

    const call = res.json.mock.calls[0][0];
    expect(call.timestamp).toBeDefined();
    expect(typeof call.timestamp).toBe('string');
  });

  test('renvoie un statut 201 pour une création', () => {
    const res = mockRes();
    sendSuccess(res, 201, 'Créé avec succès', { name: 'Projet A' });
    expect(res.status).toHaveBeenCalledWith(201);
  });

  test('fonctionne sans data (data optionnelle)', () => {
    const res = mockRes();
    sendSuccess(res, 200, 'Supprimé');
    const call = res.json.mock.calls[0][0];
    expect(call.success).toBe(true);
    expect(call.message).toBe('Supprimé');
  });
});

// ─── Tests: sendError ──────────────────────────────────────────
describe('apiResponse — sendError', () => {
  beforeEach(() => jest.clearAllMocks());

  test('renvoie success: false avec le message d\'erreur', () => {
    const res = mockRes();
    sendError(res, 400, 'Données invalides');

    expect(res.status).toHaveBeenCalledWith(400);
    const call = res.json.mock.calls[0][0];
    expect(call.success).toBe(false);
    expect(call.message).toBe('Données invalides');
  });

  test('renvoie un statut 404 pour ressource non trouvée', () => {
    const res = mockRes();
    sendError(res, 404, 'Projet introuvable');
    expect(res.status).toHaveBeenCalledWith(404);
  });
});

// ─── Tests: sendPaginated ─────────────────────────────────────
describe('apiResponse — sendPaginated', () => {
  beforeEach(() => jest.clearAllMocks());

  test('calcule correctement la pagination', () => {
    const res = mockRes();
    const items = [{ id: 1 }, { id: 2 }];
    sendPaginated(res, items, 45, 2, 20);

    const call = res.json.mock.calls[0][0];
    expect(call.success).toBe(true);
    expect(call.data).toEqual(items);
    expect(call.meta.pagination).toMatchObject({
      total: 45,
      page: 2,
      limit: 20,
      totalPages: 3,
      hasNextPage: true,
      hasPrevPage: true,
    });
  });

  test('hasNextPage est false sur la dernière page', () => {
    const res = mockRes();
    sendPaginated(res, [], 20, 2, 20);
    const call = res.json.mock.calls[0][0];
    expect(call.meta.pagination.hasNextPage).toBe(false);
  });

  test('hasPrevPage est false sur la première page', () => {
    const res = mockRes();
    sendPaginated(res, [], 100, 1, 20);
    const call = res.json.mock.calls[0][0];
    expect(call.meta.pagination.hasPrevPage).toBe(false);
  });

  test('totalPages est 1 quand items <= limit', () => {
    const res = mockRes();
    sendPaginated(res, [{ id: 1 }], 5, 1, 20);
    const call = res.json.mock.calls[0][0];
    expect(call.meta.pagination.totalPages).toBe(1);
  });
});

// ─── Tests: AppError ──────────────────────────────────────────
describe('AppError', () => {
  test('crée une erreur avec statusCode et message', () => {
    const err = new AppError('Accès refusé', 403);
    expect(err.message).toBe('Accès refusé');
    expect(err.statusCode).toBe(403);
    expect(err.isOperational).toBe(true);
  });

  test('est une instance de Error', () => {
    const err = new AppError('Erreur', 500);
    expect(err).toBeInstanceOf(Error);
  });

  test('status est "fail" pour les erreurs 4xx', () => {
    const err = new AppError('Bad Request', 400);
    expect(err.status).toBe('fail');
  });

  test('status est "error" pour les erreurs 5xx', () => {
    const err = new AppError('Server Error', 500);
    expect(err.status).toBe('error');
  });

  test('isOperational est true par défaut', () => {
    const err = new AppError('Test', 404);
    expect(err.isOperational).toBe(true);
  });
});

// ─── Tests: asyncHandler ──────────────────────────────────────
describe('asyncHandler', () => {
  beforeEach(() => jest.clearAllMocks());

  test('appelle la fonction async et laisse passer les résultats', async () => {
    const fn = jest.fn().mockResolvedValue('ok');
    const wrapped = asyncHandler(fn);
    const req = mockReq();
    const res = mockRes();

    await wrapped(req, res, mockNext);
    expect(fn).toHaveBeenCalledWith(req, res, mockNext);
  });

  test('appelle next(err) si la fonction async throw', async () => {
    const error = new Error('Async error');
    const fn = jest.fn().mockRejectedValue(error);
    const wrapped = asyncHandler(fn);

    await wrapped(mockReq(), mockRes(), mockNext);
    expect(mockNext).toHaveBeenCalledWith(error);
  });

  test('appelle next(err) si AppError est thrown', async () => {
    const appErr = new AppError('Non trouvé', 404);
    const fn = jest.fn().mockRejectedValue(appErr);
    const wrapped = asyncHandler(fn);

    await wrapped(mockReq(), mockRes(), mockNext);
    expect(mockNext).toHaveBeenCalledWith(appErr);
    expect(mockNext.mock.calls[0][0].statusCode).toBe(404);
  });
});
