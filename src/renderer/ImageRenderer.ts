import type { BoardImage } from '@/model/board/objects/BoardImage'
import type { BoardDrawing } from '../model/board/objects/BoardDrawing'
import { ObjectRenderer } from './ObjectRenderer'

export class ImageRenderer extends ObjectRenderer<BoardImage> {
  img: HTMLImageElement

  constructor(target: BoardImage) {
    super(target)
    this.img = new Image()
  }

  protected draw(ctx: CanvasRenderingContext2D) {
    const s = '/assets/get/' + this.target.src
    if (this.img.src.indexOf(s) == -1) {
      console.log(s, this.img.src)
      this.img.src = s
    }
    // console.log(this.target.posX, this.img)

    const w = this.target.width
    const h = this.target.height
    try {
      ctx.drawImage(
        this.img,
        this.target.posX - this.target.width / 2,
        this.target.posY - this.target.height / 2,
        this.target.width,
        this.target.height
      )
    } catch(e) {}
  }
}
