import { createClient } from '@salad/auth/client'

export const authClient = createClient(import.meta.env['VITE_AUTH_URL'])
