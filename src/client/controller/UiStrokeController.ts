import type { BoardStrokeUpdate } from "@/model/board/Update"

export class UiStrokeController extends EventTarget {
  private _color: string
  private _size: number

  constructor() {
    super()

    this._color = 'black'
    this._size = 4
  }

  get color() {
    return this._color
  }

  get size() {
    return this._size
  }

  set color(color: string) {
    this._color = color
    this.dispatchEvent(new Event('change'))
  }

  set size(size: number) {
    this._size = size
    this.dispatchEvent(new Event('change'))
  }

  generateUpdate(objId: string): BoardStrokeUpdate {
    return {
      type: 'setStroke',
      id: objId,
      size: this.size,
      color: this.color,
    }
  }
}
