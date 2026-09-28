'use strict';

const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Nom de l\'équipe requis'],
      trim: true,
      maxlength: [100, 'Nom max 100 caractères'],
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
    },
    leader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    members: [
      {
        employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
        role: { type: String, trim: true },
        joinedAt: { type: Date, default: Date.now },
      },
    ],
    specialty: {
      type: String,
      enum: [
        'gros_oeuvre',
        'second_oeuvre',
        'electricite',
        'plomberie',
        'finitions',
        'terrassement',
        'charpente',
        'menuiserie',
        'peinture',
        'revetements',
        'polyvalente',
        'autre',
      ],
      default: 'polyvalente',
    },
    description: String,
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

teamSchema.virtual('memberCount').get(function () {
  return this.members ? this.members.length : 0;
});

teamSchema.index({ project: 1 });
teamSchema.index({ leader: 1 });
teamSchema.index({ isActive: 1 });

const Team = mongoose.model('Team', teamSchema);
module.exports = Team;
