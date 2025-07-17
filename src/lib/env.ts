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

    EMAIL_SENDER_ADDRESS: z.email(),
    ARCJET_KEY: z.string().min(1),
    AWS_ACCESS_KEY_ID: z.string().min(1),
    AWS_SECRET_ACCESS_KEY: z.string().min(1),
    AWS_ENDPOINT_URL_S3: z.string().min(1),
    AWS_ENDPOINT_URL_IAM: z.string().min(1),
    AWS_REGION: z.string().min(1)
  },

  client: {
    NEXT_PUBLIC_S3_BUCKET_NAME: z.string().min(1)
  },

  experimental__runtimeEnv: {
    NEXT_PUBLIC_S3_BUCKET_NAME: process.env.NEXT_PUBLIC_S3_BUCKET_NAME
  }
})
