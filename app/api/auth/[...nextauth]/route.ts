import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { connectToDatabase } from '@/lib/mongodb'
import { User } from '@/models/User'  // ✅ fixed named import

connectToDatabase()

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Check if user exists
      const existing = await User.findOne({ email: user.email })
      if (!existing) {
        // Create user if first login
        await User.create({ name: user.name, email: user.email, googleId: profile.sub, role: 'student' })
      }
      return true
    },
    async session({ session, token }) {
      const dbUser = await User.findOne({ email: session.user?.email })
      if (dbUser) session.user.role = dbUser.role
      return session
    }
  }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }