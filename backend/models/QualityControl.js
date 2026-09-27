'use strict';

const mongoose = require('mongoose');

const qualityControlSchema = new mongoose.Schema(
  {
    reference: { type: String, unique: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    phase: { type: mongoose.Schema.Types.ObjectId, ref: 'ProjectPhase' },
    date: { type: Date, required: true, default: Date.now },
    type: {
      type: String,
      enum: ['controle_materiau', 'controle_travaux', 'controle_conformite', 'reception', 'audit', 'autre'],
      required: true,
    },
    title: { type: String, required: true, trim: true },
    description: String,
    inspector: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    result: {
      type: String,
      enum: ['conforme', 'non_conforme', 'partiellement_conforme', 'en_attente'],
      default: 'en_attente',
    },
    checkItems: [{
      description: String,
      result: { type: String, enum: ['ok', 'nok', 'na'] },
      notes: String,
    }],
    observations: String,
    nonConformities: [{
      description: String,
      severity: { type: String, enum: ['mineure', 'majeure', 'critique'] },
      correctionDeadline: Date,
      correctionStatus: {
        type: String,
        enum: ['ouverte', 'en_cours', 'corrigee', 'verifiee'],
        default: 'ouverte',
      },
      correctedAt: Date,
    }],
    photos: [{ url: String, publicId: String, caption: String }],
    status: {
      type: String,
      enum: ['planifie', 'realise', 'valide', 'rejete'],
      default: 'planifie',
    },
    validatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    validatedAt: Date,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

qualityControlSchema.index({ project: 1, date: -1 });
qualityControlSchema.index({ result: 1 });
qualityControlSchema.index({ status: 1 });

const QualityControl = mongoose.model('QualityControl', qualityControlSchema);
module.exports = QualityControl;
