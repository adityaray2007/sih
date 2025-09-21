const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

// User schema (simplified version)
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String },
  role: { type: String, enum: ['student', 'teacher', 'admin'], required: true },
  googleId: { type: String },
  accessibility: { type: String, enum: ['none', 'blind', 'deaf', 'blind-deaf'], default: 'none' },
  createdAt: { type: Date, default: Date.now },
  completedModules: [
    {
      moduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Module' },
      timeSpent: { type: Number, default: 0 }
    }
  ],
  xp: { type: Number, default: 0 }
})

const User = mongoose.models.User || mongoose.model('User', UserSchema)

async function createTestUser() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://prakhar:prakhar123@cluster0.abc123.mongodb.net/sih?retryWrites=true&w=majority')
    
    // Check if user already exists
    const existingUser = await User.findOne({ email: 'test@example.com' })
    if (existingUser) {
      console.log('Test user already exists!')
      console.log('Email: test@example.com')
      console.log('Password: password123')
      process.exit(0)
    }
    
    // Create test user
    const passwordHash = await bcrypt.hash('password123', 10)
    const testUser = new User({
      name: 'Test User',
      email: 'test@example.com',
      passwordHash: passwordHash,
      role: 'student',
      xp: 1500,
      completedModules: [],
      timeSpentPerModule: []
    })
    
    await testUser.save()
    console.log('Test user created successfully!')
    console.log('Email: test@example.com')
    console.log('Password: password123')
    
  } catch (error) {
    console.error('Error creating test user:', error)
  } finally {
    await mongoose.disconnect()
  }
}

createTestUser()
