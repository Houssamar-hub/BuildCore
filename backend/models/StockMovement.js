'use strict';
const mongoose = require('mongoose');

/**
 * Schema representing stock movements (in, out, transfer, adjustment, inventory, return)
 */
const stockMovementSchema = new mongoose.Schema(
  {
    material: { type: mongoose.Schema.Types.ObjectId, ref: 'Material', required: true },
    type: {
      type: String,
      enum: ['entree', 'sortie', 'transfert', 'inventaire', 'ajustement', 'retour'],
      required: true,
    },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, default: 0 },
    totalPrice: { type: Number, default: 0 },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    fromLocation: String,
    toLocation: String,
    reference: String, // Référence bon/commande
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' },
    reason: String,
    performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    stockBefore: { type: Number, default: 0 },
    stockAfter: { type: Number, default: 0 },
    notes: String,
  },
  { timestamps: true }
);

stockMovementSchema.index({ material: 1, createdAt: -1 });
stockMovementSchema.index({ project: 1 });
stockMovementSchema.index({ type: 1 });
stockMovementSchema.index({ performedBy: 1 });

const StockMovement = mongoose.model('StockMovement', stockMovementSchema);
module.exports = StockMovement;
