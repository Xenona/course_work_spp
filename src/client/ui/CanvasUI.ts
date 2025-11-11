import type { UiController } from '../controller/UiController'
import type { BoardMouseEvent } from '../controller/UiMouseController'

export class CanvasUI {
  canvas: HTMLCanvasElement
  controller: UiController

  resizeObserver: ResizeObserver

  shouldSend: number

  constructor(controller: UiController, canvas: HTMLCanvasElement) {
    this.controller = controller
    this.canvas = canvas
    this.shouldSend = 0;

    this.resizeObserver = new ResizeObserver(() => {
      this.canvas.width = this.canvas.clientWidth
      this.canvas.height = this.canvas.clientHeight
    })
    this.resizeObserver.observe(document.body)

    this.canvas.addEventListener('mousedown', (e) => {
      this.shouldSend++
      this.controller.mouseController.deliverDown(this.translateToBoard(e))
    })

    document.body.addEventListener('mousemove', (e) => {
      if (this.shouldSend > 0)
        this.controller.mouseController.deliverMove(this.translateToBoard(e))
    })

    document.body.addEventListener('mouseup', (e) => {
      if (this.shouldSend > 0) {
        this.controller.mouseController.deliverUp(this.translateToBoard(e))
        this.shouldSend--
      }
    })
  }

  translateToBoard(e: MouseEvent): BoardMouseEvent {
    const rect = this.canvas.getBoundingClientRect();
    const translated = this.controller.pos.detranslate(
      e.clientX - rect.left - this.canvas.width / 2,
      e.clientY - rect.top - this.canvas.height / 2
    )

    return {
      dx: e.movementX,
      dy: e.movementY,
      boardX: translated[0],
      boardY: translated[1],
      isLeftDown: (e.buttons & 1) != 0,
      isRightDown: (e.buttons & 2) != 0,
      isMiddleDown: (e.buttons & 4) != 0,
      isShifted: e.shiftKey
    }
  }
}
