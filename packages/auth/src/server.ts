import { betterAuth } from 'better-auth'
import { openAPI } from 'better-auth/plugins'
import { passkey } from '@better-auth/passkey'
import { drizzleAdapter } from '@better-auth/drizzle-adapter'
import * as schema from '@salad/db/schema'
import type { Db } from '@salad/db/index'

export interface AuthConfig {
  db: Db
  secret: string
  baseURL: string
  trustedOrigins: string[]
  rpID: string
}

export function createAuth(cfg: AuthConfig) {
  return betterAuth({
    database: drizzleAdapter(cfg.db, { provider: 'pg', schema }),
    secret: cfg.secret,
    baseURL: cfg.baseURL,
    trustedOrigins: cfg.trustedOrigins,
    plugins: [
      passkey({
        rpID: cfg.rpID,
        rpName: 'salad.computer',
        registration: {
          requireSession: false,
          resolveUser: async () => ({
            id: crypto.randomUUID(),
            name: `salad-${crypto.randomUUID().slice(0, 8)}`,
          }),
          afterVerification: async ({ ctx, user }) => {
            const created = await ctx.context.internalAdapter.createUser(
              { name: user.name, email: `${crypto.randomUUID()}@passkey.local` },
              { method: 'passkey' },
            )
            return { userId: created.id }
          },
        },
      }),
      openAPI(),
    ],
  })
}
