'use strict';

const mongoose = require('mongoose');

// ─── Facture ───────────────────────────────────────────────────
const invoiceSchema = new mongoose.Schema(
  {
    reference: { type: String, unique: true, required: true },
    type: {
      type: String,
      enum: ['fournisseur', 'client', 'sous_traitant'],
      required: true,
    },
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' },
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' },
    subcontractor: { type: mongoose.Schema.Types.ObjectId, ref: 'Subcontractor' },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    purchaseOrder: { type: mongoose.Schema.Types.ObjectId, ref: 'PurchaseOrder' },
    invoiceDate: { type: Date, required: true, default: Date.now },
    dueDate: { type: Date, required: true },
    items: [{
      description: { type: String, required: true },
      quantity: { type: Number, required: true },
      unit: String,
      unitPrice: { type: Number, required: true },
      totalPrice: { type: Number, default: 0 },
      taxRate: { type: Number, default: 20 }, // TVA en %
    }],
    subtotal: { type: Number, default: 0 },
    taxAmount: { type: Number, default: 0 },
    totalAmount: { type: Number, default: 0 },
    paidAmount: { type: Number, default: 0 },
    remainingAmount: { type: Number, default: 0 },
    currency: { type: String, default: 'MAD' },
    status: {
      type: String,
      enum: ['brouillon', 'en_attente', 'partiellement_payee', 'payee', 'en_retard', 'annulee', 'disputee'],
      default: 'brouillon',
    },
    attachments: [{ name: String, url: String, publicId: String }],
    notes: String,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

invoiceSchema.pre('save', function (next) {
  this.subtotal = this.items.reduce((sum, item) => {
    item.totalPrice = item.quantity * item.unitPrice;
    return sum + item.totalPrice;
  }, 0);
  this.taxAmount = this.items.reduce((sum, item) => {
    return sum + (item.totalPrice * (item.taxRate / 100));
  }, 0);
  this.totalAmount = this.subtotal + this.taxAmount;
  this.remainingAmount = this.totalAmount - this.paidAmount;

  if (this.paidAmount >= this.totalAmount) this.status = 'payee';
  else if (this.paidAmount > 0) this.status = 'partiellement_payee';
  else if (this.dueDate < new Date() && this.status === 'en_attente') this.status = 'en_retard';

  next();
});

invoiceSchema.index({ reference: 1 });
invoiceSchema.index({ status: 1, dueDate: 1 });
invoiceSchema.index({ project: 1 });
invoiceSchema.index({ supplier: 1 });
invoiceSchema.index({ client: 1 });

// ─── Paiement ──────────────────────────────────────────────────
const paymentSchema = new mongoose.Schema(
  {
    reference: { type: String, unique: true },
    invoice: { type: mongoose.Schema.Types.ObjectId, ref: 'Invoice', required: true },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'MAD' },
    date: { type: Date, required: true, default: Date.now },
    method: {
      type: String,
      enum: ['especes', 'cheque', 'virement', 'carte', 'lettre_credit', 'autre'],
      required: true,
    },
    bankReference: String,
    notes: String,
    receipt: { url: String, publicId: String },
    recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: {
      type: String,
      enum: ['en_attente', 'confirme', 'rejete', 'annule'],
      default: 'confirme',
    },
  },
  { timestamps: true }
);

paymentSchema.index({ invoice: 1 });
paymentSchema.index({ date: -1 });
paymentSchema.index({ status: 1 });

const Invoice = mongoose.model('Invoice', invoiceSchema);
const Payment = mongoose.model('Payment', paymentSchema);
module.exports = { Invoice, Payment };
