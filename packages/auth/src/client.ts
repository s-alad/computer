import { createAuthClient } from 'better-auth/react'
import { passkeyClient } from '@better-auth/passkey/client'

export function createClient(baseURL: string) {
  return createAuthClient({
    baseURL,
    fetchOptions: { credentials: 'include' },
    plugins: [passkeyClient()],
  })
}
