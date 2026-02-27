import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import handler from './api/calorieagent'

// Custom plugin to handle API routes
const apiPlugin = () => ({
  name: 'api-routes',
  configureServer(server) {
    return () => {
      server.middlewares.use('/api/calorieagent', async (req, res) => {
        if (req.method === 'POST') {
          const chunks = []
          for await (const chunk of req) {
            chunks.push(chunk)
          }
          const body = Buffer.concat(chunks).toString('utf-8')
          try {
            req.body = JSON.parse(body || '{}')
            await handler(req, res)
          } catch (error) {
            console.error('Error parsing body:', error)
            res.statusCode = 400
            res.end(JSON.stringify({ error: 'Invalid JSON', details: error instanceof Error ? error.message : String(error) }))
          }
        } else {
          res.statusCode = 405
          res.end('Method Not Allowed')
        }
      })
    }
  }
})

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), apiPlugin()],
})
