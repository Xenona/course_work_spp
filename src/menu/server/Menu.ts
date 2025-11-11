import cassandra from 'cassandra-driver'
import { BoardManager } from './BoardManager'

export class ServerMenu {
  boardManager: BoardManager

  constructor(client: cassandra.Client) {
    this.boardManager = new BoardManager(client)
  }

  getRoutes() {
    return {
      '/api/boards': async (req: Bun.BunRequest) => {
        if (req.method == 'PUT') {
          let targetName
          try {
            const body = await req.json()
            targetName = body.name
            if (typeof targetName != 'string' || targetName.length == 0)
              throw new Error('Invalid name')
          } catch (e) {
            return new Response('Invalid body', { status: 400 })
          }

          const newB = await this.boardManager.createBoard(targetName)
          return Response.json(newB)
        }

        if (req.method == 'GET') {
          return Response.json(await this.boardManager.getBoards())
        }

        return new Response('Invalid method', { status: 405 })
      },
    }
  }
}
