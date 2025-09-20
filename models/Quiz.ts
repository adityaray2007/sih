import mongoose, { Schema, model, models } from 'mongoose'

const QuizSchema = new Schema({
  title: { type: String, required: true },
  question: { type: String, required: true },
  options: { type: [String], required: true }, // 4 options
  correctAnswer: { type: Number, required: true }, // index 0-3
  image: { type: String }, // optional base64 string
  createdBy: { type: String, required: true }, // teacher/admin ID
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

export const Quiz = models.Quiz || model('Quiz', QuizSchema)