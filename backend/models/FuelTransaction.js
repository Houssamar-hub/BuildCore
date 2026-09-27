'use strict';

const mongoose = require('mongoose');

const fuelSchema = new mongoose.Schema(
  {
    equipment: { type: mongoose.Schema.Types.ObjectId, ref: 'Equipment', required: true },
    date: { type: Date, required: true, default: Date.now },
    quantity: { type: Number, required: [true, 'Quantité requise'], min: 0 },
    unit: { type: String, enum: ['litre', 'gallon'], default: 'litre' },
    pricePerUnit: { type: Number, required: true, min: 0 },
    totalCost: { type: Number, default: 0 },
    currency: { type: String, default: 'MAD' },
    station: String,
    city: String,
    mileage: { type: Number, default: 0 }, // Kilométrage ou heures compteur
    driver: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    fuelType: {
      type: String,
      enum: ['diesel', 'essence', 'gpl', 'electrique', 'autre'],
      default: 'diesel',
    },
    receipt: { url: String, publicId: String },
    notes: String,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

fuelSchema.pre('save', function (next) {
  this.totalCost = this.quantity * this.pricePerUnit;
  next();
});

fuelSchema.index({ equipment: 1, date: -1 });
fuelSchema.index({ project: 1 });
fuelSchema.index({ date: -1 });

const FuelTransaction = mongoose.model('FuelTransaction', fuelSchema);
module.exports = FuelTransaction;
