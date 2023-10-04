import NextAuth, { type DefaultSession } from 'next-auth'
import Google from 'next-auth/providers/google'
import config from '@/lib/config'

// import { FirestoreAdapter } from "@auth/firebase-adapter"
// import { firestore } from "lib/firestore"

declare module 'next-auth' {
  interface Session {
    user: {
      /** The user's id. */
      // TODO Revert to the use of id, so that we can use alternative providers like GitHub - see TODO below
      // id: string
      sub: string
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
  providers: [googleProvider],
  // adapter: FirestoreAdapter(firestore),
  session: {
    strategy: "jwt",
  },
  callbacks: {
    signIn({ account, profile }) {
      if (account?.provider === "google") {
        const allowedEmailDomains = config.allowedEmailDomains
        return (
          profile?.email_verified && allowedEmailDomains.some(
            (domain) => profile.email?.endsWith(domain)
          )
        ) ?? false
      } else {
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
        // TODO The user object in the session does not seem to have the id field despite the following code,
        // and so we're currently accessing user.sub instead.
        id: token.sub,
      },
    }),
    jwt({ token, profile }) {
      if (profile) {
        token.id = profile.id
        token.image = profile.avatar_url || profile.picture
      }
      return token
    },
    authorized({ auth }) {
      return !!auth?.user // this ensures there is a logged in user for -every- request
    }
  },
  pages: {
    signIn: '/sign-in' // overrides the next-auth default signin page https://authjs.dev/guides/basics/pages
  }
})
