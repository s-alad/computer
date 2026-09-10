import { betterAuth } from 'better-auth'
import { openAPI } from 'better-auth/plugins'
import { drizzleAdapter } from '@better-auth/drizzle-adapter'
import * as schema from '@salad/db/schema'
import type { Db } from '@salad/db/index'

export interface AuthConfig {
  db: Db
  secret: string
  baseURL: string
}

export function createAuth(cfg: AuthConfig) {
  return betterAuth({
    database: drizzleAdapter(cfg.db, { provider: 'pg', schema }),
    secret: cfg.secret,
    baseURL: cfg.baseURL,
    emailAndPassword: { enabled: true },
    plugins: [openAPI()],
  })
}
