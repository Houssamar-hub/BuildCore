'use strict';
const mongoose = require('mongoose');

/**
 * Standard expense categories for project cost management
 */
const EXPENSE_CATEGORIES = [
  'materiaux', 'main_oeuvre', 'transport', 'carburant', 'location',
  'maintenance', 'sous_traitance', 'fournisseurs', 'logistique',
  'electricite', 'eau', 'telephonie', 'formation', 'securite', 'autres',
];

/**
 * Schema representing an expense incurred on a project or overhead
 */
const expenseSchema = new mongoose.Schema(
  {
    reference: { type: String, unique: true, sparse: true, trim: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    category: { type: String, enum: EXPENSE_CATEGORIES, required: true },
    description: { type: String, required: [true, 'Description requise'] },
    amount: { type: Number, required: [true, 'Montant requis'], min: 0 },
    currency: { type: String, default: 'MAD' },
    date: { type: Date, required: true, default: Date.now },
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' },
    invoice: { type: mongoose.Schema.Types.ObjectId, ref: 'Invoice' },
    paymentMethod: {
      type: String,
      enum: ['especes', 'cheque', 'virement', 'carte', 'autre'],
      default: 'virement',
    },
    status: {
      type: String,
      enum: ['en_attente', 'approuvee', 'rejetee', 'payee'],
      default: 'en_attente',
    },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    receipt: { url: String, publicId: String },
    notes: String,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

expenseSchema.index({ project: 1, date: -1 });
expenseSchema.index({ category: 1 });
expenseSchema.index({ status: 1 });
expenseSchema.index({ date: -1 });

const Expense = mongoose.model('Expense', expenseSchema);
module.exports = Expense;
