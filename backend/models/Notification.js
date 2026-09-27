'use strict';
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    type: {
      type: String,
      enum: [
        'nouvelle_tache', 'tache_en_retard', 'nouvel_incident', 'incident_critique',
        'nouveau_rapport', 'rapport_manquant', 'stock_faible', 'stock_epuise',
        'budget_depasse', 'budget_alerte', 'maintenance_proche', 'maintenance_due',
        'nouvelle_facture', 'facture_en_retard', 'nouvelle_commande', 'commande_livree',
        'projet_en_retard', 'projet_termine', 'nouveau_message', 'alerte_systeme', 'autre',
      ],
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    priority: { type: String, enum: ['normale', 'haute', 'critique'], default: 'normale' },
    isRead: { type: Boolean, default: false },
    readAt: Date,
    actionUrl: String, // URL vers la ressource concernée
    relatedTo: {
      model: String,
      id: mongoose.Schema.Types.ObjectId,
    },
    expiresAt: Date,
  },
  { timestamps: true }
);

notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ recipient: 1, createdAt: -1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;
