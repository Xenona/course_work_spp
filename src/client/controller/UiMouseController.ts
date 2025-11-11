import type { UiPositionController } from './UiPositionController'
import type { UiToolController } from './UiToolController'

export type BoardMouseEvent = {
  boardX: number
  boardY: number
  dx: number
  dy: number

  isLeftDown: boolean
  isRightDown: boolean
  isMiddleDown: boolean

  isShifted: boolean
}

export class UiMouseController extends EventTarget {
  tool: UiToolController
  constructor(tool: UiToolController) {
    super()

    this.tool = tool
  }

  deliverDown(e: BoardMouseEvent) {
    this.tool.currentTool?.mouseDown(e)
  }

  deliverUp(e: BoardMouseEvent) {
    this.tool.currentTool?.mouseUp(e)
  }

  deliverMove(e: BoardMouseEvent) {
    if (e.isMiddleDown) this.tool.panTool?.mouseMove(e)
    else this.tool.currentTool?.mouseMove(e)
    // this.dispatchEvent(new CustomEvent('move', { detail: e }))
  }
}
