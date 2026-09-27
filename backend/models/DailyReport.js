'use strict';
const mongoose = require('mongoose');

const dailyReportSchema = new mongoose.Schema(
  {
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    date: { type: Date, required: true },
    weather: {
      type: String,
      enum: ['ensoleille', 'nuageux', 'pluvieux', 'venteux', 'brumeux', 'orageux'],
      default: 'ensoleille',
    },
    temperature: Number,
    workforce: {
      total: { type: Number, default: 0 },
      present: { type: Number, default: 0 },
      absent: { type: Number, default: 0 },
    },
    workDone: { type: String, required: [true, 'Travaux réalisés requis'] },
    plannedWork: String,
    materialsUsed: [{
      material: { type: mongoose.Schema.Types.ObjectId, ref: 'Material' },
      quantity: Number,
      unit: String,
      description: String,
    }],
    equipmentUsed: [{
      equipment: { type: mongoose.Schema.Types.ObjectId, ref: 'Equipment' },
      hours: Number,
      notes: String,
    }],
    problems: String,
    incidents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Incident' }],
    comments: String,
    photos: [{ url: String, publicId: String, caption: String, uploadedAt: { type: Date, default: Date.now } }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    approvedAt: Date,
    status: { type: String, enum: ['brouillon', 'soumis', 'approuve', 'rejete'], default: 'brouillon' },
  },
  { timestamps: true }
);

dailyReportSchema.index({ project: 1, date: -1 });
dailyReportSchema.index({ date: -1 });
dailyReportSchema.index({ createdBy: 1 });

const DailyReport = mongoose.model('DailyReport', dailyReportSchema);
module.exports = DailyReport;
