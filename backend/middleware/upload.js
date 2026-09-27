'use strict';

const multer = require('multer');
const path = require('path');
const AppError = require('../utils/appError');

// ─── Stockage local temporaire ─────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/temp'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

// ─── Stockage mémoire (pour Cloudinary) ───────────────────────
const memoryStorage = multer.memoryStorage();

// ─── Filtres de fichiers ───────────────────────────────────────
const imageFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const isValid = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    && allowedTypes.test(file.mimetype);

  if (isValid) cb(null, true);
  else cb(new AppError('Format d\'image invalide. Formats acceptés: jpg, jpeg, png, gif, webp', 400), false);
};

const documentFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|xls|xlsx|dwg|dxf|zip/;
  const isValid = allowedTypes.test(path.extname(file.originalname).toLowerCase());

  if (isValid) cb(null, true);
  else cb(new AppError('Format de fichier non autorisé.', 400), false);
};

// ─── Instances Multer ──────────────────────────────────────────
const MAX_SIZE = parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024; // 10MB

const uploadImage = multer({
  storage: memoryStorage,
  limits: { fileSize: MAX_SIZE },
  fileFilter: imageFilter,
});

const uploadDocument = multer({
  storage: memoryStorage,
  limits: { fileSize: MAX_SIZE },
  fileFilter: documentFilter,
});

const uploadAny = multer({
  storage: memoryStorage,
  limits: { fileSize: MAX_SIZE },
  fileFilter: documentFilter,
});

// ─── Middleware de gestion des erreurs Multer ─────────────────
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return next(new AppError(`Fichier trop grand. Limite: ${MAX_SIZE / 1024 / 1024}MB`, 413));
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return next(new AppError('Trop de fichiers envoyés.', 400));
    }
  }
  next(err);
};

module.exports = {
  uploadImage,
  uploadDocument,
  uploadAny,
  handleMulterError,
};
