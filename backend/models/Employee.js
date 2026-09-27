'use strict';

const mongoose = require('mongoose');

const PROFESSIONS = [
  'ingenieur', 'architecte', 'chef_projet', 'chef_chantier',
  'macon', 'electricien', 'plombier', 'peintre', 'menuisier',
  'technicien', 'chauffeur', 'conducteur_engin', 'manoeuvre', 'autre',
];

const CONTRACT_TYPES = ['cdi', 'cdd', 'interim', 'freelance', 'stagiaire'];

const employeeSchema = new mongoose.Schema(
  {
    employeeId: {
      type: String,
      unique: true,
      required: true,
    },
    firstName: {
      type: String,
      required: [true, 'Prénom requis'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Nom requis'],
      trim: true,
    },
    cin: {
      type: String,
      unique: true,
      sparse: true,
      uppercase: true,
      trim: true,
    },
    phone: { type: String, trim: true },
    email: { type: String, lowercase: true, trim: true },
    address: String,
    profession: {
      type: String,
      required: [true, 'Métier requis'],
      enum: PROFESSIONS,
    },
    contractType: {
      type: String,
      enum: CONTRACT_TYPES,
      default: 'cdi',
    },
    hireDate: { type: Date, required: [true, 'Date embauche requise'] },
    endDate: Date,
    salary: {
      base: { type: Number, default: 0 },
      currency: { type: String, default: 'MAD' },
    },
    status: {
      type: String,
      enum: ['actif', 'inactif', 'conge', 'suspendu'],
      default: 'actif',
    },
    currentProject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
    },
    currentTeam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
    },
    userAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    avatar: { url: String, publicId: String },
    emergencyContact: {
      name: String,
      phone: String,
      relation: String,
    },
    documents: [{
      type: String,
      name: String,
      url: String,
      publicId: String,
      uploadedAt: { type: Date, default: Date.now },
    }],
    notes: String,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

employeeSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

employeeSchema.index({ employeeId: 1 });
employeeSchema.index({ cin: 1 });
employeeSchema.index({ currentProject: 1 });
employeeSchema.index({ status: 1 });
employeeSchema.index({ profession: 1 });

const Employee = mongoose.model('Employee', employeeSchema);
module.exports = Employee;
