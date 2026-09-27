'use strict';

const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Titre requis'], trim: true },
    description: String,
    category: {
      type: String,
      enum: [
        'contrat', 'plan', 'devis', 'facture', 'bon_commande', 'rapport',
        'autorisation', 'technique', 'administratif', 'juridique', 'photo', 'autre',
      ],
      required: true,
    },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    file: {
      originalName: String,
      url: { type: String, required: true },
      publicId: String,
      mimeType: String,
      size: Number, // en bytes
    },
    version: { type: String, default: '1.0' },
    tags: [String],
    isPublic: { type: Boolean, default: false },
    accessRoles: [{
      type: String,
      enum: ['admin', 'directeur', 'chef_projet', 'chef_chantier', 'responsable_achats', 'responsable_stock', 'responsable_finance', 'responsable_equipements', 'employe'],
    }],
    expiryDate: Date,
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: {
      type: String,
      enum: ['brouillon', 'soumis', 'approuve', 'archive'],
      default: 'soumis',
    },
  },
  { timestamps: true }
);

documentSchema.index({ project: 1, category: 1 });
documentSchema.index({ title: 'text', description: 'text' });
documentSchema.index({ uploadedBy: 1 });
documentSchema.index({ status: 1 });

const Document = mongoose.model('Document', documentSchema);
module.exports = Document;
