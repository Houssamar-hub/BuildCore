'use strict';

const mongoose = require('mongoose');

const phaseSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: [true, 'Projet requis'],
    },
    name: {
      type: String,
      required: [true, 'Nom de la phase requis'],
      trim: true,
    },
    description: String,
    order: { type: Number, default: 0 },
    startDate: Date,
    plannedEndDate: Date,
    actualEndDate: Date,
    responsible: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    budget: { type: Number, default: 0 },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    status: {
      type: String,
      enum: ['non_commencee', 'en_cours', 'en_pause', 'terminee', 'annulee'],
      default: 'non_commencee',
    },
    color: { type: String, default: '#3B82F6' },
  },
  { timestamps: true }
);

phaseSchema.index({ project: 1, order: 1 });

const ProjectPhase = mongoose.model('ProjectPhase', phaseSchema);
module.exports = ProjectPhase;
