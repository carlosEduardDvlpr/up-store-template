import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  server: {
    APP_URL: z.string().url().optional().default('http://localhost:3001'),
    DATABASE_URL: z.string().url().optional().default('http://localhost:8000'),
    DATABASE_API_SECRET_KEY: z.string().optional().default('api-secret-key'),
    COMPANY_ID: z.string().optional().default('1234-5678-90'),
    OPENAI_API_KEY: z.string().optional(),
  },

  client: {
    NEXT_PUBLIC_API_BASE_URL: z.string().url().optional().default('http://localhost:3000/api'),
  },

  runtimeEnv: {
    APP_URL: process.env.APP_URL,
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    DATABASE_URL: process.env.DATABASE_URL,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    DATABASE_API_SECRET_KEY: process.env.DATABASE_API_SECRET_KEY,
    COMPANY_ID: process.env.COMPANY_ID,
  },
})
