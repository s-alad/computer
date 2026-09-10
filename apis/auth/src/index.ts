import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { auth } from './auth'

const app = new Hono()
app.all('/api/auth/*', (c) => auth.handler(c.req.raw))

serve({ fetch: app.fetch, port: 3001 }, (info) => {
  console.log(`auth on :${info.port}`)
})
