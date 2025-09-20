import mongoose, { Schema, Document } from 'mongoose'

export interface IUser extends Document {
  name: string
  email: string
  passwordHash?: string
  role: 'student' | 'teacher' | 'admin'
  googleId?: string
  accessibility?: 'none' | 'blind' | 'deaf' | 'blind-deaf'
  createdAt: Date
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String },
  role: { type: String, enum: ['student','teacher','admin'], required: true },
  googleId: { type: String },
  accessibility: { type: String, enum: ['none','blind','deaf','blind-deaf'], default: 'none' },
  createdAt: { type: Date, default: Date.now }
})

// ✅ Turbopack-safe export
const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema)
export { User }  // named export