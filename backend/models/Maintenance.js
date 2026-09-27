'use strict';
const mongoose = require('mongoose');

const maintenanceSchema = new mongoose.Schema(
  {
    equipment: { type: mongoose.Schema.Types.ObjectId, ref: 'Equipment', required: true },
    type: { type: String, enum: ['preventive', 'corrective', 'urgence'], required: true },
    title: { type: String, required: true, trim: true },
    description: String,
    scheduledDate: Date,
    startDate: Date,
    endDate: Date,
    cost: { type: Number, default: 0 },
    technician: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
    externalCompany: String,
    parts: [{ name: String, quantity: Number, unitPrice: Number }],
    status: {
      type: String,
      enum: ['planifiee', 'en_cours', 'terminee', 'annulee'],
      default: 'planifiee',
    },
    nextMaintenanceDate: Date,
    nextMaintenanceKm: Number,
    kmAtMaintenance: Number,
    hoursAtMaintenance: Number,
    findings: String,
    recommendations: String,
    photos: [{ url: String, publicId: String }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

maintenanceSchema.index({ equipment: 1, scheduledDate: -1 });
maintenanceSchema.index({ status: 1 });
maintenanceSchema.index({ type: 1 });

const Maintenance = mongoose.model('Maintenance', maintenanceSchema);
module.exports = Maintenance;
