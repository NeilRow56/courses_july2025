import 'server-only'

import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { db } from '@/db'
import { nextCookies } from 'better-auth/next-js'
import { schema } from '@/db/schema'
import VerifyEmail from '@/components/emails/verify-email'
import { Resend } from 'resend'
import ForgotPasswordEmail from '@/components/emails/reset-password'
import { env } from './env'

const resend = new Resend(env.RESEND_API_KEY)

export const auth = betterAuth({
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      resend.emails.send({
        from: `${env.EMAIL_SENDER_NAME} <${env.EMAIL_SENDER_ADDRESS}>`,
        to: user.email,
        subject: 'Verify your email',
        react: VerifyEmail({ username: user.name, verifyUrl: url })
      })
    },
    sendOnSignUp: true,
    autoSignInAfterVerification: true
  },
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      resend.emails.send({
        from: `${env.EMAIL_SENDER_NAME} <${env.EMAIL_SENDER_ADDRESS}>`,
        to: user.email,
        subject: 'Reset your password',
        react: ForgotPasswordEmail({
          username: user.name,
          resetUrl: url,
          userEmail: user.email
        })
      })
    },
    requireEmailVerification: true
  },
  session: {
    expiresIn: 30 * 24 * 60 * 60, // 30 days - default is 7 days
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60
    }
  },
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema
  }),

  plugins: [nextCookies()]
})

export type ErrorCode = keyof typeof auth.$ERROR_CODES | 'UNKNOWN'
