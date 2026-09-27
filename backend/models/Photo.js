'use strict';

const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema(
  {
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    phase: { type: mongoose.Schema.Types.ObjectId, ref: 'ProjectPhase' },
    url: { type: String, required: true },
    thumbnailUrl: String,
    publicId: String,
    title: String,
    description: String,
    zone: String, // Zone du chantier (ex: "Bloc A - RDC")
    date: { type: Date, default: Date.now },
    tags: [String],
    metadata: {
      width: Number,
      height: Number,
      size: Number,
      format: String,
    },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

photoSchema.index({ project: 1, date: -1 });
photoSchema.index({ phase: 1 });
photoSchema.index({ uploadedBy: 1 });

const Photo = mongoose.model('Photo', photoSchema);
module.exports = Photo;
