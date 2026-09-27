'use strict';
const mongoose = require('mongoose');

/**
 * Client types supported in IMARA 360
 */
const CLIENT_TYPES = ['particulier', 'entreprise', 'institution', 'promoteur', 'investisseur'];

/**
 * Schema representing clients (individual or corporate)
 */
const clientSchema = new mongoose.Schema(
  {
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    companyName: { type: String, trim: true },
    clientType: {
      type: String,
      enum: CLIENT_TYPES,
      required: true,
    },
    ice: { type: String, unique: true, sparse: true, trim: true },
    phone: { type: String, trim: true },
    email: { type: String, lowercase: true, trim: true },
    address: String,
    city: String,
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

/**
 * Virtual display name representing company name or full contact name
 */
clientSchema.virtual('displayName').get(function () {
  return this.companyName || `${this.firstName || ''} ${this.lastName || ''}`.trim();
});

clientSchema.index({ companyName: 'text', firstName: 'text', lastName: 'text' });
clientSchema.index({ isActive: 1 });

const Client = mongoose.model('Client', clientSchema);
module.exports = Client;
