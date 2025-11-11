import { BoardAnimation } from '@/model/board/BoardAnimation'
import type { Board } from '../model/board/Board'
import { BoardDrawing } from '../model/board/BoardDrawing'
import { BoardGroup } from '../model/board/BoardGroup'
import type { BoardObject } from '../model/board/BoardObject'
import { AnimationRenderer } from './AnimationRenderer'
import { DrawingRenderer } from './DrawingRenderer'
import { GroupRenderer } from './GroupRenderer'
import type { IRendererOverlay } from './IRendererOverlay'
import type { ObjectRenderer } from './ObjectRenderer'
import { ImageRenderer } from './ImageRenderer'
import { BoardImage } from '@/model/board/BoardImage'

export class Renderer {
  protected canvas: HTMLCanvasElement
  protected ctx: CanvasRenderingContext2D
  protected stagingCanvas: OffscreenCanvas
  protected stagingCtx: OffscreenCanvasRenderingContext2D

  protected shouldRun = false

  protected board: Board
  protected renderers: Map<string, ObjectRenderer>

  protected position: [number, number] = [0, 0]

  protected overlays: IRendererOverlay[]

  constructor(canvas: HTMLCanvasElement, board: Board) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')!
    this.stagingCanvas = new OffscreenCanvas(canvas.width, canvas.height)!
    this.stagingCtx = this.stagingCanvas.getContext('2d')!

    this.board = board
    this.renderers = new Map()
    this.overlays = []
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
      if (object instanceof BoardDrawing) {
        this.renderers.set(object.id, new DrawingRenderer(object))
      } else if (object instanceof BoardImage) {
        this.renderers.set(object.id, new ImageRenderer(object))
      } else if (object instanceof BoardAnimation) {
        this.renderers.set(object.id, new AnimationRenderer(object))
      } else if (object instanceof BoardGroup) {
        this.renderers.set(object.id, new GroupRenderer(object))
      } else {
        throw new Error('Unknown object ' + id + ' ' + object)
      }
    }

    return this.renderers.get(id)
  }

  render() {
    this.ctx.reset()
    this.ctx.translate(this.width / 2, this.height / 2)
    this.ctx.translate(this.position[0], this.position[1])

    this.ctx.clearRect(0, 0, this.width, this.height)

    const rootId = this.board.rootGroup
    this.getObjectRenderer(rootId.id)!.render(this, this.ctx)

    for (const overlay of this.overlays) {
      overlay.draw(this.ctx)
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
}
