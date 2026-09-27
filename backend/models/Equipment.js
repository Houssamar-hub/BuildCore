'use strict';
const mongoose = require('mongoose');

const EQUIPMENT_TYPES = [
  'grue', 'pelle', 'chargeuse', 'betonniere', 'camion', 'vehicule',
  'echafaudage', 'groupe_electrogene', 'compresseur', 'pompe',
  'malaxeur', 'nacelle', 'forklift', 'outillage', 'autre',
];

const equipmentSchema = new mongoose.Schema(
  {
    reference: { type: String, unique: true, uppercase: true, trim: true },
    name: { type: String, required: [true, 'Nom requis'], trim: true },
    type: { type: String, enum: EQUIPMENT_TYPES, required: true },
    brand: String,
    model: String,
    serialNumber: { type: String, unique: true, sparse: true },
    registrationNumber: String, // Immatriculation
    acquisitionDate: Date,
    acquisitionCost: { type: Number, default: 0 },
    currentValue: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['disponible', 'en_utilisation', 'en_maintenance', 'hors_service', 'loue', 'vendu'],
      default: 'disponible',
    },
    condition: {
      type: String,
      enum: ['excellent', 'bon', 'moyen', 'mauvais'],
      default: 'bon',
    },
    currentProject: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    responsible: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    location: String,
    usage: {
      kilometers: { type: Number, default: 0 },
      hoursWorked: { type: Number, default: 0 },
    },
    maintenance: {
      lastMaintenanceDate: Date,
      nextMaintenanceDate: Date,
      nextMaintenanceKm: Number,
    },
    insurance: {
      company: String,
      policyNumber: String,
      expiryDate: Date,
    },
    technicalControl: {
      lastDate: Date,
      nextDate: Date,
    },
    image: { url: String, publicId: String },
    documents: [{ name: String, url: String, publicId: String }],
    notes: String,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

equipmentSchema.virtual('needsMaintenance').get(function () {
  if (!this.maintenance || !this.maintenance.nextMaintenanceDate) return false;
  const threeDaysFromNow = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
  return this.maintenance.nextMaintenanceDate <= threeDaysFromNow;
});

equipmentSchema.index({ status: 1 });
equipmentSchema.index({ type: 1 });
equipmentSchema.index({ currentProject: 1 });
equipmentSchema.index({ 'maintenance.nextMaintenanceDate': 1 });

const Equipment = mongoose.model('Equipment', equipmentSchema);
module.exports = Equipment;
