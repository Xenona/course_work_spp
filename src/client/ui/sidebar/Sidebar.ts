import type { SidebarBlock } from './SidebarBlock'
import { StrokeBlock } from './StrokeBlock'
import './Sidebar.css'
import type { UiController } from '../../controller/UiController'

export class Sidebar {
  private _root: HTMLDivElement
  private blocks: SidebarBlock[]
  private controller: UiController

  constructor(controller: UiController) {
    this.controller = controller
    this._root = document.createElement('div')
    this._root.classList.add('sideBarRoot')

    this.blocks = [new StrokeBlock(controller)]

    this._root.append(...this.blocks.map((e) => e.root))
  }

  get root() {
    return this._root
  }
}
