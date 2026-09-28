'use strict';

const mongoose = require('mongoose');

const subcontractorContractSchema = new mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  description: { type: String, required: true },
  amount: { type: Number, required: true, min: 0 },
  startDate: { type: Date, required: true },
  endDate: Date,
  status: {
    type: String,
    enum: ['brouillon', 'actif', 'termine', 'resilie'],
    default: 'brouillon',
  },
  signedAt: Date,
  documents: [{ name: String, url: String, publicId: String }],
});

const subcontractorSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: [true, 'Raison sociale requise'],
      trim: true,
    },
    ice: { type: String, unique: true, sparse: true, trim: true },
    contactName: { type: String, trim: true },
    phone: { type: String, trim: true },
    email: { type: String, lowercase: true, trim: true },
    address: String,
    city: String,
    specialty: [
      {
        type: String,
        enum: [
          'gros_oeuvre',
          'second_oeuvre',
          'electricite',
          'plomberie',
          'menuiserie',
          'peinture',
          'revetements',
          'charpente',
          'terrassement',
          'climatisation',
          'ascenseur',
          'securite_incendie',
          'autre',
        ],
      },
    ],
    rating: { type: Number, min: 1, max: 5, default: 3 },
    contracts: [subcontractorContractSchema],
    bankDetails: {
      bankName: String,
      rib: String,
    },
    isActive: { type: Boolean, default: true },
    notes: String,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

subcontractorSchema.virtual('activeContractsCount').get(function () {
  return this.contracts ? this.contracts.filter((c) => c.status === 'actif').length : 0;
});

subcontractorSchema.index({ companyName: 'text' });
subcontractorSchema.index({ isActive: 1 });
subcontractorSchema.index({ specialty: 1 });

const Subcontractor = mongoose.model('Subcontractor', subcontractorSchema);
module.exports = { Subcontractor };
