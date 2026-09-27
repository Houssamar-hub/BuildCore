'use strict';
const mongoose = require('mongoose');

/**
 * Supplier categories
 */
const SUPPLIER_CATEGORIES = [
  'materiaux', 'equipements', 'outillage', 'transport', 'carburant',
  'electricite', 'plomberie', 'services', 'autre',
];

/**
 * Schema representing suppliers and vendors in IMARA 360
 */
const supplierSchema = new mongoose.Schema(
  {
    companyName: { type: String, required: [true, 'Raison sociale requise'], trim: true },
    ice: { type: String, unique: true, sparse: true, trim: true },
    taxId: String, // Identifiant Fiscal (IF)
    contactName: String,
    phone: String,
    email: { type: String, lowercase: true, trim: true },
    address: String,
    city: String,
    website: String,
    categories: [{
      type: String,
      enum: SUPPLIER_CATEGORIES,
    }],
    rating: { type: Number, min: 1, max: 5, default: 3 },
    paymentTerms: { type: String, default: '30 jours' },
    bankDetails: {
      bankName: String,
      accountNumber: String,
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

supplierSchema.index({ companyName: 'text' });
supplierSchema.index({ categories: 1 });
supplierSchema.index({ isActive: 1 });

const Supplier = mongoose.model('Supplier', supplierSchema);
module.exports = Supplier;
