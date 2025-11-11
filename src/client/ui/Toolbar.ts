import type { UiController } from '../controller/UiController'
import './Toolbar.css'

const ICON_MAPPING: Record<string, string> = {
  selection: 'near_me',
  pan: 'pan_tool',
  move: 'open_with',
  brush: 'brush',
  image: 'image',
  shape: 'rectangle',
  spoiler: 'visibility_off',
  anchor: 'anchor',
  text: 'text_fields',
}

export class Toolbar {
  controller: UiController
  _root: HTMLDivElement
  buttons: Map<string, HTMLButtonElement>

  constructor(controller: UiController) {
    this.controller = controller
    this.buttons = new Map()
    this._root = document.createElement('div')
    this._root.classList.add('toolbarRoot')

    for (const t of controller.tool.tools) {
      const button = document.createElement('button')
      button.textContent = ICON_MAPPING[t.name]
      button.classList.add('material-icons')
      button.addEventListener('click', () => {
        controller.tool.selectTool(t)
      })
      this._root.append(button)
      this.buttons.set(t.name, button)
    }

    const gap = document.createElement('div')
    gap.style.flex = '1'
    this._root.append(gap);

    {
      const button = document.createElement('button')
      button.textContent = 'arrow_back'
      button.classList.add('material-icons')
      button.style.alignSelf = 'flex-end'
      button.addEventListener('click', () => {
        window.location.href += '/../..'
      })
      this._root.append(button)
    }

    this.controller.tool.addEventListener('change', this.update)
    this.update()

    document.body.addEventListener('keydown', (e) => {
      let targetTool: string | null = null

      if (e.key == 'b') targetTool = 'brush'
      if (e.key == 'm') targetTool = 'move'
      if (e.key == 's') targetTool = 'selection'
      if (e.key == 'r') targetTool = 'shape'

      if (targetTool) {
        const tool = controller.tool.tools.find((e) => e.name == targetTool)
        if (tool) controller.tool.selectTool(tool)
      }
    })
  }

  private update = () => {
    for (const [name, button] of this.buttons) {
      if (name === this.controller.tool.currentTool?.name)
        button.classList.add('active')
      else button.classList.remove('active')
    }
  }

  get root() {
    return this._root
  }
}
