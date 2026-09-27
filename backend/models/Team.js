'use strict';

const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Nom de l\'équipe requis'],
      trim: true,
    },
    description: String,
    leader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: [true, 'Responsable d\'équipe requis'],
    },
    members: [{
      employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
      role: String,
      joinedAt: { type: Date, default: Date.now },
    }],
    currentProject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
    },
    assignedDate: Date,
    endDate: Date,
    specialty: {
      type: String,
      enum: [
        'gros_oeuvre', 'second_oeuvre', 'electricite', 'plomberie',
        'menuiserie', 'peinture', 'carrelage', 'etancheite',
        'terrassement', 'beton', 'ferraillage', 'mixte', 'autre',
      ],
    },
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

teamSchema.index({ currentProject: 1 });
teamSchema.index({ isActive: 1 });

const Team = mongoose.model('Team', teamSchema);
module.exports = Team;
