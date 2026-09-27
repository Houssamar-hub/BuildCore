'use strict';
const mongoose = require('mongoose');

/**
 * Material categories supported in IMARA 360
 */
const MATERIAL_CATEGORIES = [
  'gros_oeuvre', 'second_oeuvre', 'electricite', 'plomberie',
  'menuiserie', 'revetement', 'peinture', 'ferronnerie',
  'isolation', 'charpente', 'carrelage', 'sanitaire', 'autre',
];

/**
 * Standard measurement units for materials
 */
const UNITS = ['kg', 'tonne', 'm', 'm2', 'm3', 'unite', 'sac', 'litre', 'ml', 'boite', 'palette', 'rouleau'];

const materialSchema = new mongoose.Schema(
  {
    reference: { type: String, unique: true, sparse: true, uppercase: true, trim: true },
    name: { type: String, required: [true, 'Nom matériau requis'], trim: true },
    category: { type: String, enum: MATERIAL_CATEGORIES, required: true },
    description: String,
    unit: { type: String, enum: UNITS, required: [true, 'Unité requise'] },
    averagePrice: { type: Number, default: 0, min: 0 },
    stockQuantity: { type: Number, default: 0, min: 0 },
    minimumStock: { type: Number, default: 0, min: 0 },
    maximumStock: { type: Number, default: 0 },
    mainSupplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' },
    location: String, // Emplacement dans le stock
    isActive: { type: Boolean, default: true },
    image: { url: String, publicId: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

/**
 * Virtual to determine current stock status
 * Returns: 'epuise' (out of stock), 'faible' (low stock), or 'normal'
 */
materialSchema.virtual('stockStatus').get(function () {
  if (this.stockQuantity <= 0) return 'epuise';
  if (this.stockQuantity <= this.minimumStock) return 'faible';
  return 'normal';
});

materialSchema.index({ reference: 1 });
materialSchema.index({ category: 1 });
materialSchema.index({ stockQuantity: 1 });
materialSchema.index({ name: 'text' });

const Material = mongoose.model('Material', materialSchema);
module.exports = Material;
