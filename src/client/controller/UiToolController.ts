import type { BoardMouseEvent } from './UiMouseController'

export interface ITool {
  mouseDown(e: BoardMouseEvent): void
  mouseMove(e: BoardMouseEvent): void
  mouseUp(e: BoardMouseEvent): void

  activate(): void
  deactivate(): void

  draw(ctx: CanvasRenderingContext2D): void

  name: string
}

export class UiToolController extends EventTarget {
  tools: ITool[]
  moveTool: ITool | null
  currentTool: ITool | null

  constructor() {
    super()

    this.tools = []
    this.moveTool = null
    this.currentTool = null
  }

  addMoveTool(tool: ITool) {
    this.moveTool = tool
    this.tools.push(tool)
  }

  addTool(tool: ITool) {
    this.tools.push(tool)
  }

  selectTool(tool: ITool) {
    this.currentTool?.deactivate()
    this.currentTool = tool
    this.currentTool?.activate()
    this.dispatchEvent(new CustomEvent('change'))
  }
}
