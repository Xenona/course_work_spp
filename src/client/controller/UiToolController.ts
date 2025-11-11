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
  panTool: ITool | null
  currentTool: ITool | null

  defaultSelected: ITool | null
  defaultNotSelected: ITool | null

  constructor() {
    super()

    this.tools = []
    this.panTool = null
    this.currentTool = null
    this.defaultSelected = null
    this.defaultNotSelected = null
  }

  addPanTool(tool: ITool) {
    this.panTool = tool
    this.tools.push(tool)
  }

  addTool(
    tool: ITool,
    options: { defaultSelected?: boolean; defaultNotSelected?: boolean } = {}
  ) {
    this.tools.push(tool)

    if (options.defaultSelected) this.defaultSelected = tool
    if (options.defaultNotSelected) this.defaultNotSelected = tool
  }

  selectTool(tool: ITool) {
    this.currentTool?.deactivate()
    this.currentTool = tool
    this.currentTool?.activate()
    this.dispatchEvent(new CustomEvent('change'))
  }

  enableSelected() {
    if (this.defaultSelected) this.selectTool(this.defaultSelected)
  }

  enableNotSelected() {
    if (this.defaultNotSelected) this.selectTool(this.defaultNotSelected)
  }
}
