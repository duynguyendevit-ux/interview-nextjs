import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"

// Mock user database - replace with real database
const users = [
  {
    id: "1",
    email: "admin",
    username: "admin",
    password: "$2b$10$YykFNHL0xSsWNXIOPbPcS.4wrZGbTgivOYD3dpP5bUAvh/ecI4d5m", // 123456789oO#
    role: "admin",
    name: "Admin User"
  }
]

// Hash password for admin: 123456789oO#
// bcrypt.hashSync("123456789oO#", 10)

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // Find user by email or username
        const user = users.find(
          u => u.email === credentials.email || u.username === credentials.email
        )

        if (!user) {
          return null
        }

        // Verify password
        const isValid = await bcrypt.compare(credentials.password, user.password)

        if (!isValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string
        session.user.id = token.id as string
      }
      return session
    }
  },
  pages: {
    signIn: "/",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "your-secret-key-change-in-production",
})

export { handler as GET, handler as POST }
