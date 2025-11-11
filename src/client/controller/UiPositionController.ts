export class UiPositionController extends EventTarget {
  x: number = 0
  y: number = 0

  constructor() {
    super()
  }

  move(x: number, y: number) {
    this.x += x
    this.y += y

    this.dispatchEvent(new CustomEvent('change'))
  }

  goto(x: number, y: number) {
    console.log(this.x, this.y, x, y)
    this.x = x
    this.y = y
    this.dispatchEvent(new CustomEvent('change'))
  }

  detranslate(x: number, y: number): [number, number] {
    return [x - this.x, y - this.y]
  }
}
