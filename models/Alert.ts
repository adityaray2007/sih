import mongoose, { Schema, model, models } from 'mongoose'

const AlertSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  createdBy: { type: String, required: true }, // e.g., 'teacher:123' or 'external:gdacs'
  createdAt: { type: Date, default: Date.now },
  externalId: { type: String }, // unique ID from external API to prevent duplicates
  source: { type: String },     // e.g., 'gdacs', 'usgs', 'openweather'
  link: { type: String },       // URL to original alert
})

export const Alert = models.Alert || model('Alert', AlertSchema)