'use strict';

const mongoose = require('mongoose');

const subcontractorSchema = new mongoose.Schema(
  {
    companyName: { type: String, required: [true, 'Raison sociale requise'], trim: true },
    contactName: String,
    phone: String,
    email: { type: String, lowercase: true, trim: true },
    address: String,
    ice: { type: String, unique: true, sparse: true, trim: true },
    specialty: {
      type: String,
      enum: [
        'electricite', 'plomberie', 'climatisation', 'peinture', 'menuiserie',
        'securite', 'ascenseurs', 'amenagement', 'etancheite', 'isolation',
        'carrelage', 'facade', 'terrassement', 'beton', 'charpente', 'autre',
      ],
      required: true,
    },
    rating: { type: Number, min: 1, max: 5, default: 3 },
    isActive: { type: Boolean, default: true },
    notes: String,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

const subcontractSchema = new mongoose.Schema(
  {
    subcontractor: { type: mongoose.Schema.Types.ObjectId, ref: 'Subcontractor', required: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    description: { type: String, required: true },
    contractAmount: { type: Number, required: true, min: 0 },
    paidAmount: { type: Number, default: 0 },
    startDate: { type: Date, required: true },
    endDate: Date,
    status: {
      type: String,
      enum: ['en_attente', 'en_cours', 'termine', 'resilie', 'suspendu'],
      default: 'en_attente',
    },
    contractFile: { url: String, publicId: String },
    notes: String,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

subcontractorSchema.index({ companyName: 'text' });
subcontractorSchema.index({ specialty: 1 });
subcontractSchema.index({ project: 1 });
subcontractSchema.index({ subcontractor: 1 });

const Subcontractor = mongoose.model('Subcontractor', subcontractorSchema);
const SubcontractorContract = mongoose.model('SubcontractorContract', subcontractSchema);
module.exports = { Subcontractor, SubcontractorContract };
