import type { SidebarBlock } from './SidebarBlock'
import { StrokeBlock } from './StrokeBlock'
import './Sidebar.css'
import type { UiController } from '../../controller/UiController'
import { ObjectsBlock } from './ObjectsBlock'
import { ObjectBlock } from './objects/ObjectBlock'
import { WrappingFactory } from '@/WrappingFactory'
import type { BoardObject } from '@/model/board/BoardObject'
import { ShapeBlock } from './objects/ShapeBlock'

export class Sidebar {
  private _root: HTMLDivElement
  private blocks: SidebarBlock[]
  private objectBlocks: ObjectBlock[]
  private controller: UiController

  constructor(controller: UiController) {
    this.controller = controller
    this._root = document.createElement('div')
    this._root.classList.add('sideBarRoot')

    this.blocks = [new ObjectsBlock(controller), new StrokeBlock(controller)]
    this.objectBlocks = [new ShapeBlock(controller)]

    this._root.append(...this.blocks.map((e) => e.root))

    controller.selection.addEventListener('change', () => {
      this.updateObjectBlocks()
    })
  }

  get root() {
    return this._root
  }

  updateObjectBlocks() {
    let ty: any | null = null
    for (const obj of this.controller.selection.objects) {
      if (ty === null) {
        console.log('update', obj)
        ty = Object.getPrototypeOf(obj)
      } else if (ty !== Object.getPrototypeOf(obj)) {
        ty = null
        break
      }
    }

    for (const block of this.objectBlocks) {
      if (ty === block.targetObject.prototype) {
        if (block.root.parentElement !== this._root)
          this._root.appendChild(block.root)
        block.updateObjects(this.controller.selection.objects)
      } else {
        if (block.root.parentElement === this._root)
          this._root.removeChild(block.root)
      }
    }
  }
}
