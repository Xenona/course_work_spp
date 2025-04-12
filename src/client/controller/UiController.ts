import type { BoardUpdate } from '@/model/board/Update'
import { UiMouseController } from './UiMouseController'
import { UiPositionController } from './UiPositionController'
import { UiStrokeController } from './UiStrokeController'
import { UiToolController } from './UiToolController'
import type { UpdateDispatcher } from '@/dispatcher/Dispatcher'

export class UiController {
  stroke: UiStrokeController
  pos: UiPositionController
  tool: UiToolController
  mouseController: UiMouseController

  updateDispatcher: UpdateDispatcher

  constructor(updateDispatcher: UpdateDispatcher) {
    this.stroke = new UiStrokeController()
    this.pos = new UiPositionController()
    this.tool = new UiToolController()
    this.mouseController = new UiMouseController(this.tool)

    this.updateDispatcher = updateDispatcher
  }
}
