'use strict';
const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
  {
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    date: { type: Date, required: true },
    status: {
      type: String,
      enum: ['present', 'absent', 'retard', 'conge', 'maladie', 'mission'],
      required: true,
    },
    checkIn: Date,
    checkOut: Date,
    hoursWorked: { type: Number, default: 0 },
    overtimeHours: { type: Number, default: 0 },
    notes: String,
    recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

// Calculer les heures travaillées
attendanceSchema.pre('save', function (next) {
  if (this.checkIn && this.checkOut) {
    const diff = (this.checkOut - this.checkIn) / (1000 * 60 * 60);
    this.hoursWorked = Math.round(diff * 10) / 10;
    this.overtimeHours = Math.max(0, this.hoursWorked - 8);
  }
  next();
});

attendanceSchema.index({ employee: 1, date: 1 }, { unique: true });
attendanceSchema.index({ project: 1, date: 1 });
attendanceSchema.index({ date: -1 });
attendanceSchema.index({ status: 1 });

const Attendance = mongoose.model('Attendance', attendanceSchema);
module.exports = Attendance;
