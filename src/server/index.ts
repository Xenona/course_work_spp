import { serve, type ServerWebSocket, S3Client } from 'bun'
import uiIndex from '@/client/index.html'
import menuIndex from '@/menu/ui/index.html'
import cassandra from 'cassandra-driver'
import { UpdatesSaver } from './UpdatesSaver'
import { ServerMenu } from '../menu/server/Menu'
import { AssetApi } from './UploadApi'


const boardU = '0196923f-16d2-7000-a809-e308a0fd11b0'

export class Server {
  rooms: Map<string, Set<ServerWebSocket<unknown>>> = new Map()
  client: cassandra.Client
  s3: Bun.S3Client
  
  updatesSaver: UpdatesSaver
  serverMenu: ServerMenu
  uploader: AssetApi

  constructor() {
    this.client = new cassandra.Client({
      contactPoints: [process.env.SCYLLA_ENDPOINT ?? ''],
      localDataCenter: 'datacenter1',
      keyspace: 'boardy',
    })

    this.s3 = new S3Client({
      accessKeyId: process.env.S3_ACCESS_TOKEN,
      secretAccessKey: process.env.S3_SECRET_KEY,
      bucket: "boardy",
      endpoint: process.env.S3_ENDPOINT, // MinIO
    });

    this.updatesSaver = new UpdatesSaver(this.client)
    this.serverMenu = new ServerMenu(this.client)
    this.uploader = new AssetApi(this.s3)
  }

  async connect() {
    this.client.connect()
  }

  start() {
    const self = this
    serve({
      port: 3000,
      routes: {
        '/': menuIndex,
        '/boards/:uuid': uiIndex,
        '/boards/:uuid/ws': async (req, server) => {
          if (server.upgrade(req, { data: { uuid: req.params.uuid } })) {
            return new Response('Upgraded')
          }
          return new Response('Upgrade failed', { status: 500 })
        },
        ...this.serverMenu.getRoutes(),
        ...this.uploader.getRoutes()
      },
      websocket: {
        async open(ws: ServerWebSocket<{ uuid: string }>) {
          let room = self.rooms.get(ws.data.uuid)
          if (!room) {
            room = new Set()
            self.rooms.set(ws.data.uuid, room)
          }

          const prevUpds = await self.updatesSaver.getUpdates(ws.data.uuid)
          for (let u of prevUpds) ws.send(u)
          room.add(ws)
        },
        close(ws) {
          const room = self.rooms.get(ws.data.uuid)
          if (room) room.delete(ws)
        },
        async message(ws, message) {
          const room = self.rooms.get(ws.data.uuid)
          if (!room) return

          await self.updatesSaver.saveUpdate(ws.data.uuid, message as Buffer)
          for (const sock of room) {
            if (sock != ws) sock.send(message)
          }
        },
      },
    })
    console.log('Server started at http://localhost:3000')
  }
}
