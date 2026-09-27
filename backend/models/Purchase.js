'use strict';

const mongoose = require('mongoose');

// ─── Demande d'achat ────────────────────────────────────────────
const purchaseRequestSchema = new mongoose.Schema(
  {
    reference: { type: String, unique: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    urgency: { type: String, enum: ['normal', 'urgent', 'critique'], default: 'normal' },
    neededBy: Date,
    items: [{
      material: { type: mongoose.Schema.Types.ObjectId, ref: 'Material' },
      description: String,
      quantity: { type: Number, required: true, min: 0 },
      unit: String,
      estimatedPrice: { type: Number, default: 0 },
      notes: String,
    }],
    status: {
      type: String,
      enum: ['brouillon', 'soumise', 'approuvee', 'rejetee', 'commandee', 'livree', 'annulee'],
      default: 'brouillon',
    },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    approvedAt: Date,
    rejectionReason: String,
    notes: String,
  },
  { timestamps: true }
);

// ─── Bon de commande ───────────────────────────────────────────
const purchaseOrderSchema = new mongoose.Schema(
  {
    reference: { type: String, unique: true },
    purchaseRequest: { type: mongoose.Schema.Types.ObjectId, ref: 'PurchaseRequest' },
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    orderDate: { type: Date, default: Date.now },
    expectedDeliveryDate: Date,
    actualDeliveryDate: Date,
    items: [{
      material: { type: mongoose.Schema.Types.ObjectId, ref: 'Material' },
      description: String,
      quantity: { type: Number, required: true },
      unit: String,
      unitPrice: { type: Number, required: true },
      totalPrice: { type: Number, default: 0 },
      receivedQuantity: { type: Number, default: 0 },
    }],
    totalAmount: { type: Number, default: 0 },
    taxAmount: { type: Number, default: 0 },
    totalWithTax: { type: Number, default: 0 },
    currency: { type: String, default: 'MAD' },
    paymentTerms: String,
    deliveryAddress: String,
    status: {
      type: String,
      enum: ['brouillon', 'envoyee', 'confirmee', 'partiellement_livree', 'livree', 'annulee', 'disputee'],
      default: 'brouillon',
    },
    invoice: { type: mongoose.Schema.Types.ObjectId, ref: 'Invoice' },
    notes: String,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

// Calculer total automatiquement
purchaseOrderSchema.pre('save', function (next) {
  this.totalAmount = this.items.reduce((sum, item) => {
    item.totalPrice = item.quantity * item.unitPrice;
    return sum + item.totalPrice;
  }, 0);
  this.totalWithTax = this.totalAmount + (this.taxAmount || 0);
  next();
});

purchaseRequestSchema.index({ project: 1, status: 1 });
purchaseRequestSchema.index({ requestedBy: 1 });
purchaseOrderSchema.index({ supplier: 1, status: 1 });
purchaseOrderSchema.index({ project: 1 });
purchaseOrderSchema.index({ reference: 1 });

const PurchaseRequest = mongoose.model('PurchaseRequest', purchaseRequestSchema);
const PurchaseOrder = mongoose.model('PurchaseOrder', purchaseOrderSchema);
module.exports = { PurchaseRequest, PurchaseOrder };
