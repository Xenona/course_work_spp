import type { BoardUpdate } from '@/model/board/Update'
import { UiMouseController } from './UiMouseController'
import { UiPositionController } from './UiPositionController'
import { UiStrokeController } from './UiStrokeController'
import { UiToolController } from './UiToolController'
import type { UpdateDispatcher } from '@/dispatcher/Dispatcher'
import type { Board } from '@/model/board/Board'
import { UiSelectionController } from './UiSelectionController'

export class UiController {
  stroke: UiStrokeController
  pos: UiPositionController
  tool: UiToolController
  mouseController: UiMouseController
  selection: UiSelectionController

  board: Board
  updateDispatcher: UpdateDispatcher

  constructor(board: Board, updateDispatcher: UpdateDispatcher) {
    this.board = board
    this.updateDispatcher = updateDispatcher

    this.stroke = new UiStrokeController()
    this.pos = new UiPositionController()
    this.tool = new UiToolController()
    this.mouseController = new UiMouseController(this.tool)
    this.selection = new UiSelectionController(board)
  }
}
