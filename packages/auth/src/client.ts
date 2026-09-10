import { createAuthClient } from 'better-auth/react'

export function createClient(baseURL: string) {
  return createAuthClient({ baseURL })
}
