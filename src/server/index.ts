import { serve, type ServerWebSocket } from 'bun'
import uiIndex from '@/client/index.html'

export class Server {
  sockets: Set<ServerWebSocket<unknown>> = new Set()

  constructor() {}

  start() {
    const self = this
    serve({
      port: 3000,
      routes: {
        '/': uiIndex,
        '/ws': async (req, server) => {
          if (server.upgrade(req)) {
            return new Response('Upgraded')
          }
          return new Response('Upgrade failed', { status: 500 })
        },
      },
      websocket: {
        open(ws) {
          self.sockets.add(ws)
        },
        close(ws) {
          self.sockets.delete(ws)
        },
        message(ws, message) {
          for (const sock of self.sockets) {
            if (sock != ws) sock.send(message)
          }
        },
      },
    })
    console.log('Server started at http://localhost:3000')
  }
}
