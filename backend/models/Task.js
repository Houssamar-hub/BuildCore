'use strict';

const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Titre requis'],
      trim: true,
      maxlength: [200, 'Titre max 200 caractères'],
    },
    description: { type: String, maxlength: [2000] },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: [true, 'Projet requis'],
    },
    phase: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ProjectPhase',
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
    },
    priority: {
      type: String,
      enum: ['basse', 'normale', 'haute', 'critique'],
      default: 'normale',
    },
    startDate: Date,
    dueDate: Date,
    completedAt: Date,
    status: {
      type: String,
      enum: ['a_faire', 'en_cours', 'bloquee', 'terminee'],
      default: 'a_faire',
    },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    estimatedHours: { type: Number, default: 0 },
    actualHours: { type: Number, default: 0 },
    tags: [String],
    attachments: [{
      name: String,
      url: String,
      publicId: String,
      uploadedAt: { type: Date, default: Date.now },
    }],
    comments: [{
      author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      text: String,
      createdAt: { type: Date, default: Date.now },
    }],
    dependencies: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
    }],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

taskSchema.virtual('isOverdue').get(function () {
  if (this.status === 'terminee') return false;
  return this.dueDate && new Date() > this.dueDate;
});

taskSchema.index({ project: 1, status: 1 });
taskSchema.index({ assignedTo: 1 });
taskSchema.index({ dueDate: 1 });
taskSchema.index({ phase: 1 });

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;
