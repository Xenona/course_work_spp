import type { BoardUpdate } from '@/model/board/Update'
import type { UpdateDispatcher } from './Dispatcher'
import { serializeSmart, deserializeSmart } from 'tybii-core'
import {
  write_BoardUpdate,
  read_BoardUpdate,
} from '../../gen/tybii_board_update'

let perfCounterJson = 0
let perfCountereOpt = 0

export class WebsocketDispatcher {
  websocket: WebSocket
  dispatcher: UpdateDispatcher

  skipUpdates: Set<BoardUpdate> = new Set<BoardUpdate>()

  constructor(path: string, dispatcher: UpdateDispatcher) {
    this.websocket = new WebSocket(path)
    this.websocket.binaryType = "arraybuffer"
    this.dispatcher = dispatcher

    this.websocket.addEventListener(
      'message',
      async (e: MessageEvent<ArrayBuffer>) => {
        const update = deserializeSmart(
          e.data,
          read_BoardUpdate
        )
        this.skipUpdates.add(update)
        this.dispatcher.update(update)
      }
    )

    this.dispatcher.addEventListener('update', (e) => {
      const update = (e as CustomEvent).detail
      if (this.skipUpdates.has(update)) {
        this.skipUpdates.delete(update)
      } else {
        this.sendUpdate(update)
      }
    })
  }

  sendUpdate(upd: BoardUpdate) {
    const serialized = serializeSmart(upd, write_BoardUpdate)
    perfCounterJson += JSON.stringify(upd).length
    perfCountereOpt += serialized.byteLength
    this.websocket.send(serialized)
  }
}
