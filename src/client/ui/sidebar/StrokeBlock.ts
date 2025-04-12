import type { UiController } from '../../controller/UiController'
import { SidebarBlock } from './SidebarBlock'

const COLORS = ['black', 'white', 'red', 'green', 'purple', 'orange']

export class StrokeBlock extends SidebarBlock {
  colorButtons: Map<string, HTMLButtonElement> = new Map()
  strokeWidth: HTMLInputElement

  constructor(controller: UiController) {
    super(controller, 'Stroke')

    const widthContainer = document.createElement('div')
    widthContainer.classList.add('sizeContainer')

    this.strokeWidth = document.createElement('input')
    this.strokeWidth.classList.add('sizeSlider')
    this.strokeWidth.type = 'range'
    this.strokeWidth.min = '2'
    this.strokeWidth.max = '128'
    this.strokeWidth.value = '16'
    this.strokeWidth.addEventListener('input', () => {
      controller.stroke.size = parseFloat(this.strokeWidth.value)
    })
    widthContainer.append(this.strokeWidth)
    this.root.append(widthContainer)

    const cont = document.createElement('div')
    cont.classList.add('colorList')
    for (let color of COLORS) {
      const button = document.createElement('button')
      button.classList.add('colorButton')
      button.style.backgroundColor = color
      button.addEventListener('click', () => {
        controller.stroke.color = color
      })
      this.colorButtons.set(color, button)
      cont.append(button)
    }
    this.root.append(cont)

    this.controller.stroke.addEventListener('change', this.update)
    this.update()
  }

  update = () => {
    for (const [k, v] of this.colorButtons.entries()) {
      if (k === this.controller.stroke.color) {
        v.classList.add('active')
      } else {
        v.classList.remove('active')
      }
    }
    this.strokeWidth.value = this.controller.stroke.size.toString()
  }
}
