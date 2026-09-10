import { db } from '@salad/db/index'
import { createAuth } from '@salad/auth/server'

export const auth = createAuth({
  db,
  secret: process.env['BETTER_AUTH_SECRET']!,
  baseURL: process.env['BETTER_AUTH_URL']!,
})
