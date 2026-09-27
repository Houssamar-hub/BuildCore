'use strict';
const mongoose = require('mongoose');

const incidentSchema = new mongoose.Schema(
  {
    reference: { type: String, unique: true },
    title: { type: String, required: [true, 'Titre requis'], trim: true },
    type: {
      type: String,
      enum: ['incident', 'accident', 'probleme_technique', 'retard', 'manque_materiel', 'probleme_fournisseur', 'probleme_qualite', 'autre'],
      required: true,
    },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    phase: { type: mongoose.Schema.Types.ObjectId, ref: 'ProjectPhase' },
    date: { type: Date, required: true, default: Date.now },
    description: { type: String, required: [true, 'Description requise'] },
    priority: { type: String, enum: ['basse', 'normale', 'haute', 'critique'], default: 'normale' },
    status: { type: String, enum: ['ouvert', 'en_cours', 'resolu', 'clos'], default: 'ouvert' },
    reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    resolvedAt: Date,
    resolution: String,
    impact: { type: String, enum: ['aucun', 'faible', 'moyen', 'eleve', 'critique'], default: 'moyen' },
    injuredPersons: { type: Number, default: 0 },
    estimatedCost: { type: Number, default: 0 },
    actualCost: { type: Number, default: 0 },
    photos: [{ url: String, publicId: String, uploadedAt: { type: Date, default: Date.now } }],
    notes: String,
  },
  { timestamps: true }
);

incidentSchema.index({ project: 1, status: 1 });
incidentSchema.index({ priority: 1, status: 1 });
incidentSchema.index({ date: -1 });
incidentSchema.index({ type: 1 });

const Incident = mongoose.model('Incident', incidentSchema);
module.exports = Incident;
