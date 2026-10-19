import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { auth, trustedOrigins } from './auth'

const app = new Hono()
app.use('/api/auth/*', cors({ origin: trustedOrigins, credentials: true }))
app.all('/api/auth/*', (c) => auth.handler(c.req.raw))

serve({ fetch: app.fetch, port: 3001 }, (info) => {
  console.log(`auth on :${info.port}`)
})
