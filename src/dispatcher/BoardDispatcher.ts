import type { Board } from '@/model/board/Board'
import type { UpdateDispatcher } from './Dispatcher'

export class BoardDispatcher {
  board: Board
  dispatcher: UpdateDispatcher

  constructor(board: Board, dispatcher: UpdateDispatcher) {
    this.board = board
    this.dispatcher = dispatcher

    this.dispatcher.addEventListener('update', this.onUpdate)
  }

  onUpdate = (e: Event) => {
    const update = (e as CustomEvent).detail
    this.board.update(update)
  }
}
