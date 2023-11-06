import NextAuth, { type DefaultSession } from 'next-auth'
import Google from 'next-auth/providers/google'
import config from '@/lib/config'
import { NextResponse } from 'next/server'
import { UserRole } from '@/lib/types'

// import { FirestoreAdapter } from "@auth/firebase-adapter"
// import { firestore } from "lib/firestore"

declare module 'next-auth' {
  interface Session {
    user: {
      id: string,
      role: UserRole,
    } & DefaultSession['user']
  }
}

const googleProvider = Google({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET
})

export const {
  handlers: { GET, POST },
  auth,
  CSRF_experimental // will be removed in future
} = NextAuth({
  providers: [
    // GitHub,
    googleProvider
  ],
  // adapter: FirestoreAdapter(firestore),
  session: {
    strategy: "jwt",
  },
  callbacks: {
    signIn({ account, profile }) {
      if (account?.provider === "google") {
        const email = profile?.email ?? ''
        const allowedEmailDomains = config?.allowedEmailDomains ?? []
        const allowedEmailAddresses = config?.allowedEmailAddresses ?? []
        
        if (!allowedEmailAddresses.length && !allowedEmailDomains.length) {
          // If no allowed email addresses or domains are specified, allow all
          return true
        } else if (allowedEmailAddresses.length && allowedEmailAddresses.includes(email)) {
          // If allowed email addresses are specified, check if the user's email is in the list
          return true
        } else if (allowedEmailDomains.length && allowedEmailDomains.some(
          (domain) => email.endsWith(domain)
        )) {
          // If allowed email domains are specified, check if the user's email domain is in the list
          return true
        } else {
          // Otherwise, deny access
          return false
        }
      } else {
        // If the user is not signing in with Google, don't allow access
        return false
      }
      // TODO For marketplace, re-enable closed beta email addresses check
      // const docRef = firestore.collection('closed_beta_email_addresses').doc(email.toLowerCase())
      // const docSnap = await docRef.get()

      // if (docSnap.exists()) {
      //   return true
      // } else {
      //   return false
      // }
    },
    session: ({ session, token }) => ({
      ...session,
      user: {
        ...session.user,
        id: token.id,
        role: token.role,
        email: token.email,
      },
    }),
    jwt({ token, profile }) {
      if (profile) {
        // token.id = profile.id // GitHub
        token.id = String(`uid-${profile.sub}`) // Google
        token.image = profile.avatar_url || profile.picture
        // Set role based on email address
        const adminEmailAddresses = config?.adminEmailAddresses ?? []
        const adminEmailDomains = config?.adminEmailDomains ?? []
        const email = profile.email ?? ''
        token.email = email
        if (adminEmailAddresses.length && adminEmailAddresses.includes(email)) {
          token.role = UserRole.admin
        } else if (adminEmailDomains.length && adminEmailDomains.some(
          (domain: string) => email.endsWith(domain)
        )) {
          token.role = UserRole.admin
        } else {
          token.role = UserRole.user
        }
      }
      return token
    },
    authorized({ request, auth }) {
      const { pathname } = request.nextUrl

      const adminPaths = ['/admin']
      const publicPaths = config?.publicPaths ?? []

      const matchesAdminPath = adminPaths.some((path) =>
        pathname.startsWith(path)
      )
      const matchesPublicPath = publicPaths.some((path) =>
        pathname.startsWith(path)
      )

      if (matchesPublicPath) {
        return true
      }

      if (matchesAdminPath) {
        if (!auth?.user) {
          return NextResponse.redirect('/sign-in')
        }
        if (auth?.user?.role !== 'admin') {
          return new NextResponse(null, { status: 403 })
        }
      }

      return !!auth?.user
    }
  },
  pages: {
    signIn: '/sign-in' // overrides the next-auth default signin page https://authjs.dev/guides/basics/pages
  }
})
