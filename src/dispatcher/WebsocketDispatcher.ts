import type { BoardUpdate } from '@/model/board/Update'
import type { UpdateDispatcher } from './Dispatcher'

export class WebsocketDispatcher {
  websocket: WebSocket
  dispatcher: UpdateDispatcher

  skipUpdates: Set<BoardUpdate> = new Set<BoardUpdate>()

  constructor(path: string, dispatcher: UpdateDispatcher) {
    this.websocket = new WebSocket(path)
    this.dispatcher = dispatcher

    this.websocket.addEventListener('message', (e) => {
      const update = JSON.parse(e.data)
      this.skipUpdates.add(update)
      this.dispatcher.update(update)
    })

    this.dispatcher.addEventListener('update', (e) => {
      const update = (e as CustomEvent).detail
      if (this.skipUpdates.has(update)) {
        this.skipUpdates.delete(update)
      } else {
        this.websocket.send(JSON.stringify(update))
      }
    })
  }
}
