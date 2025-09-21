import mongoose, { Schema, model, models } from 'mongoose'

const ModuleSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  content: [
    {
          type: { type: String }, // text, image, graph
      data: { type: String },
    },
  ],
  createdBy: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

// Use `models.Module` if already defined to avoid recompilation issues in Next.js
export const Module = models.Module || model('Module', ModuleSchema)