import mongoose, { Schema, model, models } from 'mongoose'

const AlertSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  createdBy: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
})

export const Alert = models.Alert || model('Alert', AlertSchema)