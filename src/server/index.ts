import { serve, type ServerWebSocket } from 'bun'
import uiIndex from '@/client/index.html'
import cassandra from 'cassandra-driver'
import { UpdatesSaver } from './UpdatesSaver'

const boardU = '0196923f-16d2-7000-a809-e308a0fd11b0'

export class Server {
  sockets: Set<ServerWebSocket<unknown>> = new Set()
  client: cassandra.Client
  updatesSaver: UpdatesSaver

  constructor() {
    this.client = new cassandra.Client({
      contactPoints: ['172.18.0.2'],
      localDataCenter: 'datacenter1',
      keyspace: 'boardy',
    })

    this.updatesSaver = new UpdatesSaver(this.client)
  }

  async connect() {
    this.client.connect()
  }

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
        async open(ws) {
          const prevUpds = await self.updatesSaver.getUpdates(boardU)
          for (let u of prevUpds) ws.send(u)
          self.sockets.add(ws)
        },
        close(ws) {
          self.sockets.delete(ws)
        },
        async message(ws, message) {
          await self.updatesSaver.saveUpdate(boardU, message as Buffer)
          for (const sock of self.sockets) {
            if (sock != ws) sock.send(message)
          }
        },
      },
    })
    console.log('Server started at http://localhost:3000')
  }
}
