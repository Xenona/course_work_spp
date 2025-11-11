import { BoardAnimation } from '@/model/board/objects/BoardAnimation'
import type { Board } from '../model/board/Board'
import { BoardDrawing } from '../model/board/objects/BoardDrawing'
import { BoardGroup } from '../model/board/BoardGroup'
import type { BoardObject } from '../model/board/BoardObject'
import type { IRendererOverlay } from './IRendererOverlay'
import type { ObjectRenderer } from './ObjectRenderer'
import { BoardImage } from '@/model/board/objects/BoardImage'
import { BoardShape } from '@/model/board/objects/BoardShape'
import { WrappingFactory } from '@/WrappingFactory'

export class Renderer {
  protected canvas: HTMLCanvasElement
  protected ctx: CanvasRenderingContext2D
  protected stagingCanvas: OffscreenCanvas
  protected stagingCtx: OffscreenCanvasRenderingContext2D

  protected shouldRun = false

  public board: Board
  protected renderers: Map<string, ObjectRenderer>

  protected position: [number, number] = [0, 0]

  protected overlays: IRendererOverlay[]
  protected factory: WrappingFactory<typeof BoardObject, typeof ObjectRenderer>

  protected endFrameCallbacks: (() => void)[] = []

  constructor(canvas: HTMLCanvasElement, board: Board) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')!
    this.stagingCanvas = new OffscreenCanvas(canvas.width, canvas.height)!
    this.stagingCtx = this.stagingCanvas.getContext('2d')!

    this.board = board
    this.renderers = new Map()
    this.overlays = []
    this.factory = new WrappingFactory()
  }

  registerRenderer<T extends typeof BoardObject>(a: T, b: typeof ObjectRenderer<InstanceType<T>>) {
    this.factory.register(a, b as typeof ObjectRenderer)
  }

  get width() {
    return this.canvas.width
  }

  get height() {
    return this.canvas.height
  }

  setPosition(position: [number, number]) {
    this.position = position
  }

  addOverlay(overlay: IRendererOverlay) {
    this.overlays.push(overlay)
  }

  getObjectRenderer(id: string) {
    if (!this.renderers.has(id)) {
      const object = this.board.objects.get(id)
      if (!object) throw new Error('Object not found')

      this.renderers.set(id, this.factory.construct(object))
    }

    return this.renderers.get(id)
  }

  render() {
    try {
      this.endFrameCallbacks = []
      this.ctx.reset()
      this.ctx.translate(this.width / 2, this.height / 2)
      this.ctx.translate(this.position[0], this.position[1])
  
      this.ctx.clearRect(0, 0, this.width, this.height)
  
      const rootId = this.board.rootGroup
      this.getObjectRenderer(rootId.id)!.render(this, this.ctx)
  
      for (const overlay of this.overlays) {
        overlay.draw(this.ctx)
      }

      this.endFrameCallbacks.forEach(cb => cb())
    } catch(e) {
      this.shouldRun = false;
      throw e;
    }
  }

  start() {
    this.shouldRun = true
    this.runner()
  }

  private runner() {
    if (!this.shouldRun) return

    requestAnimationFrame(() => this.runner())
    this.render()
  }

  onFrameEnd(cb: () => void) {
    this.endFrameCallbacks.push(cb)
  }
}
