import { Sidebar } from '@/client/ui/sidebar/Sidebar'
import './RootUI.css'
import type { Renderer } from '@/renderer/Renderer'
import type { UiController } from '@/client/controller/UiController'
import { CanvasUI } from './CanvasUI'
import { Toolbar } from './Toolbar'

export class RootUI {
  canvas: HTMLCanvasElement
  controller: UiController

  sideBar: Sidebar
  toolBar: Toolbar
  canvasUI: CanvasUI

  constructor(controller: UiController) {
    this.controller = controller
    this.canvas = document.createElement('canvas')

    this.canvasUI = new CanvasUI(controller, this.canvas)
    this.sideBar = new Sidebar(controller)
    this.toolBar = new Toolbar(controller);
  }

  addRenderer(
    createRenderer: (canvas: HTMLCanvasElement) => Renderer
  ): Renderer {
    return createRenderer(this.canvas)
  }

  attach(root: HTMLElement) {
    root.classList.add('rootUI')
    root.append(this.canvas)
    root.append(this.sideBar.root)
    root.append(this.toolBar.root)
  }
}
