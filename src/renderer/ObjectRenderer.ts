import type { BoardObject } from '../model/board/BoardObject'
import type { Renderer } from './Renderer'

export class ObjectRenderer<T extends BoardObject = BoardObject> {
  target: T

  constructor(target: T) {
    console.log(target)
    this.target = target
  }

  protected draw(ctx: CanvasRenderingContext2D) {}

  public render(r: Renderer, ctx: CanvasRenderingContext2D) {
    this.draw(ctx)
  }
}
