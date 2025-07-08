import { createEnv } from '@t3-oss/env-nextjs' // or core package
import { z } from 'zod/v4'

export const env = createEnv({
  /*
   * Serverside Environment variables, not available on the client.
   * Will throw if you access these variables on the client.
   */
  server: {
    DATABASE_URL: z.url(),

    RESEND_API_KEY: z.string().min(1),

    EMAIL_SENDER_NAME: z.string().min(1),

    EMAIL_SENDER_ADDRESS: z.email()
  },

  experimental__runtimeEnv: {}
})
