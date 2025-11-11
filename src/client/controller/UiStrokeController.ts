import type { BoardStrokeUpdate } from '@/model/board/Update'

type SaveData = {
  color: string
  size: number
}

export class UiStrokeController extends EventTarget {
  private _color: string
  private _size: number

  private saves: SaveData[]

  constructor() {
    super()

    this._color = 'black'
    this._size = 4
    this.saves = []
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

  save() {
    this.saves.push({
      color: this.color,
      size: this.size,
    })
  }

  restore() {
    const save = this.saves.pop()
    if (save) {
      this.color = save.color
      this.size = save.size
    }
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
