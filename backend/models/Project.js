'use strict';

const mongoose = require('mongoose');

const PROJECT_TYPES = [
  'residence', 'immeuble', 'villa', 'maison', 'lotissement',
  'construction_commerciale', 'construction_industrielle', 'route',
  'infrastructure', 'amenagement', 'equipement', 'installation',
  'renovation', 'maintenance', 'autre',
];

const PROJECT_STATUSES = [
  'prospection', 'preparation', 'planification', 'en_cours',
  'en_pause', 'en_retard', 'termine', 'annule',
];

const PRIORITIES = ['basse', 'normale', 'haute', 'critique'];

const projectSchema = new mongoose.Schema(
  {
    reference: {
      type: String,
      required: [true, 'Référence requise'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, 'Nom du projet requis'],
      trim: true,
      maxlength: [200, 'Nom max 200 caractères'],
    },
    type: {
      type: String,
      required: [true, 'Type de projet requis'],
      enum: PROJECT_TYPES,
    },
    description: {
      type: String,
      maxlength: [2000, 'Description max 2000 caractères'],
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client',
    },
    location: {
      address: String,
      city: { type: String, trim: true },
      region: String,
      coordinates: {
        lat: Number,
        lng: Number,
      },
    },
    dates: {
      startDate: { type: Date, required: [true, 'Date de début requise'] },
      plannedEndDate: { type: Date, required: [true, 'Date de fin prévue requise'] },
      actualEndDate: Date,
    },
    budget: {
      total: { type: Number, default: 0, min: 0 },
      consumed: { type: Number, default: 0, min: 0 },
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    status: {
      type: String,
      enum: PROJECT_STATUSES,
      default: 'preparation',
    },
    priority: {
      type: String,
      enum: PRIORITIES,
      default: 'normale',
    },
    manager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Responsable requis'],
    },
    projectManager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    team: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
    }],
    tags: [String],
    coverImage: {
      url: String,
      publicId: String,
    },
    isArchived: { type: Boolean, default: false },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtuals
projectSchema.virtual('budgetRemaining').get(function () {
  return this.budget.total - this.budget.consumed;
});

projectSchema.virtual('budgetUsagePercent').get(function () {
  if (!this.budget.total) return 0;
  return Math.round((this.budget.consumed / this.budget.total) * 100);
});

projectSchema.virtual('isDelayed').get(function () {
  if (this.status === 'termine' || this.status === 'annule') return false;
  return new Date() > this.dates.plannedEndDate;
});

// Indexes
projectSchema.index({ reference: 1 });
projectSchema.index({ status: 1 });
projectSchema.index({ type: 1 });
projectSchema.index({ manager: 1 });
projectSchema.index({ client: 1 });
projectSchema.index({ 'dates.plannedEndDate': 1 });
projectSchema.index({ isArchived: 1 });

const Project = mongoose.model('Project', projectSchema);
module.exports = Project;
