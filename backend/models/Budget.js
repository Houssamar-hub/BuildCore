'use strict';
const mongoose = require('mongoose');

/**
 * Schema representing project budgets and phase allocations
 */
const budgetSchema = new mongoose.Schema(
  {
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    phase: { type: mongoose.Schema.Types.ObjectId, ref: 'ProjectPhase' },
    name: { type: String, required: true, trim: true },
    totalAmount: { type: Number, required: true, min: 0 },
    consumedAmount: { type: Number, default: 0, min: 0 },
    currency: { type: String, default: 'MAD' },
    startDate: Date,
    endDate: Date,
    breakdown: [{
      category: String,
      plannedAmount: { type: Number, default: 0 },
      consumedAmount: { type: Number, default: 0 },
    }],
    status: {
      type: String,
      enum: ['brouillon', 'valide', 'en_cours', 'depasse', 'cloture'],
      default: 'brouillon',
    },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    notes: String,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

/**
 * Virtual calculating remaining budget amount
 */
budgetSchema.virtual('remainingAmount').get(function () {
  return this.totalAmount - this.consumedAmount;
});

/**
 * Virtual calculating percentage of budget consumed
 */
budgetSchema.virtual('consumptionPercent').get(function () {
  if (!this.totalAmount) return 0;
  return Math.round((this.consumedAmount / this.totalAmount) * 100);
});

budgetSchema.index({ project: 1 });
budgetSchema.index({ status: 1 });

const Budget = mongoose.model('Budget', budgetSchema);
module.exports = Budget;
